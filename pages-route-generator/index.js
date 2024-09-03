const fs = require('fs');
const path = require('path');

// Adjust the path to the pages directory and output file based on your script location
const pagesDir = path.join(__dirname, '..', 'src', 'pages');
const enumFilePath = path.join(
  __dirname,
  '..',
  'src',
  'routes',
  'page-routes.ts',
);

// Enum name
const enumName = 'PageRoutes';

const skip_files = ['404.tsx', '_app.tsx', '_document.tsx'];

function gatherPageRoutes(dir, basePath = '') {
  const routes = {};
  const files = fs.readdirSync(dir);

  files
    .filter((file) => {
      return !skip_files.includes(file);
    })
    .forEach((file) => {
      const fullPath = path.join(dir, file);
      const relativePath = path.join(basePath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        const subRoutes = gatherPageRoutes(fullPath, relativePath);
        Object.keys(subRoutes).forEach((key) => {
          if (!routes[key]) {
            routes[key] = [];
          }
          routes[key].push(...subRoutes[key]);
        });
      } else if (file.endsWith('.tsx') || file.endsWith('.js')) {
        let route = relativePath.replace(/\.(tsx|js)$/, '').replace(/\\/g, '/');
        if (route.endsWith('/index')) {
          route = route.replace('/index', '');
        }
        const routeKey = path.dirname(relativePath).replace(/\\/g, '/');
        if (!routes[routeKey]) {
          routes[routeKey] = [];
        }
        routes[routeKey].push(route);
      }
    });

  return routes;
}

// Function to convert kebab-case to CONSTANT_CASE
function kebabToConstantCase(str) {
  return str.replace(/-/g, '_').toUpperCase();
}

// Function to convert file paths into enum entries grouped by directory
function createEnumEntries(routes) {
  let entries = '';

  Object.keys(routes).forEach((group) => {
    const groupComment =
      group === '.'
        ? 'Root Pages'
        : `${group.replace('/', ' ').toUpperCase()} Pages`;
    entries += `\n    // ${groupComment}\n`;

    routes[group].forEach((route) => {
      const enumKeyBase = route
        .replace(/^\//, '')
        .split('/')
        .map(kebabToConstantCase)
        .join('_')
        .replace(/\[|\]/g, '')
        .toUpperCase();

      const isDynamicRoute = /\[\w+\]/.test(route);
      if (isDynamicRoute) {
        const enumKey = `${enumKeyBase}`;
        entries += `    ${enumKey} = "/${route}",\n`;
      } else {
        entries += `    ${enumKeyBase} = "/${route}",\n`;
      }
    });
  });

  return entries;
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
  const enumFileContent = `export enum ${enumName} {${enumContent}\n}`;
  fs.writeFileSync(enumFilePath, enumFileContent, 'utf8');
}

// Main function
function generatePageRoutesEnum() {
  const routes = gatherPageRoutes(pagesDir);
  const enumEntries = createEnumEntries(routes);
  writeEnumToFile(enumEntries);
  console.log(`Enum ${enumName} has been generated successfully.`);
}

// Run the script
generatePageRoutesEnum();
