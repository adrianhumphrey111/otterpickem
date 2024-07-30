/*
  Warnings:

  - You are about to drop the column `externalId` on the `MLBStatistics` table. All the data in the column will be lost.
  - You are about to drop the column `seasonId` on the `MLBStatistics` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MLBStatistics" DROP CONSTRAINT "MLBStatistics_seasonId_fkey";

-- DropIndex
DROP INDEX "MLBStatistics_externalId_key";

-- DropIndex
DROP INDEX "MLBStatistics_seasonId_key";

-- AlterTable
ALTER TABLE "MLBSeason" ADD COLUMN     "mLBStatisticsId" TEXT;

-- AlterTable
ALTER TABLE "MLBStatistics" DROP COLUMN "externalId",
DROP COLUMN "seasonId",
ADD COLUMN     "season" TEXT;
