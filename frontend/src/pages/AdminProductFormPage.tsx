import { useParams } from "react-router-dom";
import { AdminError, AdminLoading } from "@/components/admin/AdminState";
import { ProductForm } from "@/components/admin/ProductForm";
import { adminProductsApi } from "@/features/admin/api";
import { useAdminData } from "@/features/admin/use-admin-data";

export default function AdminProductFormPage() {
  const id = Number(useParams().id); const editing = Number.isInteger(id) && id > 0;
  const loader = editing ? () => adminProductsApi.get(id) : async () => null;
  const { data, isLoading, error } = useAdminData(loader);
  if (isLoading) return <AdminLoading />; if (error) return <AdminError message={error} />;
  return <div><div className="mb-7"><span className="eyebrow">Catálogo</span><h1 className="section-title">{editing ? "Editar producto" : "Nuevo producto"}</h1></div><ProductForm product={data ?? undefined} /></div>;
}
