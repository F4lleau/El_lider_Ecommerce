-- CreateEnum
CREATE TYPE "PromoLinkType" AS ENUM ('CATEGORY', 'PRODUCT', 'SEARCH', 'OFFERS', 'BEST_SELLERS', 'INTERNAL_URL');

-- CreateEnum
CREATE TYPE "PopupFrequency" AS ENUM ('ONCE', 'ONCE_PER_SESSION', 'ONCE_PER_DAY', 'ALWAYS');

-- CreateTable
CREATE TABLE "PromotionalSlide" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "imageUrl" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL,
    "ctaLabel" TEXT NOT NULL,
    "linkType" "PromoLinkType" NOT NULL,
    "linkValue" TEXT,
    "badge" TEXT,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromotionalSlide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionalPopup" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "ctaLabel" TEXT,
    "linkType" "PromoLinkType",
    "linkValue" TEXT,
    "frequency" "PopupFrequency" NOT NULL DEFAULT 'ONCE_PER_DAY',
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "productIds" JSONB,
    "categoryIds" JSONB,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromotionalPopup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PromotionalSlide_isActive_startsAt_endsAt_idx" ON "PromotionalSlide"("isActive", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "PromotionalSlide_isFeatured_priority_idx" ON "PromotionalSlide"("isFeatured", "priority");

-- CreateIndex
CREATE INDEX "PromotionalPopup_isActive_startsAt_endsAt_idx" ON "PromotionalPopup"("isActive", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "PromotionalPopup_priority_idx" ON "PromotionalPopup"("priority");
