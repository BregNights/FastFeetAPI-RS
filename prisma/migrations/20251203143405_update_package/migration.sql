/*
  Warnings:

  - Made the column `courierId` on table `packages` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "packages" DROP CONSTRAINT "packages_courierId_fkey";

-- AlterTable
ALTER TABLE "packages" ALTER COLUMN "courierId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
