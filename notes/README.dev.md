For Developers interested in the inner workings or modifying this package.

# Building this package:

`npm run build`

# Publishing a new version to github and npm

1. go to main branch
2. change version number in package.json and package-lock.json
3. git tag -a vMajor_Minor_Patch -m "message"
4. git push origin vMajor_Minor_Patch (same tag version as step above)
5. npm run build
6. npm publish

If using the qgw-test-consumer to try out new version features + fixes:

- npm update

# Deleting a version tag:

1. git push --delete origin vMajor_Minor_patch
2. git tag --delete vMajor_Minor_patch (same version as above)

# Generating Typedoc Documentation:

`npm run docs`

# Linting:

We're using typescript linting with the tsdoc plugin.
I followed this guide in this order:

### Configuration (Read first before [Execution](#execution)):

1. typescript-eslint https://typescript-eslint.io/getting-started
2. tsdoc plugin: https://tsdoc.org/pages/packages/eslint-plugin-tsdoc/
3. created a .eslintrc.js file with the exact settings in the tsdoc plugin:

```
module.exports = {
  plugins: ['@typescript-eslint/eslint-plugin', 'eslint-plugin-tsdoc'],
  extends: ['plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    'tsdoc/syntax': 'warn'
  }
};
```

4. typescript es-lint no longer supports .eslintrc.js and uses different configuration files:
5. So I had had to migrate and used the automatic migration tool: https://eslint.org/docs/latest/use/configure/migration-guide
6. automatic migration command: `npx  @eslint/migrate-config .eslintrc.json`
7. now the eslint config file is **eslint.config.mjs**
8. changed **eslint.config.mjs** languageOptions from 2018 to 2016,

### Execution

`npx eslint .`

### Resources:

Resources I used to design, build, and test the library.

**Setting up this Typescript Package**
This package uses Typescript. This is the tutorial I followed to create it:
https://pauloe-me.medium.com/typescript-npm-package-publishing-a-beginners-guide-40b95908e69c

**API Design**
https://www.pretzellogix.net/2021/12/08/how-to-write-a-python3-sdk-library-module-for-a-json-rest-api/

**Error Handling**
I followed this Error Handling Tutorial to create custom errors:
https://www.youtube.com/watch?v=EUYnERcOGpA
(This API does not use node.js in any major way but we will mimic the way it creates custom errors.)
