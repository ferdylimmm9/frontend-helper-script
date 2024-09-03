# Static Assets Enum Generator

This script recursively gathers static link assets from the `public` directory, converts their folder and file names from `kebab-case` to `CONSTANT_CASE`, and generates a TypeScript enum containing the paths of these assets.

## Features

- **Recursive Asset Gathering:** The script scans the `public` directory and all its subdirectories for static assets.
- **Kebab-case to CONSTANT_CASE Conversion:** Folder and file names are converted from `kebab-case` to `CONSTANT_CASE` for enum keys.
- **Automatic Directory and File Creation:** If the target directory or file for the generated enum doesn't exist, the script creates them automatically.

## Usage

### 1. Place the Script

Ensure that the script is located in the `scripts` folder of your project.

### 2. Run the Script

Use `node` or Node.js to execute the script:

```bash
node scripts/static-file-gatherer.js
```

### 3. Output

The script will generate a TypeScript enum file at `src/assets/StaticAssets.ts`. The enum will contain entries for each static asset found in the `public` directory, with the paths as values.

Example output:

```typescript
export enum StaticAssets {
    IMAGES_ICONS_LOGO_SMALL_PNG = "images/icons/logo-small.png",
    FONTS_CUSTOM_FONT_WOFF2 = "fonts/custom-font.woff2",
}
```

### 4. Customization

- **Enum Name:** The enum name can be customized by modifying the `enumName` variable in the script.
- **Directory Paths:** Adjust the `publicDir` and `enumFilePath` variables to fit your project's structure if needed.

## Dependencies

- **Node.js**: Ensure Node.js is installed.
- **TypeScript**: This script is written in TypeScript. Make sure your environment supports TypeScript.

## Troubleshooting

- **File Not Found Errors:** If you encounter `ENOENT` errors, the script will automatically create the necessary directories and file. Ensure you have proper write permissions in the target directories.

- **Path Issues:** Ensure that the paths to the `public` directory and the output file are correctly set relative to the script's location.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.