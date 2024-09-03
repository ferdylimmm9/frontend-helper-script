const fs = require('fs');
const path = require('path');

// Directory containing the public assets
const publicDir = path.join(__dirname, '..', 'public');

// Enum file path
const enumFilePath = path.join(
  __dirname,
  '..',
  'src',
  'assets',
  'static-assets.ts',
);

// Enum name
const enumName = 'StaticAssets';

function kebabToConstantCase(str) {
  return str.replace(/-/g, '_').toUpperCase();
}

// Function to recursively get all static file paths
function gatherStaticAssets(dir, basePath = '') {
  const assets = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const relativePath = path.join(basePath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      assets.push(...gatherStaticAssets(fullPath, relativePath));
    } else {
      assets.push(relativePath.replace(/\\/g, '/'));
    }
  });

  return assets;
}

// Function to convert file paths into enum entries
function createEnumEntries(paths) {
  return paths
    .map((filePath) => {
      const enumKey = filePath
        .replace(/^\//, '')
        .split('/')
        .map(kebabToConstantCase)
        .join('_')
        .replace(/\./g, '_')
        .toUpperCase();
      return `    ${enumKey} = "/${filePath}",`;
    })
    .join('\n');
}

// Function to ensure the directory exists
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
}

// Function to write the enum to a TypeScript file
function writeEnumToFile(enumContent) {
  ensureDirectoryExistence(enumFilePath);
  const enumFileContent = `export enum ${enumName} {\n${enumContent}\n}`;
  fs.writeFileSync(enumFilePath, enumFileContent, 'utf8');
}

// Main function
function generateStaticAssetsEnum() {
  const assets = gatherStaticAssets(publicDir);
  const enumEntries = createEnumEntries(assets);
  writeEnumToFile(enumEntries);
  console.log(`Enum ${enumName} has been generated successfully.`);
}

// Run the script
generateStaticAssetsEnum();
