-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "awayStartingPitcherId" INTEGER,
ADD COLUMN     "homeStartingPitcherId" INTEGER;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_homeStartingPitcherId_fkey" FOREIGN KEY ("homeStartingPitcherId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_awayStartingPitcherId_fkey" FOREIGN KEY ("awayStartingPitcherId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
