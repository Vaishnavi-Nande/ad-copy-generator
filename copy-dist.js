const fs = require('fs');
const path = require('path');

if (process.env.VERCEL) {
  console.log("Running in Vercel environment. Skipping copying build files to root.");
  process.exit(0);
}

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

const distPath = path.join(__dirname, 'dist');
const rootPath = __dirname;

if (fs.existsSync(distPath)) {
  console.log("Copying build files from dist to root...");
  
  // Copy index.html to root
  const indexHtmlFrom = path.join(distPath, 'index.html');
  const indexHtmlTo = path.join(rootPath, 'index.html');
  if (fs.existsSync(indexHtmlFrom)) {
    fs.copyFileSync(indexHtmlFrom, indexHtmlTo);
    console.log("Copied index.html to root.");
  }
  
  // Copy assets to root/assets
  const assetsFrom = path.join(distPath, 'assets');
  const assetsTo = path.join(rootPath, 'assets');
  if (fs.existsSync(assetsFrom)) {
    copyFolderSync(assetsFrom, assetsTo);
    console.log("Copied assets to root.");
  }
  
  console.log("Build files successfully copied to root!");
} else {
  console.error("dist folder not found. Run vite build first.");
}
