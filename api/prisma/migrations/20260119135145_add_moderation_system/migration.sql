-- CreateEnum
CREATE TYPE "ReportTargetType" AS ENUM ('CHALLENGE', 'PARTICIPATION');

-- DropForeignKey
ALTER TABLE "challenge_votes" DROP CONSTRAINT "challenge_votes_challenge_id_fkey";

-- DropForeignKey
ALTER TABLE "challenge_votes" DROP CONSTRAINT "challenge_votes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "challenges" DROP CONSTRAINT "challenges_created_by_fkey";

-- DropForeignKey
ALTER TABLE "challenges" DROP CONSTRAINT "challenges_game_id_fkey";

-- DropForeignKey
ALTER TABLE "participation_votes" DROP CONSTRAINT "participation_votes_participation_id_fkey";

-- DropForeignKey
ALTER TABLE "participation_votes" DROP CONSTRAINT "participation_votes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "participations" DROP CONSTRAINT "participations_challenge_id_fkey";

-- DropForeignKey
ALTER TABLE "participations" DROP CONSTRAINT "participations_user_id_fkey";

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "target_type" "ReportTargetType" NOT NULL,
    "target_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reports_user_id_target_type_target_id_key" ON "reports"("user_id", "target_type", "target_id");

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_votes" ADD CONSTRAINT "challenge_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_votes" ADD CONSTRAINT "challenge_votes_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participation_votes" ADD CONSTRAINT "participation_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participation_votes" ADD CONSTRAINT "participation_votes_participation_id_fkey" FOREIGN KEY ("participation_id") REFERENCES "participations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
