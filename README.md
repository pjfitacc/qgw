# qgw

Creating an NPM package that provides a library to access the [Quantum Gateway Integration APIs](https://www.quantumgateway.com/developer.php).

Goal:

- Create wrapper libraries that allows developers to easily access Quantum Gateway Developer APIs.
- First one we're working on: Transparent QuantumGateway Database Engine (TransQgwDbE)

Supported APIs:

- [Transparent QGWdatabase Engine](https://www.quantumgateway.com/view_developer.php?Cat1=3)

Class Diagram:
https://app.diagrams.net/#G1n7yJmzmBu5BJtSGhA0Hnnzqs0xykFnUi#%7B%22pageId%22%3A%22C5RBs43oDa-KdzZeNtuy%22%7D

This package uses Typescript. This is the tutorial I followed to create it:
https://pauloe-me.medium.com/typescript-npm-package-publishing-a-beginners-guide-40b95908e69c

Resources referred to when designing the API:

- https://www.pretzellogix.net/2021/12/08/how-to-write-a-python3-sdk-library-module-for-a-json-rest-api/

Error Handling Tutorial:
https://www.youtube.com/watch?v=EUYnERcOGpA
(This API does not use node.js in any major way but we will mimic the way it creates custom errors.)

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

# Generating Typedoc Documents:

npx typedoc --out docs src
