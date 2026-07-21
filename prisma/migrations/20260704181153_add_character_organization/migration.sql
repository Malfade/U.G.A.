-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "organizationId" TEXT;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
