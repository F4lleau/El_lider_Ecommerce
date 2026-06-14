CREATE TYPE "OrderStatus" AS ENUM ('PENDING_PAYMENT', 'PAID', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED', 'COMPLETED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'REFUNDED', 'IN_PROCESS');
CREATE TYPE "DeliveryMethod" AS ENUM ('PICKUP', 'SHIPPING');

ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";
ALTER TABLE "Order" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "Order" ADD COLUMN "orderNumber" TEXT;
ALTER TABLE "Order" ADD COLUMN "trackingCode" TEXT;
ALTER TABLE "Order" ADD COLUMN "guestName" TEXT;
ALTER TABLE "Order" ADD COLUMN "guestEmail" TEXT;
ALTER TABLE "Order" ADD COLUMN "guestPhone" TEXT;
ALTER TABLE "Order" ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "Order" ADD COLUMN "deliveryMethod" "DeliveryMethod" NOT NULL DEFAULT 'PICKUP';
ALTER TABLE "Order" ADD COLUMN "subtotal" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN "shippingCost" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN "total" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN "shippingRecipient" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingPhone" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingStreet" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingNumber" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingFloor" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingApartment" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingCity" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingProvince" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingPostalCode" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingReferences" TEXT;

UPDATE "Order" SET
  "orderNumber" = 'LEGACY-' || "id",
  "trackingCode" = 'LEGACY-' || "id",
  "subtotal" = "totalAmount",
  "total" = "totalAmount";

ALTER TABLE "Order" ALTER COLUMN "orderNumber" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "trackingCode" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "orderNumber" SET DEFAULT gen_random_uuid()::text;
ALTER TABLE "Order" ALTER COLUMN "trackingCode" SET DEFAULT gen_random_uuid()::text;
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus" USING (
  CASE WHEN "status" IN ('PAID','CONFIRMED','PREPARING','READY_FOR_PICKUP','SHIPPED','DELIVERED','CANCELLED','REFUNDED','COMPLETED')
  THEN "status"::"OrderStatus" ELSE 'PENDING_PAYMENT'::"OrderStatus" END
);
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING_PAYMENT';

CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE UNIQUE INDEX "Order_trackingCode_key" ON "Order"("trackingCode");
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "OrderItem" ADD COLUMN "productName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "OrderItem" ADD COLUMN "productSlug" TEXT NOT NULL DEFAULT '';
UPDATE "OrderItem" oi SET "productName" = p."name", "productSlug" = p."slug" FROM "Product" p WHERE oi."productId" = p."id";
