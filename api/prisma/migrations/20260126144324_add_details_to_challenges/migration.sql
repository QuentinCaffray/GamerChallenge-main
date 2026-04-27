-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "details" TEXT;

-- AlterTable
ALTER TABLE "participations" ALTER COLUMN "submission_url" DROP NOT NULL;
