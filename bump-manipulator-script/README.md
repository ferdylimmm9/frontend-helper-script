# Version Bump Script

This script is designed to help SpringKraf native developers or React Native Expo developers automatically bump the version of their projects without manually updating the version numbers. This helps avoid potential typos and ensures consistency.

## Description

The version bump script provides an automated way to increment the version number in various configuration files. It supports bumping the version as a patch, minor, or major update. By using this script, developers can maintain accurate and consistent versioning across their project with minimal effort.

Adhering to these conventions ensures consistency and proper functionality across all platforms.

## Bumping `runtimeVersion`

### **AndroidManifest.xml**
Update the `expo.modules.updates.EXPO_RUNTIME_VERSION` meta-data tag:

```xml
<meta-data android:name="expo.modules.updates.EXPO_RUNTIME_VERSION" android:value="22" />
```

### **Expo.plist**
Update the `EXUpdatesRuntimeVersion` key:

```xml
<key>EXUpdatesRuntimeVersion</key>
<string>20</string>
```

### **app.json**
Update the `runtimeVersion` field:

```json
"runtimeVersion": "20",
```

### **strings.xml**
Update the `expo_runtime_version` string resource:

```xml
<string name="expo_runtime_version" translatable="false">12</string>
```

## Bumping `user version`

### **build.gradle**
Update the `versionCode` and `versionName`:

```groovy
versionCode 81
versionName "2.1.78"
```

### **project.pbxproj**
Update the `CURRENT_PROJECT_VERSION` and `MARKETING_VERSION`:

```plaintext
CURRENT_PROJECT_VERSION = 81;
MARKETING_VERSION = 2.1.78;
```

### **package.json**
Update the `version` field:

```json
"version": "1.1.78",
```

### **gradle.properties**
Update the `BUILD_VERSION_CODE` and `BUILD_VERSION_NAME`:

```plaintext
BUILD_VERSION_CODE=11
BUILD_VERSION_NAME=1.0.4
```

### **app.json**
Update the `version` field:

```json
"version": "1.0.8",
```

### **version.properties**
Update the `versionCode` and `versionName`:

```plaintext
versionCode=108
versionName=4.5.6
```

### **Info.plist**
Update the `CFBundleVersion` key:

```xml
<key>CFBundleVersion</key>
<string>$(CURRENT_PROJECT_VERSION)</string>
```

## Setup

1. **Add the script to your project:**

   Ensure that the `bump-manipulator.js` script is placed in your project directory. You can place it in any preferred location, for example, in a folder named `scripts`.

2. **Create `version-control.json`:**

   In the root of your project directory, create a file named `version-control.json`. This file will be used to control the version of your app. Here is an example of what the content might look like:

   ```json
   {
     "runtimeVersion": "1",
     "versionCode": "1",
     "versionName": "1.0.0"
   }
   ```

3. **Update `package.json`:**

   Open your `package.json` file and add the following scripts to the `"scripts"` section. Adjust the path to `bump-manipulator.js` according to where you placed the script in your project.

   ```json
   {
     "scripts": {
       "bump:patch": "node ./scripts/bump-manipulator.js patch",
       "bump:minor": "node ./scripts/bump-manipulator.js minor",
       "bump:major": "node ./scripts/bump-manipulator.js major"
     }
   }
   ```

4. **Run the Version Bump Commands:**

   You can now use the following commands to bump the version in your project:

   - **Patch version bump:**  
     This will increment the patch version (e.g., 1.0.0 to 1.0.1).
     ```sh
     npm run bump:patch
     ```

   - **Minor version bump:**  
     This will increment the minor version (e.g., 1.0.0 to 1.1.0).
     ```sh
     npm run bump:minor
     ```

   - **Major version bump:**  
     This will increment the major version (e.g., 1.0.0 to 2.0.0).
     ```sh
     npm run bump:major
     ```

## Benefits

- **Consistency:** Ensure that version numbers are updated consistently across all relevant files in your project.
- **Avoid Typos:** Eliminate the risk of making mistakes when manually updating version numbers.
- **Automation:** Save time and streamline the version bumping process.

## Example

To bump the patch version, simply run:
```sh
npm run bump:patch
```

This will update the version in the `version-control.json` and all other configuration files defined in the script, following the rules specified for each file type.

## License

This project is licensed under the MIT License. See the [LICENSE]([LICENSE](https://github.com/ferdylimmm9/bump-manipulator-native-springkraf/blob/main/LICENSE)) file for details.