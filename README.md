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
