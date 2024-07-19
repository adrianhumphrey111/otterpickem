/*
  Warnings:

  - You are about to drop the column `espnBetAwayOdds` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `espnBetHomeOdds` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `gameOfTheDay` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prediction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamStats` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `awayStartingPitcherId` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `homeStartingPitcherId` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `statType` on table `PlayerStats` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_awayStartingPitcherId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_homeStartingPitcherId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_teamId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerStats" DROP CONSTRAINT "PlayerStats_playerId_fkey";

-- DropForeignKey
ALTER TABLE "Prediction" DROP CONSTRAINT "Prediction_gameId_fkey";

-- DropForeignKey
ALTER TABLE "TeamStats" DROP CONSTRAINT "TeamStats_teamId_fkey";

-- DropIndex
DROP INDEX "Game_homeTeamId_awayTeamId_date_key";

-- DropIndex
DROP INDEX "PlayerStats_playerId_key";

-- DropIndex
DROP INDEX "Team_externalId_key";

-- DropIndex
DROP INDEX "Team_sport_abbreviation_key";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "espnBetAwayOdds",
DROP COLUMN "espnBetHomeOdds",
DROP COLUMN "gameOfTheDay",
DROP COLUMN "status",
ADD COLUMN     "isGameOfTheDay" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "date" SET DATA TYPE TEXT,
ALTER COLUMN "awayStartingPitcherId" SET NOT NULL,
ALTER COLUMN "homeStartingPitcherId" SET NOT NULL;

-- AlterTable
ALTER TABLE "PlayerStats" ALTER COLUMN "statType" SET NOT NULL;

-- DropTable
DROP TABLE "Player";

-- DropTable
DROP TABLE "Prediction";

-- DropTable
DROP TABLE "TeamStats";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Pitcher" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "fanGraphsPlayerId" TEXT,
    "externalId" TEXT NOT NULL,

    CONSTRAINT "Pitcher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_homeStartingPitcherId_fkey" FOREIGN KEY ("homeStartingPitcherId") REFERENCES "Pitcher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_awayStartingPitcherId_fkey" FOREIGN KEY ("awayStartingPitcherId") REFERENCES "Pitcher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerStats" ADD CONSTRAINT "PlayerStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Pitcher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
