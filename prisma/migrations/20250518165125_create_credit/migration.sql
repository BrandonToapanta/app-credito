/*
  Warnings:

  - You are about to drop the column `amount` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_creditId_fkey";

-- AlterTable
ALTER TABLE "Credit" DROP COLUMN "amount";

-- DropTable
DROP TABLE "Payment";
