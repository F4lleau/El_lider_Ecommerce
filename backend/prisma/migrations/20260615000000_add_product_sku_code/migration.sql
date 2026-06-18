ALTER TABLE "Product" ADD COLUMN "sku" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "productSku" TEXT;

CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
