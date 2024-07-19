/*
  Warnings:

  - A unique constraint covering the columns `[homeTeamId,awayTeamId,date]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Game_homeTeamId_awayTeamId_date_key" ON "Game"("homeTeamId", "awayTeamId", "date");
