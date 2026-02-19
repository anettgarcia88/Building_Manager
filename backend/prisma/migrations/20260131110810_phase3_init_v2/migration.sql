/*
  Warnings:

  - Added the required column `buildingId` to the `charges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buildingId` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buildingId` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buildingId` to the `laundry_reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buildingId` to the `meters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buildingId` to the `monthly_closings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buildingId` to the `tenants` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BuildingStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "buildings" ADD COLUMN     "settings" JSONB,
ADD COLUMN     "status" "BuildingStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "charges" ADD COLUMN     "buildingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "contracts" ADD COLUMN     "buildingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "buildingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "laundry_reservations" ADD COLUMN     "buildingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "maintenance_tickets" ADD COLUMN     "buildingId" TEXT;

-- AlterTable
ALTER TABLE "meters" ADD COLUMN     "buildingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "monthly_closings" ADD COLUMN     "buildingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "buildingId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "user_building_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_building_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "details" JSONB,
    "ip" TEXT,
    "userId" TEXT,
    "buildingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_building_roles_userId_buildingId_key" ON "user_building_roles"("userId", "buildingId");

-- AddForeignKey
ALTER TABLE "user_building_roles" ADD CONSTRAINT "user_building_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_building_roles" ADD CONSTRAINT "user_building_roles_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charges" ADD CONSTRAINT "charges_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laundry_reservations" ADD CONSTRAINT "laundry_reservations_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_tickets" ADD CONSTRAINT "maintenance_tickets_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meters" ADD CONSTRAINT "meters_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_closings" ADD CONSTRAINT "monthly_closings_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
