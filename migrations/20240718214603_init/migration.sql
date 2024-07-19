/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sport,abbreviation]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sport` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalId` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sport` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "sport" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "externalId" TEXT NOT NULL,
ADD COLUMN     "sport" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Team_externalId_key" ON "Team"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_sport_abbreviation_key" ON "Team"("sport", "abbreviation");
