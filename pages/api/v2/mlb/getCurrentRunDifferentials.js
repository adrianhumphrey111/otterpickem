import { chromium } from 'playwright';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
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
      Only include the JSON object in your response, without any additional text.
      
      ${tableHTML}
      `;

      const claudeResponse = await axios.post('https://api.anthropic.com/v1/messages', {
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLAUDE_API_KEY
        }
      });

      const runDifferentials = JSON.parse(claudeResponse.data.content[0].text);

      res.status(200).json(runDifferentials);
    } catch (error) {
      console.error('Error fetching run differentials:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
