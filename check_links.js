const fs = require('fs');
const readline = require('readline');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const README_PATH = 'README.md';
const OUTPUT_PATH = 'link_check_results.md';

const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;

async function checkUrl(urlStr) {
    try {
        const url = new URL(urlStr);
        const lib = url.protocol === 'https:' ? https : http;
        return new Promise((resolve) => {
            const req = lib.get(urlStr, { timeout: 5000, headers: {'User-Agent': 'Mozilla/5.0'} }, (res) => {
                const { statusCode, headers } = res;
                if (statusCode >= 300 && statusCode < 400 && headers.location) {
                    resolve({ status: statusCode, redirect: headers.location, valid: true });
                } else if (statusCode >= 200 && statusCode < 300) {
                    resolve({ status: statusCode, valid: true });
                } else {
                    resolve({ status: statusCode, valid: false });
                }
                res.resume(); // consume response data to free up memory
            });
            req.on('error', (e) => {
                resolve({ error: e.message, valid: false });
            });
            req.on('timeout', () => {
                req.destroy();
                resolve({ error: 'timeout', valid: false });
            });
        });
    } catch (e) {
        return { error: 'invalid url', valid: false };
    }
}

async function main() {
    const content = fs.readFileSync(README_PATH, 'utf8');
    const links = [];
    
    let match;
    while ((match = markdownLinkRegex.exec(content)) !== null) {
        const title = match[1];
        const url = match[2];
        
        if (url.includes('img.shields.io') || url.includes('badgen.net') || url.includes('awesome.re')) {
            continue;
        }
        
        links.push({ title, url });
    }
    
    console.log(`Found ${links.length} links to check.`);
    fs.writeFileSync(OUTPUT_PATH, '# Link Check Results\n\n| Title | URL | Status | Redirect/Error |\n|---|---|---|---|\n');
    
    // Check in batches to avoid network issues
    const batchSize = 10;
    for (let i = 0; i < links.length; i += batchSize) {
        const batch = links.slice(i, i + batchSize);
        const results = await Promise.all(batch.map(async (link) => {
            const result = await checkUrl(link.url);
            let statusText = result.valid ? '✅ Valid' : '❌ Broken';
            if (result.status) statusText += ` (${result.status})`;
            let extra = result.redirect ? `Redirects to ${result.redirect}` : (result.error ? result.error : '-');
            return `| ${link.title.replace(/\|/g, '-')} | ${link.url} | ${statusText} | ${extra} |`;
        }));
        
        fs.appendFileSync(OUTPUT_PATH, results.join('\n') + '\n');
        console.log(`Checked ${Math.min(i + batchSize, links.length)} / ${links.length}`);
    }
    console.log(`Done! Results saved to ${OUTPUT_PATH}`);
}

main();
