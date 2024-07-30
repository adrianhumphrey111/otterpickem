/*
  Warnings:

  - You are about to drop the `HittingStats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Season` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Statistics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FieldingStats" DROP CONSTRAINT "FieldingStats_statisticsId_fkey";

-- DropForeignKey
ALTER TABLE "HittingStats" DROP CONSTRAINT "HittingStats_statisticsId_fkey";

-- DropForeignKey
ALTER TABLE "MLBTeam" DROP CONSTRAINT "MLBTeam_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "Season" DROP CONSTRAINT "Season_playerId_fkey";

-- DropForeignKey
ALTER TABLE "Statistics" DROP CONSTRAINT "Statistics_teamId_fkey";

-- AlterTable
ALTER TABLE "MLBPlayer" ALTER COLUMN "preferredName" DROP NOT NULL,
ALTER COLUMN "batHand" DROP NOT NULL,
ALTER COLUMN "birthdate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MLBTeam" ADD COLUMN     "mLBStatisticsId" TEXT;

-- DropTable
DROP TABLE "HittingStats";

-- DropTable
DROP TABLE "Season";

-- DropTable
DROP TABLE "Statistics";

-- CreateTable
CREATE TABLE "MLBSeason" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "MLBSeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MLBStatistics" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,

    CONSTRAINT "MLBStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MLBFieldingStats" (
    "id" TEXT NOT NULL,
    "statisticsId" TEXT NOT NULL,
    "po" INTEGER NOT NULL,
    "a" INTEGER NOT NULL,
    "dp" INTEGER NOT NULL,
    "tp" INTEGER NOT NULL,
    "error" INTEGER NOT NULL,
    "tc" INTEGER NOT NULL,
    "fpct" DOUBLE PRECISION NOT NULL,
    "rf" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MLBFieldingStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MLBInnings" (
    "id" TEXT NOT NULL,
    "fieldingStatsId" TEXT NOT NULL,
    "inn_1" INTEGER NOT NULL,
    "inn_2" INTEGER NOT NULL,

    CONSTRAINT "MLBInnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MLBPitchingStats" (
    "id" TEXT NOT NULL,
    "statisticsId" TEXT NOT NULL,
    "oba" DOUBLE PRECISION NOT NULL,
    "era" DOUBLE PRECISION NOT NULL,
    "k9" DOUBLE PRECISION NOT NULL,
    "whip" DOUBLE PRECISION NOT NULL,
    "kbb" DOUBLE PRECISION NOT NULL,
    "ip_1" INTEGER NOT NULL,
    "ip_2" INTEGER NOT NULL,
    "bf" INTEGER NOT NULL,
    "gofo" DOUBLE PRECISION NOT NULL,
    "babip" DOUBLE PRECISION NOT NULL,
    "war" DOUBLE PRECISION,
    "fip" DOUBLE PRECISION,
    "xfip" DOUBLE PRECISION,
    "eraMinus" DOUBLE PRECISION,
    "gbfb" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MLBPitchingStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MLBGames" (
    "id" TEXT NOT NULL,
    "pitchingStatsId" TEXT,
    "fieldingStatsId" TEXT,
    "start" INTEGER NOT NULL,
    "play" INTEGER NOT NULL,
    "finish" INTEGER NOT NULL,
    "complete" INTEGER NOT NULL,
    "qualityStarts" INTEGER,
    "shutouts" INTEGER,

    CONSTRAINT "MLBGames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MLBRuns" (
    "id" TEXT NOT NULL,
    "pitchingStatsId" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "unearned" INTEGER NOT NULL,
    "earned" INTEGER NOT NULL,

    CONSTRAINT "MLBRuns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MLBPitches" (
    "id" TEXT NOT NULL,
    "pitchingStatsId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "balls" INTEGER NOT NULL,
    "strikes" INTEGER NOT NULL,
    "perInningPitched" DOUBLE PRECISION NOT NULL,
    "perBatterFaced" DOUBLE PRECISION NOT NULL,
    "perStart" DOUBLE PRECISION,

    CONSTRAINT "MLBPitches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MLBWinLosses" (
    "id" TEXT NOT NULL,
    "pitchingStatsId" TEXT NOT NULL,
    "win" INTEGER NOT NULL,
    "loss" INTEGER NOT NULL,
    "save" INTEGER NOT NULL,
    "blownSave" INTEGER NOT NULL,
    "hold" INTEGER NOT NULL,
    "teamWin" INTEGER NOT NULL,
    "teamLoss" INTEGER NOT NULL,

    CONSTRAINT "MLBWinLosses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MLBOnbase" (
    "id" TEXT NOT NULL,
    "pitchingStatsId" TEXT NOT NULL,
    "singles" INTEGER NOT NULL,
    "doubles" INTEGER NOT NULL,
    "triples" INTEGER NOT NULL,
    "homeRuns" INTEGER NOT NULL,
    "totalBases" INTEGER NOT NULL,
    "walks" INTEGER NOT NULL,
    "intentionalWalks" INTEGER NOT NULL,
    "hitByPitch" INTEGER NOT NULL,
    "hits" INTEGER NOT NULL,

    CONSTRAINT "MLBOnbase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MLBHittingStats" (
    "id" TEXT NOT NULL,
    "statisticsId" TEXT NOT NULL,
    "ab" INTEGER NOT NULL,
    "runs" INTEGER NOT NULL,
    "hits" INTEGER NOT NULL,
    "doubles" INTEGER NOT NULL,
    "triples" INTEGER NOT NULL,
    "homeRuns" INTEGER NOT NULL,
    "rbi" INTEGER NOT NULL,
    "walks" INTEGER NOT NULL,
    "strikeouts" INTEGER NOT NULL,
    "avg" DOUBLE PRECISION NOT NULL,
    "obp" DOUBLE PRECISION NOT NULL,
    "slg" DOUBLE PRECISION NOT NULL,
    "ops" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MLBHittingStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MLBStatistics_seasonId_key" ON "MLBStatistics"("seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "MLBFieldingStats_statisticsId_key" ON "MLBFieldingStats"("statisticsId");

-- CreateIndex
CREATE UNIQUE INDEX "MLBInnings_fieldingStatsId_key" ON "MLBInnings"("fieldingStatsId");

-- CreateIndex
CREATE UNIQUE INDEX "MLBPitchingStats_statisticsId_key" ON "MLBPitchingStats"("statisticsId");

-- CreateIndex
CREATE UNIQUE INDEX "MLBGames_pitchingStatsId_key" ON "MLBGames"("pitchingStatsId");

-- CreateIndex
CREATE UNIQUE INDEX "MLBGames_fieldingStatsId_key" ON "MLBGames"("fieldingStatsId");

-- CreateIndex
CREATE UNIQUE INDEX "MLBRuns_pitchingStatsId_key" ON "MLBRuns"("pitchingStatsId");

-- CreateIndex
CREATE UNIQUE INDEX "MLBPitches_pitchingStatsId_key" ON "MLBPitches"("pitchingStatsId");

-- CreateIndex
CREATE UNIQUE INDEX "MLBWinLosses_pitchingStatsId_key" ON "MLBWinLosses"("pitchingStatsId");

-- CreateIndex
CREATE UNIQUE INDEX "MLBOnbase_pitchingStatsId_key" ON "MLBOnbase"("pitchingStatsId");

-- CreateIndex
CREATE UNIQUE INDEX "MLBHittingStats_statisticsId_key" ON "MLBHittingStats"("statisticsId");

-- AddForeignKey
ALTER TABLE "MLBSeason" ADD CONSTRAINT "MLBSeason_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "MLBPlayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLBStatistics" ADD CONSTRAINT "MLBStatistics_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "MLBSeason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLBFieldingStats" ADD CONSTRAINT "MLBFieldingStats_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "MLBStatistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLBInnings" ADD CONSTRAINT "MLBInnings_fieldingStatsId_fkey" FOREIGN KEY ("fieldingStatsId") REFERENCES "MLBFieldingStats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLBPitchingStats" ADD CONSTRAINT "MLBPitchingStats_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "MLBStatistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLBGames" ADD CONSTRAINT "MLBGames_pitchingStatsId_fkey" FOREIGN KEY ("pitchingStatsId") REFERENCES "MLBPitchingStats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLBGames" ADD CONSTRAINT "MLBGames_fieldingStatsId_fkey" FOREIGN KEY ("fieldingStatsId") REFERENCES "MLBFieldingStats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLBRuns" ADD CONSTRAINT "MLBRuns_pitchingStatsId_fkey" FOREIGN KEY ("pitchingStatsId") REFERENCES "MLBPitchingStats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLBPitches" ADD CONSTRAINT "MLBPitches_pitchingStatsId_fkey" FOREIGN KEY ("pitchingStatsId") REFERENCES "MLBPitchingStats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLBWinLosses" ADD CONSTRAINT "MLBWinLosses_pitchingStatsId_fkey" FOREIGN KEY ("pitchingStatsId") REFERENCES "MLBPitchingStats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLBOnbase" ADD CONSTRAINT "MLBOnbase_pitchingStatsId_fkey" FOREIGN KEY ("pitchingStatsId") REFERENCES "MLBPitchingStats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLBHittingStats" ADD CONSTRAINT "MLBHittingStats_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "MLBStatistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldingStats" ADD CONSTRAINT "FieldingStats_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "MLBStatistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLBTeam" ADD CONSTRAINT "MLBTeam_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "MLBSeason"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLBTeam" ADD CONSTRAINT "MLBTeam_mLBStatisticsId_fkey" FOREIGN KEY ("mLBStatisticsId") REFERENCES "MLBStatistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
