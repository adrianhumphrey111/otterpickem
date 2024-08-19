import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 86400 }); // 24 hours in seconds

export async function getCurrentRunDifferentials() {
  const t = {
    "NY Yankees": {
        "home": 20,
        "away": 93
    },
    "Philadelphia": {
        "home": 78,
        "away": 30
    },
    "Milwaukee": {
        "home": 36,
        "away": 65
    },
    "Kansas City": {
        "home": 62,
        "away": 32
    },
    "Baltimore": {
        "home": 35,
        "away": 54
    },
    "LA Dodgers": {
        "home": 42,
        "away": 47
    },
    "Cleveland": {
        "home": 39,
        "away": 39
    },
    "San Diego": {
        "home": -11,
        "away": 67
    },
    "Minnesota": {
        "home": 42,
        "away": 10
    },
    "Arizona": {
        "home": 15,
        "away": 35
    },
    "Cincinnati": {
        "home": -4,
        "away": 49
    },
    "Houston": {
        "home": 52,
        "away": -8
    },
    "NY Mets": {
        "home": 11,
        "away": 30
    },
    "Boston": {
        "home": -19,
        "away": 53
    },
    "Atlanta": {
        "home": -7,
        "away": 40
    },
    "Seattle": {
        "home": 17,
        "away": 2
    },
    "Chi Cubs": {
        "home": 28,
        "away": -21
    },
    "SF Giants": {
        "home": 18,
        "away": -25
    },
    "Pittsburgh": {
        "home": -23,
        "away": 10
    },
    "Detroit": {
        "home": -34,
        "away": 15
    },
    "Texas": {
        "home": 31,
        "away": -54
    },
    "Tampa Bay": {
        "home": -28,
        "away": -17
    },
    "St. Louis": {
        "home": -18,
        "away": -28
    },
    "Washington": {
        "home": -33,
        "away": -27
    },
    "Oakland": {
        "home": -7,
        "away": -65
    },
    "LA Angels": {
        "home": -50,
        "away": -38
    },
    "Toronto": {
        "home": -54,
        "away": -34
    },
    "Miami": {
        "home": -96,
        "away": -61
    },
    "Colorado": {
        "home": -37,
        "away": -150
    },
    "Chi Sox": {
        "home": -98,
        "away": -150
    }
}

return t
  const cachedData = cache.get('runDifferentials');
  if (cachedData) {
    console.log("we have cached data")
    return cachedData;
  }
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.teamrankings.com/mlb/stat/run-differential');

    const tableHTML = await page.evaluate(() => {
      const table = document.querySelector('.datatable');
      return table.outerHTML;
    });

    await browser.close();

    const prompt = `
    Extract the MLB team run differentials from this HTML table and return it as a JSON object.
    The JSON object should have team names as keys and their run differentials as values.
    
    I would like the the run differential for each team both home and away
    
    Only include the JSON object in your response, without any additional text.
    
    ${tableHTML}
    `;

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model:"claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      temperature: 0,
      system: "You are an expert data analyzer and good at pulling data out of html code and returning structured JSON objects with the information you are given. You only return structured json in your response and not text about the json",
      messages: [
        { role: "user", content: prompt }
      ]
    }, {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    });

    const runDifferentials = JSON.parse(response.data.content[0].text);
    cache.set('runDifferentials', runDifferentials);
    return runDifferentials;
  } catch (error) {
    console.error('Error getting run differentials:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const runDifferentials = await getCurrentRunDifferentials();
      res.status(200).json(runDifferentials);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
