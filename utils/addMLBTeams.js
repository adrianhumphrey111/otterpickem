import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mlbTeams = [
  {
    "id": "93941372-eb4c-4c40-aced-fe3267174393",
    "name": "Angels",
    "market": "Los Angeles",
    "abbr": "LAA"
  },
  {
    "id": "a7723160-10b7-4277-a309-d8dd95a8ae65",
    "name": "51s",
    "market": "Las Vegas",
    "abbr": "LV"
  },
  {
    "id": "7bde9f5e-f2f1-4c4e-84a1-c1a36d4d5776",
    "name": "Astros",
    "market": "Houston",
    "abbr": "HOU"
  },
  {
    "id": "481dfe7e-5dab-46ab-a49f-9dcc2b6e2cfd",
    "name": "Athletics",
    "market": "Oakland",
    "abbr": "OAK"
  },
  {
    "id": "1d678440-b4b1-4954-9b39-70afb3ebbcfa",
    "name": "Blue Jays",
    "market": "Toronto",
    "abbr": "TOR"
  },
  {
    "id": "a7723160-10b7-4277-a309-d8dd95a8ae65",
    "name": "Braves",
    "market": "Atlanta",
    "abbr": "ATL"
  },
  {
    "id": "12079497-e414-450a-8bf2-29f91de646bf",
    "name": "Brewers",
    "market": "Milwaukee",
    "abbr": "MIL"
  },
  {
    "id": "ef64da7f-cfaf-4300-87b0-9313386b977c",
    "name": "Cardinals",
    "market": "St. Louis",
    "abbr": "STL"
  },
  {
    "id": "55714da8-fcaf-4574-8443-59bfb511a524",
    "name": "Cubs",
    "market": "Chicago",
    "abbr": "CHC"
  },
  {
    "id": "d52d5339-cbdd-43f3-9dfa-a42fd588b9a3",
    "name": "Diamondbacks",
    "market": "Arizona",
    "abbr": "ARI"
  },
  {
    "id": "ef64da7f-cfaf-4300-87b0-9313386b977c",
    "name": "Dodgers",
    "market": "Los Angeles",
    "abbr": "LAD"
  },
  {
    "id": "a7723160-10b7-4277-a309-d8dd95a8ae65",
    "name": "Giants",
    "market": "San Francisco",
    "abbr": "SF"
  },
  {
    "id": "80715d0d-0d2a-450f-a970-1b9a3b18c7e7",
    "name": "Guardians",
    "market": "Cleveland",
    "abbr": "CLE"
  },
  {
    "id": "833a51a9-0d84-410f-bd77-da08c3e5e26e",
    "name": "Mariners",
    "market": "Seattle",
    "abbr": "SEA"
  },
  {
    "id": "03556285-bdbb-4576-a06d-42f71f46ddc5",
    "name": "Marlins",
    "market": "Miami",
    "abbr": "MIA"
  },
  {
    "id": "dcfd5266-00ce-442c-bc09-264cd20cf455",
    "name": "Mets",
    "market": "New York",
    "abbr": "NYM"
  },
  {
    "id": "d89bed32-3aee-4407-99e3-4103641b999a",
    "name": "Nationals",
    "market": "Washington",
    "abbr": "WSH"
  },
  {
    "id": "27a59d3b-ff7c-48ea-b016-4798f560f5e1",
    "name": "Orioles",
    "market": "Baltimore",
    "abbr": "BAL"
  },
  {
    "id": "75729d34-bca7-4a0f-b3df-6f26c6ad3719",
    "name": "Padres",
    "market": "San Diego",
    "abbr": "SD"
  },
  {
    "id": "2142e1ba-3b40-445c-b8bb-f1f8b1054220",
    "name": "Phillies",
    "market": "Philadelphia",
    "abbr": "PHI"
  },
  {
    "id": "481dfe7e-5dab-46ab-a49f-9dcc2b6e2cfd",
    "name": "Pirates",
    "market": "Pittsburgh",
    "abbr": "PIT"
  },
  {
    "id": "47f490cd-2f58-4ef7-9dfd-2ad6ba6c1ae8",
    "name": "Rangers",
    "market": "Texas",
    "abbr": "TEX"
  },
  {
    "id": "bdc11650-6f74-49c4-875e-778aeb7632d9",
    "name": "Rays",
    "market": "Tampa Bay",
    "abbr": "TB"
  },
  {
    "id": "a7723160-10b7-4277-a309-d8dd95a8ae65",
    "name": "Red Sox",
    "market": "Boston",
    "abbr": "BOS"
  },
  {
    "id": "c874a065-c115-4e7d-b0f0-235584fb0e6f",
    "name": "Reds",
    "market": "Cincinnati",
    "abbr": "CIN"
  },
  {
    "id": "29dd9a87-5971-4278-a242-66e248b63e8c",
    "name": "Rockies",
    "market": "Colorado",
    "abbr": "COL"
  },
  {
    "id": "575c19b7-4052-41c2-9f0a-1c5813d02f99",
    "name": "Royals",
    "market": "Kansas City",
    "abbr": "KC"
  },
  {
    "id": "575c19b7-4052-41c2-9f0a-1c5813d02f99",
    "name": "Tigers",
    "market": "Detroit",
    "abbr": "DET"
  },
  {
    "id": "aa34e0ed-f342-4ec6-b774-c79b47b60e2d",
    "name": "Twins",
    "market": "Minnesota",
    "abbr": "MIN"
  },
  {
    "id": "47f490cd-2f58-4ef7-9dfd-2ad6ba6c1ae8",
    "name": "White Sox",
    "market": "Chicago",
    "abbr": "CWS"
  },
  {
    "id": "a7723160-10b7-4277-a309-d8dd95a8ae65",
    "name": "Yankees",
    "market": "New York",
    "abbr": "NYY"
  }
];

async function addMLBTeams() {
  try {
    for (const team of mlbTeams) {
      await prisma.mLBTeam.upsert({
        where: { id: team.id },
        update: {
          name: team.name,
          market: team.market,
          abbr: team.abbr,
        },
        create: {
          id: team.id,
          name: team.name,
          market: team.market,
          abbr: team.abbr,
        },
      });
    }
    console.log('MLB teams have been added or updated successfully.');
  } catch (error) {
    console.error('Error adding MLB teams:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMLBTeams();
