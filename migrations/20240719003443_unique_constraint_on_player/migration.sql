/*
  Warnings:

  - A unique constraint covering the columns `[name,teamId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Player_name_teamId_key" ON "Player"("name", "teamId");
