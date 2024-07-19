/*
  Warnings:

  - You are about to drop the column `gameId` on the `PlayerStats` table. All the data in the column will be lost.
  - You are about to drop the column `statType` on the `PlayerStats` table. All the data in the column will be lost.
  - You are about to drop the column `statValue` on the `PlayerStats` table. All the data in the column will be lost.
  - Added the required column `currentStatsValeu` to the `PlayerStats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PlayerStats" DROP CONSTRAINT "PlayerStats_gameId_fkey";

-- AlterTable
ALTER TABLE "PlayerStats" DROP COLUMN "gameId",
DROP COLUMN "statType",
DROP COLUMN "statValue",
ADD COLUMN     "currentStatsValeu" JSONB NOT NULL;
