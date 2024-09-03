# Page Routes Generator

This project includes a script to automatically generate a TypeScript enum for Next.js page routes. The enum is grouped by directories and handles dynamic routes by creating additional enum names.

## Features

- **Automatic Route Detection:** Recursively scans the `pages` directory to detect all routes.
- **Enum Generation:** Generates a TypeScript enum with constants for each route.
- **Grouped by Directories:** Routes are grouped and commented by their directory structure.
- **Dynamic Route Handling:** Supports dynamic routes like `[id]` and `[slug]` by generating appropriate enum names.

## Directory Structure

The script expects the following directory structure for your Next.js project:

```
pages/
├── 404.tsx
├── _app.tsx
├── _document.tsx
├── about-us
│   └── index.tsx
├── api-tester.tsx
├── career
│   └── index.tsx
├── cart
│   └── index.tsx
├── catalogs
│   └── index.tsx
├── contact-us
│   └── index.tsx
├── dashboard
│   ├── account-setting.tsx
│   ├── address-setting.tsx
│   ├── complaint
│   │   └── [id].tsx
│   ├── index.tsx
│   ├── payment-status
│   │   └── [id].tsx
│   ├── payment-status.tsx
│   └── send-message.tsx
├── example.tsx
├── index.tsx
├── outlets.tsx
├── package
│   └── [slug].tsx
├── privacy-policy
│   └── index.tsx
├── product
│   ├── [id].tsx
│   ├── index.tsx
│   └── recommendation
│       └── [slug].tsx
├── reset-password.tsx
├── sign-in.tsx
├── terms-and-conditions
│   └── index.tsx
└── wishlist.tsx
```

## Usage

1. **Install Dependencies:**

   Ensure you have `typescript` and `ts-node` installed:

   ```bash
   npm install typescript ts-node
   ```

2. **Run the Script:**

   To generate the `PageRoutes` enum, run the following command:

   ```bash
   ts-node scripts/generatePageRoutesEnum.ts
   ```

   This will create or update the `PageRoutes.ts` file in the `src/routes/` directory.

3. **Generated Enum:**

   The script will generate a TypeScript enum similar to the following:

   ```typescript
   export enum PageRoutes {

       // Root Pages
       PAGE_404 = "/404",
       _APP = "/_app",
       _DOCUMENT = "/_document",
       API_TESTER = "/api-tester",
       EXAMPLE = "/example",
       INDEX = "/",
       OUTLETS = "/outlets",
       RESET_PASSWORD = "/reset-password",
       SIGN_IN = "/sign-in",
       WISHLIST = "/wishlist",

       // ABOUT-US Pages
       ABOUT_US = "/about-us",

       // CAREER Pages
       CAREER = "/career",

       // CART Pages
       CART = "/cart",

       // CATALOGS Pages
       CATALOGS = "/catalogs",

       // CONTACT-US Pages
       CONTACT_US = "/contact-us",

       // DASHBOARD Pages
       DASHBOARD_ACCOUNT_SETTING = "/dashboard/account-setting",
       DASHBOARD_ADDRESS_SETTING = "/dashboard/address-setting",
       DASHBOARD = "/dashboard",
       DASHBOARD_PAYMENT_STATUS = "/dashboard/payment-status",
       DASHBOARD_SEND_MESSAGE = "/dashboard/send-message",

       // DASHBOARD COMPLAINT Pages
       DASHBOARD_COMPLAINT_ID = "/dashboard/complaint/[id]",

       // DASHBOARD PAYMENT-STATUS Pages
       DASHBOARD_PAYMENT_STATUS_ID = "/dashboard/payment-status/[id]",

       // PACKAGE Pages
       PACKAGE_SLUG = "/package/[slug]",

       // PRIVACY-POLICY Pages
       PRIVACY_POLICY = "/privacy-policy",

       // PRODUCT Pages
       PRODUCT_ID = "/product/[id]",
       PRODUCT = "/product",

       // PRODUCT RECOMMENDATION Pages
       PRODUCT_RECOMMENDATION_SLUG = "/product/recommendation/[slug]",

       // TERMS-AND-CONDITIONS Pages
       TERMS_AND_CONDITIONS = "/terms-and-conditions",

   }
   ```

4. **Using the Enum:**

   You can now use the `PageRoutes` enum throughout your codebase to reference page routes consistently:

   ```typescript
   import { PageRoutes } from 'src/routes/PageRoutes';

   const signInUrl = PageRoutes.SIGN_IN;
   ```

## Customization

- **Directory Structure:** The script assumes a standard Next.js `pages` directory structure but can be modified to fit other structures.
- **Enum Naming:** The enum names are derived from the file paths using CONSTANT_CASE. If needed, you can adjust the naming logic in the script.

## Contribution

Feel free to contribute to this project by opening an issue or submitting a pull request.
