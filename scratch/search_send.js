const fs = require('fs');
const path = require('path');

const dir = 'src';
const searchWord = 'Send';

const scanDir = (currentPath) => {
  const files = fs.readdirSync(currentPath);
  files.forEach(f => {
    const fullPath = path.join(currentPath, f);
    if (fs.lstatSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        // match exact word 'Send'
        const regex = /\bSend\b/g;
        if (regex.test(line)) {
          // Check if it's not part of SendIcon
          if (!line.includes('SendIcon') && !line.includes('Send as SendIcon')) {
            console.log(`${fullPath}:${index + 1} -> ${line.trim()}`);
          }
        }
      });
    }
  });
};

scanDir(dir);
