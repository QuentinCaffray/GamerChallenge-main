/*
  Warnings:

  - Added the required column `created_by` to the `challenges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "created_by" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
