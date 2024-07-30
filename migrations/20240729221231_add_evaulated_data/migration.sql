-- CreateTable
CREATE TABLE "EvaluatedGame" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluatedGame_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EvaluatedGame_gameId_key" ON "EvaluatedGame"("gameId");
