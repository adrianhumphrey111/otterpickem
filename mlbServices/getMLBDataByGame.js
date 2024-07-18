import axios from 'axios';
import { chromium } from 'playwright';

async function getESPNMLBGameData(gameId) {
    let browser = null;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto(`https://www.espn.com/mlb/game/_/gameId/${gameId}`, { waitUntil: 'networkidle' });

        const gameData = await page.evaluate(() => {
            // Extract relevant game data from the page
            // This is a placeholder and should be adjusted based on the actual page structure
            return {
                score: document.querySelector('.score')?.textContent,
                inning: document.querySelector('.inning')?.textContent,
                // Add more selectors as needed
            };
        });

        return gameData;
    } catch (error) {
        console.error('Error fetching MLB game data:', error);
        return null;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function sendToClaudeAPI(gameData) {
    const prompt = `
    Analyze the following MLB game data and provide insights:
    ${JSON.stringify(gameData)}
    
    Return your analysis as a JSON object with relevant statistics and observations.
    `;

    try {
        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: "claude-3-opus-20240229",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY
            }
        });

        return response.data.content[0].text;
    } catch (error) {
        console.error('Error calling Claude API:', error);
        return null;
    }
}

export async function getMLBDataByGame(gameId) {
    const gameData = await getESPNMLBGameData(gameId);
    if (gameData) {
        return await sendToClaudeAPI(gameData);
    }
    return null;
}
