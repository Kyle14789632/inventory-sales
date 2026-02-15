/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `Supplier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Supplier` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "contactPerson" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");
