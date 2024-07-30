/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `MLBStatistics` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `MLBStatistics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MLBStatistics" ADD COLUMN     "externalId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MLBStatistics_externalId_key" ON "MLBStatistics"("externalId");
