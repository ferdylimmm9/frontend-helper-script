const fs = require('fs');
const path = require('path');

// Directory containing the SVG files
const directoryPath = path.join(__dirname, '../src/common/assets/svg'); // Adjust this path as needed

// Function to get PascalCase from a hyphenated file name
function toPascalCase(string) {
  return string.replace(/(^\w|-\w)/g, (match) =>
    match.replace('-', '').toUpperCase(),
  );
}

// Gather all .tsx files
const files = fs
  .readdirSync(directoryPath)
  .filter((file) => file.endsWith('.tsx') && !file.includes('index'));

// Generate index.tsx file content
let indexContent = '';

files.forEach((fileName) => {
  const exportName = toPascalCase(fileName.replace('.tsx', ''));
  const exportLine = `export { default as ${exportName} } from './${fileName.replace('.tsx', '')}';\n`;
  indexContent += exportLine;
});

// Write to index.tsx
const indexPath = path.join(directoryPath, 'index.tsx');
fs.writeFileSync(indexPath, indexContent);

console.log('index.tsx file generated successfully!');
