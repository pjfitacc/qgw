Transparent QuantumGateway Database Engine (TransQgwDbE) API

Description:

1. It provides a single POST-like endpoint where customers can submit transactions via their Database Engine.
2. The endpoint offers different options to describe transactions with an interface specified in the documentation here: https://www.quantumgateway.com/files/QGW-Non-Interactive_API.pdf
3. Some fields in the API have default values based on Login QuantumGateway settings or are explicitly defined based on the documentation.
4. Some fields in the API are required and others are optional.

Problems with the API:

1. Some fields are inaccurately documented.

   - Certain fields in the documentation are labelled "required" when they are, in fact, not.

2. Inconsistent casing for variable names.
3. The API's Response is not clear over what values it's returning.

- ex: Response is just a string like this: "APPROVED","019452","65735","Y","M","0.3".
- While they do provide the response format: Format: result,authcode,transID,AVRResponse,CVV Response,Max Score,decline_reason(if any),Error Code(if any), it's hard to parse.

These problems seem to be an interface one, so we will create a Wrapper Library around the original API.
The [wrapper](https://en.wikipedia.org/wiki/Wrapper_library) will refine the interface while still translating it to the expected API requirements.

API Wrapper Library Solutions:

1. Offer required fields that are accurate.
2. Offer stricter run time checking.
3. Consistent, typescript variable names for the interface using camelCasing.
4. More intuitive datatypes like numbers, booleans, etc. instead of all strings that the API uses.
5. Better Response Object instead of a string that a developer would have to parse.
