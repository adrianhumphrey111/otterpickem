/*
  Warnings:

  - Added the required column `statType` to the `PlayerStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlayerStats" ADD COLUMN     "statType" TEXT NOT NULL;
