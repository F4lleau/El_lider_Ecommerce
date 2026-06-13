-- CreateEnum
CREATE TYPE "StockRequestStatus" AS ENUM ('PENDING', 'CONTACTED', 'NOTIFIED', 'CANCELLED');

-- CreateTable
CREATE TABLE "StockRequest" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "userId" INTEGER,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "status" "StockRequestStatus" NOT NULL DEFAULT 'PENDING',
    "notifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "StockRequest_productId_idx" ON "StockRequest"("productId");
CREATE INDEX "StockRequest_userId_idx" ON "StockRequest"("userId");
CREATE INDEX "StockRequest_email_idx" ON "StockRequest"("email");
CREATE INDEX "StockRequest_status_idx" ON "StockRequest"("status");

ALTER TABLE "StockRequest" ADD CONSTRAINT "StockRequest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StockRequest" ADD CONSTRAINT "StockRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
