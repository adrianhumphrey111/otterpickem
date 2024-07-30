-- AlterTable
ALTER TABLE "MLBTeam" ADD COLUMN     "seasonId" TEXT;

-- CreateTable
CREATE TABLE "MLBPlayer" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "primaryPosition" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "preferredName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "throwHand" TEXT NOT NULL,
    "batHand" TEXT NOT NULL,
    "college" TEXT,
    "highSchool" TEXT,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "birthstate" TEXT,
    "birthcountry" TEXT,
    "birthcity" TEXT,
    "proDebut" TIMESTAMP(3),
    "updated" TIMESTAMP(3),
    "reference" TEXT,

    CONSTRAINT "MLBPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Draft" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "pick" INTEGER NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "Draft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statistics" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HittingStats" (
    "id" TEXT NOT NULL,
    "statisticsId" TEXT NOT NULL,
    "ab" INTEGER NOT NULL,
    "runs" INTEGER NOT NULL,
    "hits" INTEGER NOT NULL,
    "doubles" INTEGER NOT NULL,
    "triples" INTEGER NOT NULL,
    "homeRuns" INTEGER NOT NULL,
    "rbi" INTEGER NOT NULL,
    "walks" INTEGER NOT NULL,
    "strikeouts" INTEGER NOT NULL,
    "avg" DOUBLE PRECISION NOT NULL,
    "obp" DOUBLE PRECISION NOT NULL,
    "slg" DOUBLE PRECISION NOT NULL,
    "ops" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "HittingStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldingStats" (
    "id" TEXT NOT NULL,
    "statisticsId" TEXT NOT NULL,
    "putouts" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "errors" INTEGER NOT NULL,
    "doublePlays" INTEGER NOT NULL,
    "fieldingPercentage" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FieldingStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Draft_playerId_key" ON "Draft"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "Statistics_teamId_key" ON "Statistics"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "HittingStats_statisticsId_key" ON "HittingStats"("statisticsId");

-- CreateIndex
CREATE UNIQUE INDEX "FieldingStats_statisticsId_key" ON "FieldingStats"("statisticsId");

-- AddForeignKey
ALTER TABLE "Draft" ADD CONSTRAINT "Draft_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "MLBPlayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "MLBPlayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statistics" ADD CONSTRAINT "Statistics_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "MLBTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HittingStats" ADD CONSTRAINT "HittingStats_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "Statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldingStats" ADD CONSTRAINT "FieldingStats_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "Statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLBTeam" ADD CONSTRAINT "MLBTeam_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;
