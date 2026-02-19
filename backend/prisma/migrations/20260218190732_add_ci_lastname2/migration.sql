/*
  Warnings:

  - You are about to drop the column `lastName` on the `user_building_roles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_building_roles" DROP COLUMN "lastName",
ADD COLUMN     "ci" TEXT,
ADD COLUMN     "lastName1" TEXT,
ADD COLUMN     "lastName2" TEXT;
