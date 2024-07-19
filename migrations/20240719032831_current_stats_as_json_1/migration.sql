/*
  Warnings:

  - A unique constraint covering the columns `[playerId]` on the table `PlayerStats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PlayerStats_playerId_key" ON "PlayerStats"("playerId");
