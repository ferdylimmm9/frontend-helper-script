const fs = require('fs');
const path = require('path');

// Step 1: Read the api.php file
const apiFilePath = path.join(__dirname, '/routes/api.php');
const apiFileContent = fs.readFileSync(apiFilePath, 'utf8');

// Step 2: Define the directory for the controllers
const controllersDir = path.join(__dirname, '/app/Http/Controllers');

// Function to get the full path of a controller file
const getControllerFilePath = (controllerName) => {
    const fileName = controllerName.replace(/\\/g, '/') + '.php';
    return path.join(controllersDir, fileName);
};

// Step 3: Extract routes using regex (ignoring ->name(...) and other trailing methods)
const routePattern = /\$api->(get|post|put|delete)\('(.+?)',\s*'(.+?)@(.+?)'\)/g;
const groupPattern = /\$api->group\(\[.*?\],\s*function\s*\(\)\s*use\s*\(\$api\)\s*\{([^]*?)\}\);/g;
const routes = [];
let match;

// Extract routes from groups
while ((match = groupPattern.exec(apiFileContent)) !== null) {
    const groupRoutes = match[1];
    let routeMatch;

    while ((routeMatch = routePattern.exec(groupRoutes)) !== null) {
        routes.push({
            method: routeMatch[1],
            url: routeMatch[2],
            controller: routeMatch[3],
            action: routeMatch[4],
        });
    }
}

// Extract routes outside of groups
while ((match = routePattern.exec(apiFileContent)) !== null) {
    routes.push({
        method: match[1],
        url: match[2],
        controller: match[3],
        action: match[4],
    });
}

// Step 4: Extract validation rules from the controller methods
const extractValidationRules = (controllerFilePath, action) => {
    try {
        const controllerContent = fs.readFileSync(controllerFilePath, 'utf8');

        // Match validation arrays in the $request->validate call
        const validationPattern = new RegExp(`${action}\\s*\\(.*?\\{[^]*?\\$request->validate\\(\\[([^]*?)\\]\\s*\\)`, 's');
        let validationMatch = validationPattern.exec(controllerContent);

        if (!validationMatch) {
            // Match validation arrays in the $this->validate($request, ...) call
            const validationPatternAlt = new RegExp(`${action}\\s*\\(.*?\\{[^]*?\\$this->validate\\(\\$request,\\s*\\[([^]*?)\\]\\s*\\)`, 's');
            validationMatch = validationPatternAlt.exec(controllerContent);
        }

        if (validationMatch) {
            // Clean up validation rules
            return cleanValidationRules(validationMatch[1].trim());
        }
        return 'No specific validation rules found'; // Return a more descriptive message
    } catch (e) {
        console.log(controllerFilePath, e);
        return null;
    }
};

// Function to clean up validation rules, removing commented lines and formatting
const cleanValidationRules = (rules) => {
    // Remove commented lines and empty lines
    const cleanedRules = rules
        .split('\n')
        .filter(line => !line.trim().startsWith('//') && line.trim().length > 0)
        .map(line => line.trim())
        .join('\n');
    
    // If there are no usable rules left, indicate this
    return cleanedRules.length > 0 ? cleanedRules : 'No specific validation rules found';
};

// Step 5: Beautify the output to be more human-readable
const beautifyApiRequests = (routes) => {
    return routes.map(({ method, url, controller, action }) => {
        const controllerFilePath = getControllerFilePath(controller);
        if (fs.existsSync(controllerFilePath)) {
            const validationRules = extractValidationRules(controllerFilePath, action);
            if (validationRules) {
                return formatValidation(method, url, controller, action, validationRules);
            }
        }
        return formatValidation(method, url, controller, action, 'No validation required');
    }).join('\n\n');
};

const formatValidation = (method, url, controller, action, validationRules) => {
    if (validationRules === 'No specific validation rules found' || validationRules === 'No validation required') {
        return `Method: ${method.toUpperCase()}\n` +
               `URL: ${url}\n` +
               `Controller: ${controller}\n` +
               `Action: ${action}\n` +
               `Validation Rules: ${validationRules}`;
    }

    const rules = validationRules.split('\n').map(rule => rule.trim());
    const formattedRules = rules.map(rule => `    - ${rule}`).join('\n');

    return `Method: ${method.toUpperCase()}\n` +
           `URL: ${url}\n` +
           `Controller: ${controller}\n` +
           `Action: ${action}\n` +
           `Validation Rules:\n${formattedRules}`;
};

// Step 6: Generate the output for each route with corresponding validation rules
const generatedOutputs = beautifyApiRequests(routes);

// Step 7: Write the generated outputs to a new file
const outputFilePath = path.join(__dirname, 'generated_api_urls_with_validation.txt');
fs.writeFileSync(outputFilePath, generatedOutputs, 'utf8');

console.log('API URLs with validation rules generated successfully in generated_api_urls_with_validation.txt');
