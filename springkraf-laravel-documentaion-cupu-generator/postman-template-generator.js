const fs = require('fs');
const path = require('path');

// Function to map Laravel validation rules to example values
function getExampleValue(rule) {
    if (rule.includes('string')) return 'string';
    if (rule.includes('uuid')) return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'; // Example UUID
    if (rule.includes('numeric') || rule.includes('integer')) return 1;
    if (rule.includes('boolean')) return true;
    if (rule.includes('array')) return [];
    if (rule.includes('date')) return 'YYYY-MM-DD';
    if (rule.includes('date_format:H:i')) return 'HH:MM';
    if (rule.includes('phone')) return '08123456789'; // Example phone number
    return null;
}

// Read the content of the file
const filePath = path.join(__dirname, 'generated_api_urls_with_validation.txt');
const fileContent = fs.readFileSync(filePath, 'utf-8');

// Split the content into lines
const lines = fileContent.split('\n');

// Initialize variables
const postmanTemplate = {};
let currentUrl = '';
let currentValidationRules = [];

// Parse each line
lines.forEach(line => {
    line = line.trim();

    if (line.startsWith('URL:')) {
        if (currentUrl) {
            if (currentValidationRules.length) {
                const bodyTemplate = {};
                currentValidationRules.forEach(rule => {
                    const [key, ruleString = ''] = rule.split('=>').map(item => item.trim().replace(/['"\[\]]/g, ''));
                    const rules = ruleString.split('|').map(r => r.trim());
                    const exampleValue = getExampleValue(rules.join('|'));
                    if (exampleValue !== null) {
                        bodyTemplate[key] = exampleValue;
                    }
                });
                postmanTemplate[currentUrl] = bodyTemplate;
            } else {
                postmanTemplate[currentUrl] = {};
            }
        }
        currentUrl = line.replace('URL:', '').trim();
        currentValidationRules = [];
    } else if (line.startsWith('- ')) {
        currentValidationRules.push(line.replace('- ', '').trim());
    }
});

// Handle the last URL in the file
if (currentUrl) {
    if (currentValidationRules.length) {
        const bodyTemplate = {};
        currentValidationRules.forEach(rule => {
            const [key, ruleString] = rule.split('=>').map(item => item.trim().replace(/['"\[\]]/g, ''));
            const rules = ruleString.split('|').map(r => r.trim());
            const exampleValue = getExampleValue(rules.join('|'));
            if (exampleValue !== null) {
                bodyTemplate[key] = exampleValue;
            }
        });
        postmanTemplate[currentUrl] = bodyTemplate;
    } else {
        postmanTemplate[currentUrl] = {};
    }
}

// Define the output file path
const outputFilePath = path.join(__dirname, 'postman_template.json');

// Write the JSON data to the file
fs.writeFileSync(outputFilePath, JSON.stringify(postmanTemplate, null, 2), 'utf-8');

console.log(`JSON data has been written to ${outputFilePath}`);
