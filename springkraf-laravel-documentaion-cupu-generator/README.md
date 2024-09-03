# API Documentation Helper

This project provides a script to assist with backend documentation generation, making it easier to create proper API documentation using plugins like Scribe or Swagger.

## Overview

The project includes two primary scripts:

1. **`generated_api_urls_with_validation-generator.js`**: Generates detailed API validation rules.
2. **`postman-template-generator.js`**: Generates Postman request templates based on the generated API URLs and validation rules.

## Usage

### Step 1: Generate API Details

Run the `generated_api_urls_with_validation-generator.js` script to generate detailed API information, including validation rules.

```bash
node generated_api_urls_with_validation-generator.js
```

This script will output a file named `generated_api_urls_with_validation.txt` containing the API details.

### Step 2: Generate Postman Request Templates

Once the API details are generated, run the `postman-template-generator.js` script to create a Postman request template for each URL.

```bash
node postman-template-generator.js
```

The script will generate a `postman_template.json` file in the project directory. This file contains structured JSON data representing the API requests that can be imported into Postman.

## Purpose

This tool is designed to streamline the process of documenting backend APIs, particularly for those using documentation plugins like Scribe or Swagger. It helps automate the creation of Postman templates, ensuring that your API documentation is consistent and up-to-date.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

### Instructions:

1. **Copy and paste** the above content into a file named `README.md` in your project directory.
2. **Modify** any details that might need to be specific to your setup, such as file paths or script names.
