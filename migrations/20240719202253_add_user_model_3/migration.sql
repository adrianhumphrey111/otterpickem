/*
  Warnings:

  - You are about to drop the column `isGameOfTheDay` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the `Pitcher` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[homeTeamId,awayTeamId,date]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[playerId]` on the table `PlayerStats` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sport,abbreviation]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `date` on the `Game` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_awayStartingPitcherId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_homeStartingPitcherId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerStats" DROP CONSTRAINT "PlayerStats_playerId_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "isGameOfTheDay",
ADD COLUMN     "espnBetAwayOdds" DOUBLE PRECISION,
ADD COLUMN     "espnBetHomeOdds" DOUBLE PRECISION,
ADD COLUMN     "gameOfTheDay" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" TEXT NOT NULL,
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "awayStartingPitcherId" DROP NOT NULL,
ALTER COLUMN "homeStartingPitcherId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PlayerStats" ALTER COLUMN "statType" DROP NOT NULL;

-- DropTable
DROP TABLE "Pitcher";

-- CreateTable
CREATE TABLE "Prediction" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "predictedHomeScore" DOUBLE PRECISION NOT NULL,
    "predictedAwayScore" DOUBLE PRECISION NOT NULL,
    "predictionDetails" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamStats" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "statType" TEXT NOT NULL,
    "statValue" JSONB NOT NULL,

    CONSTRAINT "TeamStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "fanGraphsPlayerUrl" TEXT,
    "position" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_teamId_key" ON "Player"("name", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Game_homeTeamId_awayTeamId_date_key" ON "Game"("homeTeamId", "awayTeamId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStats_playerId_key" ON "PlayerStats"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_externalId_key" ON "Team"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_sport_abbreviation_key" ON "Team"("sport", "abbreviation");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_homeStartingPitcherId_fkey" FOREIGN KEY ("homeStartingPitcherId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_awayStartingPitcherId_fkey" FOREIGN KEY ("awayStartingPitcherId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerStats" ADD CONSTRAINT "PlayerStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamStats" ADD CONSTRAINT "TeamStats_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
