/*
  Warnings:

  - Changed the type of `role` on the `user_building_roles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BuildingUserRole" AS ENUM ('BUILDING_ADMIN', 'MANAGER', 'LAUNDRY_MANAGER', 'MAINTENANCE_STAFF', 'TENANT');

-- AlterTable
ALTER TABLE "user_building_roles" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "BuildingUserRole" NOT NULL;
