const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, 'dist', 'assets', 'index-By3K5STR.js');
if (!fs.existsSync(bundlePath)) {
  console.log("Bundle file does not exist at:", bundlePath);
  process.exit(1);
}

const content = fs.readFileSync(bundlePath, 'utf8');

const regex = /\bSend\b/g;
let match;
let count = 0;

console.log("Searching for '\\bSend\\b' in new bundle...");

while ((match = regex.exec(content)) !== null) {
  count++;
  const index = match.index;
  const start = Math.max(0, index - 80);
  const end = Math.min(content.length, index + 80);
  console.log(`\nMatch ${count} at index ${index}:`);
  console.log("CONTEXT:", content.substring(start, end));
}

console.log(`\nTotal matches: ${count}`);
