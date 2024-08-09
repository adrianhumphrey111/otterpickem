import axios from 'axios';
import NodeCache from 'node-cache';
import puppeteer from 'puppeteer';

const cache = new NodeCache({ stdTTL: 43200 }); // 12 hours in seconds

export async function getCurrentOPS() {
  const cachedData = cache.get('teamOPS');
  if (cachedData) {
    console.log("Using cached OPS data");
    return cachedData;
  }
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.espn.com/mlb/stats/team', { waitUntil: 'networkidle2', timeout: 60000 });

    const tableHTML = await page.evaluate(() => {
      const table = document.querySelector('.Table2__title--remove-capitalization');
      console.log()
      return table.outerHTML;
    });

    await browser.close();

    const prompt = `
    Extract the MLB team batting stats and group the object keys by batting stat, with the value being an 
    array of the teams values ranked from highest to least with the corresponding stat the team has
    Only include the JSON object in your response, without any additional text.
    
    ${tableHTML}
    `;

    const response = await getOpenAIResponse(prompt);
    const teamOPS = JSON.parse(response);
    cache.set('teamOPS', teamOPS);
    return teamOPS;
  } catch (error) {
    console.error('Error getting team OPS:', error);
    throw error; 
  
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const teamOPS = await getCurrentOPS();
      res.status(200).json(teamOPS);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
