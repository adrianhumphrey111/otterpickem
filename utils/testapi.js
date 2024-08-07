import fetch from 'node-fetch';

const apiUrl = 'https://api.sportradar.com/mlb/trial/v7/en/games/80b9d0a7-6d31-4940-a280-53f9fe1caac7/boxscore.json?api_key=TuDgFt1aOe3MKRW9KvEUs5PfolU0N0LTaASzocHJ'; // Replace with your API endpoint

async function makeRequest() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            const text = await response.text();
            console.error('Error Response Text:', text);
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error making request:', error);
        return null; // Handle errors gracefully
    }
}

function measureRequestsPerSecond() {
    const startTime = Date.now();
    const duration = 1000; // 1 second
    let requestCount = 0;

    function makeRequests() {
        const now = Date.now();
        if (now - startTime < duration) {
            makeRequest().then(() => {
                requestCount++;
                makeRequests(); // Recursively call to continue making requests
            });
        } else {
            console.log(`Requests per second: ${requestCount}`);
        }
    }

    makeRequests();
}

measureRequestsPerSecond();
