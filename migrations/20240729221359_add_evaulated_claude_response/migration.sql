/*
  Warnings:

  - Added the required column `claudeResponse` to the `EvaluatedGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EvaluatedGame" ADD COLUMN     "claudeResponse" TEXT NOT NULL;
