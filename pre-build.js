const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'index_template.html');
const destPath = path.join(__dirname, 'index.html');

console.log("Pre-build: Copying index_template.html to index.html...");
if (fs.existsSync(templatePath)) {
  fs.copyFileSync(templatePath, destPath);
  console.log("Pre-build: Successfully copied index_template.html to index.html");
} else {
  console.error("Pre-build Error: index_template.html not found!");
  process.exit(1);
}
