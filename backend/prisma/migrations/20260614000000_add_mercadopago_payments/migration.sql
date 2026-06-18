CREATE TYPE "PaymentProvider" AS ENUM ('MERCADOPAGO');

CREATE TABLE "Payment" (
  "id" SERIAL NOT NULL,
  "orderId" INTEGER NOT NULL,
  "provider" "PaymentProvider" NOT NULL DEFAULT 'MERCADOPAGO',
  "providerPaymentId" TEXT,
  "providerPreferenceId" TEXT,
  "externalReference" TEXT NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "amount" DECIMAL(10,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'ARS',
  "rawResponse" JSONB,
  "paidAt" TIMESTAMP(3),
  "stockProcessedAt" TIMESTAMP(3),
  "processingError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Payment_providerPaymentId_key" ON "Payment"("providerPaymentId");
CREATE UNIQUE INDEX "Payment_providerPreferenceId_key" ON "Payment"("providerPreferenceId");
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");
CREATE INDEX "Payment_externalReference_idx" ON "Payment"("externalReference");
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

ALTER TABLE "Payment"
ADD CONSTRAINT "Payment_orderId_fkey"
FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
