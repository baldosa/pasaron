// server.js - Express SSR Server
const express = require('express');
const fs = require('fs');
const path = require('path');
const { diff } = require('util');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration - EDIT THESE VALUES
const CONFIG = {
    targetDate: '2027-12-08',
    startDate: '2023-12-08',
};

// Read template file
const templatePath = path.join(__dirname, 'index.html');
let template = '';

try {
    template = fs.readFileSync(templatePath, 'utf8');
} catch (error) {
    console.error('Error reading template.html:', error.message);
    process.exit(1);
}

function calculateCountdown() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(CONFIG.targetDate);
    target.setHours(0, 0, 0, 0);

    const start = new Date(CONFIG.startDate);
    start.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const diffTimeStart = today.getTime() - start.getTime();
    const daysSinceStart = Math.ceil(diffTimeStart / (1000 * 60 * 60 * 24));

    let title, description, displayNumber, displayText;

    if (daysRemaining > 0) {
        displayNumber = daysSinceStart + 1;
        displayText = `solo faltan ${daysRemaining}...`;
        title = `Pasaron ${daysSinceStart} días, faltan ${daysRemaining}...`;
        description = `Ya pasaron ${daysSinceStart} días, solofaltan ${daysRemaining}...`;
    } else if (daysRemaining === 0) {
        displayNumber = daysSinceStart + 1;
        displayText = `ya no falta nada...`;
        title = `Pasaron ${daysSinceStart} días, ya no falta nada`;
        description = `Ya pasaron ${daysSinceStart} días, ya no falta nada`;
    }

    return {
        targetDate: CONFIG.targetDate,
        daysRemaining,
        displayNumber,
        displayText,
        title,
        description,
        siteUrl: process.env.SITE_URL || 'https://pasaron.meme.ar'
    };
}

function renderHTML(data) {
    // Replace placeholders in template
    return template
        .replace(/\{\{title\}\}/g, data.title)
        .replace(/\{\{description\}\}/g, data.description)
        .replace(/\{\{siteUrl\}\}/g, data.siteUrl)
        .replace(/\{\{displayNumber\}\}/g, data.displayNumber)
        .replace(/\{\{displayText\}\}/g, data.displayText)
        .replace(/\{\{targetDate\}\}/g, data.targetDate);
}

// Main route
app.get('/', (req, res) => {
    const countdown = calculateCountdown();
    const html = renderHTML(countdown);
    res.send(html);
});
app.use(express.static('static'))

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;