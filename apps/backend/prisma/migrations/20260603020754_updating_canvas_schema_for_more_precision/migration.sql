/*
  Warnings:

  - You are about to drop the column `content` on the `Canvas` table. All the data in the column will be lost.
  - You are about to drop the `item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_batch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vendor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `waste` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_vendor_id_fkey";

-- DropForeignKey
ALTER TABLE "stock_batch" DROP CONSTRAINT "stock_batch_item_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_batch_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_item_id_fkey";

-- DropForeignKey
ALTER TABLE "waste" DROP CONSTRAINT "waste_batch_id_fkey";

-- DropForeignKey
ALTER TABLE "waste" DROP CONSTRAINT "waste_item_id_fkey";

-- AlterTable
ALTER TABLE "Canvas" DROP COLUMN "content";

-- DropTable
DROP TABLE "item";

-- DropTable
DROP TABLE "stock_batch";

-- DropTable
DROP TABLE "transaction";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "vendor";

-- DropTable
DROP TABLE "waste";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "sku" VARCHAR(100),
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "ingredients" VARCHAR(255),
    "uom" "UnitOfMeasure",
    "price" MONEY,
    "vendorId" INTEGER,
    "lowStockThreshold" INTEGER DEFAULT 10,
    "imageUrl" VARCHAR(255),
    "meatChoices" "MeatChoice"[],
    "category" "Category" NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockBatch" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER,
    "quantityReceived" DECIMAL(12,3) NOT NULL,
    "quantityRemaining" DECIMAL(12,3) NOT NULL,
    "expirationDate" DATE,
    "receivedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "costAtPurchase" DECIMAL(12,2),

    CONSTRAINT "StockBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER,
    "batchId" INTEGER,
    "type" "TransactionType" NOT NULL,
    "quantity" DECIMAL(12,3),
    "transactionDate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Waste" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER,
    "batchId" INTEGER,
    "quantity" DECIMAL(12,3) NOT NULL,
    "reason" "WasteReason" NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Waste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Line" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "canvasId" INTEGER NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "scaleX" DOUBLE PRECISION NOT NULL,
    "scaleY" DOUBLE PRECISION NOT NULL,
    "points" DOUBLE PRECISION[],
    "stroke" TEXT NOT NULL,
    "strokeWidth" DOUBLE PRECISION NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rectangle" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "canvasId" INTEGER NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "scaleX" DOUBLE PRECISION NOT NULL,
    "scaleY" DOUBLE PRECISION NOT NULL,
    "width" DECIMAL(65,30) NOT NULL,
    "height" DECIMAL(65,30) NOT NULL,
    "fill" TEXT NOT NULL,
    "stroke" TEXT NOT NULL,
    "strokeWidth" DECIMAL(65,30) NOT NULL,
    "cornerRadius" DECIMAL(65,30) NOT NULL,
    "dash" DECIMAL(65,30)[],
    "dashEnabled" BOOLEAN NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Rectangle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Text" (
    "id" SERIAL NOT NULL,
    "canvasId" INTEGER NOT NULL,
    "fontSize" DECIMAL(65,30) NOT NULL,
    "fill" TEXT NOT NULL,
    "fontFamily" TEXT NOT NULL,
    "fontStyle" TEXT NOT NULL,

    CONSTRAINT "Text_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Circle" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "canvasId" INTEGER NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "scaleX" DOUBLE PRECISION NOT NULL,
    "scaleY" DOUBLE PRECISION NOT NULL,
    "radius" DECIMAL(65,30) NOT NULL,
    "fill" TEXT NOT NULL,
    "stroke" TEXT NOT NULL,
    "strokeWidth" DECIMAL(65,30) NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Circle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "canvasId" INTEGER NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "scaleX" DOUBLE PRECISION NOT NULL,
    "scaleY" DOUBLE PRECISION NOT NULL,
    "showTitle" BOOLEAN NOT NULL,
    "showImage" BOOLEAN NOT NULL,
    "showDescription" BOOLEAN NOT NULL,
    "showPrice" BOOLEAN NOT NULL,
    "titleStyle" TEXT NOT NULL,
    "descriptionStyle" TEXT NOT NULL,
    "priceStyle" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");

-- CreateIndex
CREATE UNIQUE INDEX "Item_sku_key" ON "Item"("sku");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StockBatch" ADD CONSTRAINT "StockBatch_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "StockBatch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Waste" ADD CONSTRAINT "Waste_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "StockBatch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Waste" ADD CONSTRAINT "Waste_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Line" ADD CONSTRAINT "Line_canvasId_fkey" FOREIGN KEY ("canvasId") REFERENCES "Canvas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rectangle" ADD CONSTRAINT "Rectangle_canvasId_fkey" FOREIGN KEY ("canvasId") REFERENCES "Canvas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Text" ADD CONSTRAINT "Text_canvasId_fkey" FOREIGN KEY ("canvasId") REFERENCES "Canvas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Circle" ADD CONSTRAINT "Circle_canvasId_fkey" FOREIGN KEY ("canvasId") REFERENCES "Canvas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_canvasId_fkey" FOREIGN KEY ("canvasId") REFERENCES "Canvas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
