# SVG Index Generator

This script generates an `index.tsx` file that exports all SVG components from a specified directory. Each file is automatically exported using a PascalCase naming convention based on the file name.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Usage](#usage)
- [Example Output](#example-output)
- [Customization](#customization)
- [License](#license)

## Overview

The SVG Index Generator script is designed to automate the process of creating an `index.tsx` file in a directory containing multiple SVG components. The script reads all `.tsx` files, converts their filenames to PascalCase, and generates export statements for each file.

## Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the Directory**:
   ```bash
   cd <repository-directory>
   ```

3. **Install Dependencies**:
   Ensure you have Node.js installed. If not, download and install it from [here](https://nodejs.org/).

## Usage

1. **Adjust the Directory Path**:
   By default, the script looks for SVG components in the `../src/common/assets/svg` directory relative to the script. Modify the `directoryPath` variable in the script if your SVG components are in a different directory.

   ```javascript
   const directoryPath = path.join(__dirname, '../src/common/assets/svg'); // Adjust this path as needed
   ```

2. **Run the Script**:
   Run the script using Node.js:

   ```bash
   node svg-index-generator.js
   ```

3. **Check the Generated `index.tsx`**:
   The script will generate an `index.tsx` file in the specified directory with export statements for each `.tsx` file.

## Example Output

Assume you have the following files in the SVG directory:

- `arrow-bottom-svg.tsx`
- `arrow-left-svg.tsx`

The generated `index.tsx` will look like:

```typescript
export { default as ArrowBottomSVG } from './arrow-bottom-svg';
export { default as ArrowLeftSVG } from './arrow-left-svg';
```

## Customization

- **PascalCase Conversion**: The script converts filenames to PascalCase for export names. Modify the `toPascalCase` function if you need a different naming convention.

- **Directory Path**: Adjust the `directoryPath` variable to point to your specific directory.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.