// script.js

document.getElementById('generateBtn').addEventListener('click', async () => {
    const userInput = document.getElementById('userInput').value;
    if (!userInput) {
        alert('Please enter a topic!');
        return;
    }

    // 1. Fetch Keywords using SERP API
    const keywords = await fetchKeywords(userInput);

    // 2. Generate Content using Writesonic API
    const content = await generateContent(keywords);

    // 3. Display Generated Content
    document.getElementById('generatedContent').textContent = content;

    // 4. Generate Meta Tags
    const metaTags = generateMetaTags(keywords);

    // 5. Display Meta Tags
    document.getElementById('metaTags').textContent = metaTags;
});

async function fetchKeywords(query) {
    const apiKey = '663a9c285beb1a3468839dae508384d4de2b2ba366384d118af1ac81e0f444c7';
    const response = await fetch('https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${'+ apiKey + '}');
    
    const data = await response.json();
    if (data.related_searches) {
        const keywords = data.related_searches.map(search => search.query);
        return keywords.join(', ');
    } else {
        return 'No keywords found.';
    }
}

async function generateContent(keywords) {
    const apiKey = 'YOUR_WRITESONIC_API_KEY';
    const response = await fetch('https://api.writesonic.com/v2/business/content/blog-ideas/create', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            keywords: keywords,
            language: "en",
            num_copies: 1,
        }),
    });

    const data = await response.json();
    return data[0].content || 'No content generated';
}

function generateMetaTags(keywords) {
    return `
        <meta name="description" content="Generated content about ${keywords}">
        <meta name="keywords" content="${keywords}">
        <meta name="author" content="AI Content Generator">
    `;
}
