-- DropForeignKey
ALTER TABLE "packages" DROP CONSTRAINT "packages_courierId_fkey";

-- AlterTable
ALTER TABLE "packages" ALTER COLUMN "courierId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
