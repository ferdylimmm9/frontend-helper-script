const fs = require('fs');
const path = require('path');

// Define a function to recursively read all files in a directory
const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(file => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
};
// Define the root directory for the project
const rootDir = path.resolve(__dirname, '..');

// Define the relative path of the version-control.json file
const versionControlPath = path.join(rootDir, 'version-control.json');
let oldVersionControl = {
  runtimeVersion: '1',
  versionCode: '1',
  versionName: '1.0.0',
};

let newVersionControl = {
  runtimeVersion: '1',
  versionCode: '1',
  versionName: '1.0.0',
};

// Step 1: Read or create version-control.json
if (fs.existsSync(versionControlPath)) {
  oldVersionControl = JSON.parse(fs.readFileSync(versionControlPath, 'utf-8'));
  newVersionControl = JSON.parse(fs.readFileSync(versionControlPath, 'utf-8'));
} else {
  fs.writeFileSync(
    versionControlPath,
    JSON.stringify(oldVersionControl, null, 2),
  );
}

// Step 2: Update version based on process argument
const processArg = process.argv[2]; // e.g., "patch", "minor", or "major"
const [major, minor, patch] = newVersionControl.versionName
  .split('.')
  .map(Number);
const upVersionCode = () => {
  newVersionControl.versionCode = (
    parseInt(newVersionControl.versionCode, 10) + 1
  ).toString();
};
switch (processArg) {
  case 'patch':
    newVersionControl.versionName = `${major}.${minor}.${patch + 1}`;
    upVersionCode();
    break;
  case 'minor':
    newVersionControl.versionName = `${major}.${minor + 1}.0`;
    upVersionCode();
    break;
  case 'major':
    newVersionControl.versionName = `${major + 1}.0.0`;
    upVersionCode();
    break;
}

// Check if the --runtime argument is passed and bump the runtime version if it is
const isBumpRuntime = process.argv.includes('--runtime');

if (isBumpRuntime) {
  newVersionControl.runtimeVersion = (
    parseInt(newVersionControl.runtimeVersion, 10) + 1
  ).toString();
}

fs.writeFileSync(
  versionControlPath,
  JSON.stringify(newVersionControl, null, 2),
);

// Define the mapping of file types to their specific old and new values
const staticFiles = {
  'build.gradle': [
    {
      oldValue: `versionCode ${oldVersionControl.versionCode}`,
      newValue: `versionCode ${newVersionControl.versionCode}`,
    },
    {
      oldValue: `versionName "${oldVersionControl.versionName}"`,
      newValue: `versionName "${newVersionControl.versionName}"`,
    },
  ],
  'project.pbxproj': [
    {
      oldValue: `CURRENT_PROJECT_VERSION = ${oldVersionControl.versionCode};`,
      newValue: `CURRENT_PROJECT_VERSION = ${newVersionControl.versionCode};`,
    },
    {
      oldValue: `MARKETING_VERSION = ${oldVersionControl.versionName};`,
      newValue: `MARKETING_VERSION = ${newVersionControl.versionName};`,
    },
  ],
  'gradle.properties': [
    {
      oldValue: `BUILD_VERSION_CODE=${oldVersionControl.versionCode}`,
      newValue: `BUILD_VERSION_CODE=${newVersionControl.versionCode}`,
    },
    {
      oldValue: `BUILD_VERSION_NAME=${oldVersionControl.versionName}`,
      newValue: `BUILD_VERSION_NAME=${newVersionControl.versionName}`,
    },
  ],
  'version.properties': [
    {
      oldValue: `versionCode=${oldVersionControl.versionCode}`,
      newValue: `versionCode=${newVersionControl.versionCode}`,
    },
    {
      oldValue: `versionName=${oldVersionControl.versionName}`,
      newValue: `versionName=${newVersionControl.versionName}`,
    },
  ],
};

const dynamicFiles = {
  'package.json': {
    regexPatterns: [
      { regex: /("version":\s*")([\d\.]+)(",)/g, replacement: 'versionName' },
    ],
  },
  'AndroidManifest.xml': {
    regexPatterns: [
      {
        regex:
          /(<meta-data\s+android:name="expo.modules.updates.EXPO_RUNTIME_VERSION"\s+android:value=")(\d+)("\s*\/>)/g,
        replacement: 'runtimeVersion',
      },
    ],
  },
  'Expo.plist': {
    regexPatterns: [
      {
        regex:
          /(<key>EXUpdatesRuntimeVersion<\/key>\s*<string>)(\d+)(<\/string>)/g,
        replacement: 'runtimeVersion',
      },
    ],
  },
  'app.json': {
    regexPatterns: [
      {
        regex: /("runtimeVersion"\s*:\s*")(\d+)(")/g,
        replacement: 'runtimeVersion',
      },
      { regex: /("version":\s*")([\d\.]+)(",)/g, replacement: 'versionName' },
    ],
  },
  'strings.xml': {
    regexPatterns: [
      {
        regex:
          /(<string\s+name="expo_runtime_version"\s+translatable="false">)(\d+)(<\/string>)/g,
        replacement: 'runtimeVersion',
      },
    ],
  },
  'Info.plist': {
    regexPatterns: [
      {
        regex: /(<key>CFBundleVersion<\/key>\s*<string>)(\d+)(<\/string>)/g,
        replacement: 'versionCode',
      },
    ],
  },
};

// Step 3: Read and update files dynamically based on the configuration
const updateFileStatic = (filePath, oldValues) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    // Perform replacements in a single pass
    oldValues.forEach(({ oldValue, newValue }) => {
      if (content.includes(oldValue)) {
        content = content.split(oldValue).join(newValue);
      }
    });

    fs.writeFileSync(filePath, content);
  } else {
    console.error(`File not found: ${filePath}`);
  }
};

const updateDynamicFile = (filePath, regexPatterns) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');

    regexPatterns.forEach(({ regex, replacement }) => {
      // Handle specific cases for different file types
      content = content.replace(regex, (match, p1, p2, p3) => {
        // For other files, use the standard replacement format
        return `${p1}${newVersionControl[replacement]}${p3}`;
      });
    });

    fs.writeFileSync(filePath, content);
  } else {
    console.error(`File not found: ${filePath}`);
  }
};

// Step 4: Recursively read all files and update if they match the config
const replaceStaticFiles = Object.keys(staticFiles);
const replaceDynamicFiles = Object.keys(dynamicFiles);
const allFiles = getAllFiles(rootDir);
allFiles.forEach(file => {
  const fileName = path.basename(file);
  const isNodeModules = file.includes('node_modules');
  const isMustReplaceStaticFile = replaceStaticFiles.includes(fileName);
  const isMustReplaceDynamicFile = replaceDynamicFiles.includes(fileName);

  if (isMustReplaceStaticFile && !isNodeModules) {
    updateFileStatic(file, staticFiles[fileName]);
  } else if (isMustReplaceDynamicFile && !isNodeModules) {
    updateDynamicFile(file, dynamicFiles[fileName].regexPatterns);
  }
});

console.log('Version control update completed successfully.');