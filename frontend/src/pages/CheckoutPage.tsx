import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Banknote, CreditCard, MapPin, PackageCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/features/auth/store";
import { useCartStore } from "@/features/cart/store";
import { ordersApi } from "@/features/orders/api";
import { usersService } from "@/services/users.service";
import type { CheckoutPayload, CheckoutSummary, DeliveryMethod, PaymentMethod, ShippingAddress } from "@/types/order";
import type { UserAddress } from "@/types/user";
import { deliveryMethodLabel, paymentMethodLabel } from "@/utils/order-labels";

type CustomerForm = {
  name: string;
  email: string;
  phone: string;
};

type CheckoutAddress = Required<Pick<ShippingAddress, "recipient" | "phone" | "street" | "number" | "city" | "province" | "postalCode">> &
  Pick<ShippingAddress, "apartment" | "references">;

const emptyAddress: CheckoutAddress = {
  recipient: "",
  phone: "",
  street: "",
  number: "",
  apartment: "",
  city: "",
  province: "",
  postalCode: "",
  references: "",
};

const shippingFields = [
  { key: "recipient", label: "Destinatario", autoComplete: "name", required: true },
  { key: "phone", label: "Teléfono", autoComplete: "tel", required: true },
  { key: "street", label: "Calle", autoComplete: "address-line1", required: true },
  { key: "number", label: "Altura", autoComplete: "address-line2", required: true },
  { key: "city", label: "Localidad", autoComplete: "address-level2", required: true },
  { key: "province", label: "Provincia", autoComplete: "address-level1", required: true },
  { key: "postalCode", label: "Código postal", autoComplete: "postal-code", required: true },
  { key: "references", label: "Referencias", autoComplete: "off", required: false },
] as const;

const money = (value: number) =>
  value.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

const userFullName = (user: { firstName: string; lastName: string } | null) =>
  user ? `${user.firstName} ${user.lastName}` : "";

const addressLine = (address: CheckoutAddress) =>
  `${address.street} ${address.number}${address.apartment ? `, ${address.apartment}` : ""}, ${address.city}, ${address.province} (${address.postalCode})`;

const toCheckoutAddress = (address: UserAddress, fallbackCustomer: CustomerForm): CheckoutAddress => ({
  recipient: address.recipient || fallbackCustomer.name,
  phone: address.phone ?? fallbackCustomer.phone,
  street: address.street,
  number: address.number,
  apartment: address.apartment ?? "",
  city: address.city,
  province: address.state ?? "",
  postalCode: address.postalCode,
  references: "",
});

const CustomerFields = ({
  customer,
  onChange,
  lockIdentity,
}: {
  customer: CustomerForm;
  onChange: (customer: CustomerForm) => void;
  lockIdentity: boolean;
}) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <div>
      <Label htmlFor="customer-name">Nombre</Label>
      <Input
        id="customer-name"
        required
        disabled={lockIdentity}
        value={customer.name}
        onChange={(event) => onChange({ ...customer, name: event.target.value })}
      />
    </div>
    <div>
      <Label htmlFor="customer-email">Email</Label>
      <Input
        id="customer-email"
        required
        type="email"
        disabled={lockIdentity}
        value={customer.email}
        onChange={(event) => onChange({ ...customer, email: event.target.value })}
      />
    </div>
    <div>
      <Label htmlFor="customer-phone">Teléfono</Label>
      <Input
        id="customer-phone"
        required
        autoComplete="tel"
        value={customer.phone}
        onChange={(event) => onChange({ ...customer, phone: event.target.value })}
      />
    </div>
  </div>
);

const ShippingAddressFields = ({
  address,
  onChange,
}: {
  address: CheckoutAddress;
  onChange: (address: CheckoutAddress) => void;
}) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {shippingFields.map((field) => (
      <div key={field.key}>
        <Label htmlFor={`shipping-${field.key}`}>{field.label}</Label>
        <Input
          id={`shipping-${field.key}`}
          required={field.required}
          autoComplete={field.autoComplete}
          value={address[field.key] ?? ""}
          onChange={(event) => onChange({ ...address, [field.key]: event.target.value })}
        />
      </div>
    ))}
  </div>
);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { cart, clear } = useCartStore();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("PICKUP");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MERCADOPAGO");
  const [customer, setCustomer] = useState<CustomerForm>({ name: userFullName(user), email: user?.email ?? "", phone: "" });
  const [address, setAddress] = useState<CheckoutAddress>(emptyAddress);
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | "custom" | null>(null);
  const [isEditingCustomer, setIsEditingCustomer] = useState(!user);
  const [isEditingRecipient, setIsEditingRecipient] = useState(false);
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const items = useMemo(() => cart.items.map(({ productId, quantity }) => ({ productId, quantity })), [cart.items]);
  const selectedSavedAddress = savedAddresses.find((item) => item.id === selectedAddressId) ?? null;
  const defaultAddress = savedAddresses.find((item) => item.isDefault) ?? savedAddresses[0] ?? null;
  const lockCustomerIdentity = Boolean(user) && !isEditingCustomer;
  const shouldShowCustomerForm = !user || isEditingCustomer || !customer.phone.trim();
  const shouldShowAddressForm = !user || selectedAddressId === "custom" || savedAddresses.length === 0;

  const buildPayload = (): CheckoutPayload => {
    const pickupChanged = user && deliveryMethod === "PICKUP" && customer.name.trim() !== userFullName(user);
    return {
      deliveryMethod,
      paymentMethod,
      customer,
      items,
      ...(deliveryMethod === "SHIPPING" ? { address } : {}),
      ...(pickupChanged ? { notes: `Retira: ${customer.name}. Telefono: ${customer.phone}` } : {}),
    };
  };

  useEffect(() => {
    if (!user) return;
    setCustomer((current) => ({
      name: current.name || userFullName(user),
      email: current.email || user.email,
      phone: current.phone,
    }));
    setIsEditingCustomer(false);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    usersService
      .listAddresses()
      .then((addresses) => {
        setSavedAddresses(addresses);
        const preferred = addresses.find((item) => item.isDefault) ?? addresses[0] ?? null;
        if (!preferred) return;
        setSelectedAddressId(preferred.id);
        setAddress((current) => toCheckoutAddress(preferred, { ...customer, phone: current.phone || customer.phone }));
        if (!customer.phone && preferred.phone) {
          setCustomer((current) => ({ ...current, phone: preferred.phone ?? current.phone }));
        }
      })
      .catch((caught) => {
        setAddressError(caught instanceof Error ? caught.message : "No se pudieron cargar tus direcciones guardadas");
      });
  }, [user]);

  useEffect(() => {
    if (deliveryMethod !== "SHIPPING" || selectedAddressId || !defaultAddress) return;
    setSelectedAddressId(defaultAddress.id);
    setAddress(toCheckoutAddress(defaultAddress, customer));
  }, [deliveryMethod, selectedAddressId, defaultAddress, customer]);

  useEffect(() => {
    if (!cart.items.length || !customer.phone) return;
    const timer = window.setTimeout(
      () => void ordersApi.validate(buildPayload()).then(setSummary).catch(() => setSummary(null)),
      250,
    );
    return () => window.clearTimeout(timer);
  }, [
    deliveryMethod,
    paymentMethod,
    customer.phone,
    address.recipient,
    address.phone,
    address.city,
    address.street,
    address.number,
    cart.items.length,
  ]);

  const selectSavedAddress = (value: string) => {
    if (value === "custom") {
      setSelectedAddressId("custom");
      setAddress({ ...emptyAddress, recipient: customer.name, phone: customer.phone });
      setIsChangingAddress(false);
      setIsEditingRecipient(false);
      return;
    }

    const id = Number(value);
    const selected = savedAddresses.find((item) => item.id === id);
    if (!selected) return;
    setSelectedAddressId(id);
    setAddress(toCheckoutAddress(selected, customer));
    setIsChangingAddress(false);
    setIsEditingRecipient(false);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const order = await ordersApi.checkout(buildPayload());
      await clear();
      navigate("/checkout/confirmacion", { state: { order } });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo crear la orden");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items.length) {
    return (
      <div className="section-shell">
        <div className="empty-state mx-auto max-w-xl">
          <h1 className="section-title">Tu carrito está vacío</h1>
          <p className="mt-3 text-muted-foreground">Agregá productos antes de iniciar el checkout.</p>
          <Button className="mt-5" asChild>
            <Link to="/productos">Ver productos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-shell">
      <div className="mb-8">
        <span className="eyebrow">Último paso</span>
        <h1 className="section-title">Checkout</h1>
      </div>

      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-3xl border bg-card p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-xl font-bold">
                  {deliveryMethod === "PICKUP" ? "Datos de quien retira" : "Datos del comprador"}
                </h2>
                {user ? <p className="text-sm text-muted-foreground">Usamos tus datos de perfil por defecto.</p> : null}
              </div>
              {user && !shouldShowCustomerForm ? (
                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditingCustomer(true)}>
                  {deliveryMethod === "PICKUP" ? "Cambiar datos de quien retira" : "Cambiar datos"}
                </Button>
              ) : null}
            </div>

            {shouldShowCustomerForm ? (
              <CustomerFields customer={customer} onChange={setCustomer} lockIdentity={lockCustomerIdentity} />
            ) : (
              <div className="rounded-2xl bg-secondary p-4 text-sm">
                <p className="font-bold">{customer.name}</p>
                <p className="text-muted-foreground">{customer.email}</p>
                <p className="text-muted-foreground">{customer.phone}</p>
              </div>
            )}
          </section>

          <section className="rounded-3xl border bg-card p-5">
            <h2 className="mb-4 font-heading text-xl font-bold">Entrega</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant={deliveryMethod === "PICKUP" ? "default" : "outline"}
                onClick={() => setDeliveryMethod("PICKUP")}
              >
                <PackageCheck />
                {deliveryMethodLabel("PICKUP")}
              </Button>
              <Button
                type="button"
                variant={deliveryMethod === "SHIPPING" ? "default" : "outline"}
                onClick={() => setDeliveryMethod("SHIPPING")}
              >
                <Truck />
                {deliveryMethodLabel("SHIPPING")}
              </Button>
            </div>

            {deliveryMethod === "PICKUP" ? (
              <p className="mt-4 rounded-2xl bg-secondary p-4 text-sm">
                <MapPin className="mr-2 inline h-4 w-4" />
                Retiro en sucursal, sin costo.
              </p>
            ) : (
              <div className="mt-5 space-y-4">
                {addressError ? <p className="rounded-2xl bg-destructive/10 p-3 text-sm text-destructive">{addressError}</p> : null}

                {user && savedAddresses.length > 0 && selectedSavedAddress && selectedAddressId !== "custom" ? (
                  <div className="rounded-2xl bg-secondary p-4 text-sm">
                    <p className="font-bold">{selectedSavedAddress.label || "Dirección guardada"}</p>
                    <p className="mt-1 text-muted-foreground">{addressLine(address)}</p>
                    <p className="mt-1 text-muted-foreground">
                      Recibe: {address.recipient}
                      {address.phone ? ` - ${address.phone}` : ""}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => setIsChangingAddress(true)}>
                        Cambiar dirección de envío
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setIsEditingRecipient(true)}>
                        Cambiar datos de quien recibe
                      </Button>
                    </div>
                  </div>
                ) : null}

                {isChangingAddress ? (
                  <div className="space-y-2">
                    <Label htmlFor="saved-address">Dirección de envío</Label>
                    <select
                      id="saved-address"
                      className="admin-select"
                      value={selectedAddressId ?? ""}
                      onChange={(event) => selectSavedAddress(event.target.value)}
                    >
                      {savedAddresses.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label || `${item.street} ${item.number}, ${item.city}`}
                          {item.isDefault ? " - principal" : ""}
                        </option>
                      ))}
                      <option value="custom">Usar otra dirección</option>
                    </select>
                  </div>
                ) : null}

                {isEditingRecipient && selectedAddressId !== "custom" ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="shipping-recipient">Destinatario</Label>
                      <Input
                        id="shipping-recipient"
                        required
                        value={address.recipient}
                        onChange={(event) => setAddress({ ...address, recipient: event.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipping-phone">Teléfono</Label>
                      <Input
                        id="shipping-phone"
                        required
                        value={address.phone}
                        onChange={(event) => setAddress({ ...address, phone: event.target.value })}
                      />
                    </div>
                  </div>
                ) : null}

                {shouldShowAddressForm ? <ShippingAddressFields address={address} onChange={setAddress} /> : null}
              </div>
            )}
          </section>

          <section className="rounded-3xl border bg-card p-5">
            <h2 className="mb-4 font-heading text-xl font-bold">Método de pago</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant={paymentMethod === "MERCADOPAGO" ? "default" : "outline"}
                onClick={() => setPaymentMethod("MERCADOPAGO")}
              >
                <CreditCard />
                {paymentMethodLabel("MERCADOPAGO")}
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "CASH" ? "default" : "outline"}
                onClick={() => setPaymentMethod("CASH")}
              >
                <Banknote />
                {paymentMethodLabel("CASH")}
              </Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {paymentMethod === "CASH"
                ? deliveryMethod === "PICKUP"
                  ? "Pagás al retirar en sucursal."
                  : "Pagás al recibir el pedido."
                : "Pagás online mediante Mercado Pago."}
            </p>
          </section>
        </div>

        <aside className="h-fit rounded-3xl border bg-card p-5 shadow-elevated">
          <h2 className="font-heading text-xl font-bold">Resumen</h2>
          <div className="my-4 space-y-2 text-sm">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex justify-between gap-3">
                <span>
                  {item.quantity} x {item.product.name}
                </span>
                <span>{money(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{money(summary?.summary.subtotal ?? cart.summary.subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Envío</span>
              <span>{money(summary?.summary.shippingCost ?? 0)}</span>
            </div>
            <div className="mt-4 flex justify-between font-heading text-xl font-bold">
              <span>Total</span>
              <span>{money(summary?.summary.total ?? cart.summary.subtotal)}</span>
            </div>
          </div>
          {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
          <Button className="mt-5 w-full" size="lg" disabled={loading}>
            {loading ? "Creando orden..." : paymentMethod === "MERCADOPAGO" ? "Crear pedido y pagar" : "Confirmar pedido"}
          </Button>
        </aside>
      </form>
    </div>
  );
}
