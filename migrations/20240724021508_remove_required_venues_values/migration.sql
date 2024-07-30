/*
  Warnings:

  - You are about to drop the column `market` on the `MLBVenue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MLBVenue" DROP COLUMN "market",
ALTER COLUMN "surface" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "zip" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL;
