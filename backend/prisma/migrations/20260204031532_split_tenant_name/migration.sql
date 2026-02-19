/*
  Warnings:

  - You are about to drop the column `name` on the `tenants` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName1` to the `tenants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName1" TEXT NOT NULL,
ADD COLUMN     "lastName2" TEXT;
