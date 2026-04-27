/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `games` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "games" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "games_slug_key" ON "games"("slug");
