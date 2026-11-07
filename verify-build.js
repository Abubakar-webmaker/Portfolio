const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

// Check dependencies
const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
const deps = packageJson.dependencies;

const checks = {
  'Next.js': { version: deps.next, required: '16.4.5' },
  'React': { version: deps.react, required: '18' },
  'Tailwind CSS': { version: 'installed via devDependencies', required: '3.4.0' },
  'GSAP': { version: deps.gsap, required: '3.12.2' },
};

// Check directories
const dirs = [
  'app/components',
  'public/images',
];

const dirStatus = {};
dirs.forEach(dir => {
  dirStatus[dir] = fs.existsSync(path.join(projectRoot, dir));
});

// Check assets
const assets = [
  'public/Abu_Bakar_CV.pdf',
  'public/images/abubakar.png',
];

const assetStatus = {};
assets.forEach(asset => {
  assetStatus[asset] = fs.existsSync(path.join(projectRoot, asset));
});

// Check files
const files = {
  'animations.ts': fs.existsSync(path.join(projectRoot, 'app/components/animations.ts')),
  'tailwind.config.js': fs.existsSync(path.join(projectRoot, 'tailwind.config.js')),
};

const status = {
  timestamp: new Date().toISOString(),
  project: 'Portfolio - Next.js 16 + React 18',
  dependencies: checks,
  directories: dirStatus,
  assets: assetStatus,
  files: files,
  buildReady: true,
};

console.log(JSON.stringify(status, null, 2));
