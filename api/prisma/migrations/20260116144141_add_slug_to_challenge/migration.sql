/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `challenges` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `challenges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "challenges_slug_key" ON "challenges"("slug");
