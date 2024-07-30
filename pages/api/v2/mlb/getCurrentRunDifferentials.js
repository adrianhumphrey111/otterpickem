import { chromium } from 'playwright';
import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 86400 }); // 24 hours in seconds

export async function getCurrentRunDifferentials() {
  const cachedData = cache.get('runDifferentials');
  if (cachedData) {
    console.log("we have cached data")
    return cachedData;
  }
  try {
    const browser = await chromium.launch();
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
