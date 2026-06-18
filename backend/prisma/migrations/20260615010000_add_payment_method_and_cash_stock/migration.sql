CREATE TYPE "PaymentMethod" AS ENUM ('MERCADOPAGO', 'CASH');

ALTER TABLE "Order"
  ADD COLUMN "stockProcessedAt" TIMESTAMP(3),
  ADD COLUMN "stockRestoredAt" TIMESTAMP(3);

ALTER TABLE "Order"
  ALTER COLUMN "paymentMethod" TYPE "PaymentMethod"
  USING (
    CASE
      WHEN "paymentMethod" = 'CASH' THEN 'CASH'::"PaymentMethod"
      ELSE 'MERCADOPAGO'::"PaymentMethod"
    END
  ),
  ALTER COLUMN "paymentMethod" SET DEFAULT 'MERCADOPAGO',
  ALTER COLUMN "paymentMethod" SET NOT NULL;
