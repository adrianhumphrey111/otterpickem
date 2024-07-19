/*
  Warnings:

  - You are about to drop the column `currentStatsValeu` on the `PlayerStats` table. All the data in the column will be lost.
  - Added the required column `currentStatsValue` to the `PlayerStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlayerStats" DROP COLUMN "currentStatsValeu",
ADD COLUMN     "currentStatsValue" JSONB NOT NULL;
