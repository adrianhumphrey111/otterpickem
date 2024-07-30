-- CreateTable
CREATE TABLE "MLBGame" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "coverage" TEXT NOT NULL,
    "gameNumber" INTEGER NOT NULL,
    "dayNight" TEXT NOT NULL,
    "scheduled" TIMESTAMP(3) NOT NULL,
    "homeTeamId" TEXT NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    "attendance" INTEGER,
    "duration" TEXT,
    "doubleHeader" BOOLEAN NOT NULL,
    "entryMode" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "broadcastNetwork" TEXT,

    CONSTRAINT "MLBGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MLBTeam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "abbr" TEXT NOT NULL,

    CONSTRAINT "MLBTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MLBVenue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "capacity" INTEGER,
    "surface" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "fieldOrientation" TEXT,
    "stadiumType" TEXT,
    "timeZone" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "MLBVenue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MLBGame" ADD CONSTRAINT "MLBGame_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "MLBTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLBGame" ADD CONSTRAINT "MLBGame_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "MLBTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLBGame" ADD CONSTRAINT "MLBGame_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "MLBVenue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
