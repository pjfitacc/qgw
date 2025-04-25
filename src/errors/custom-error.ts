/*
CustomIssue Interface (copies: https://zod.dev/ERROR_HANDLING?id=zodissue):

code

path?

message
*/
interface CustomIssue {
  code: any;
  path?: (string | number)[];
  message: string;
}

/*
message - a human readable display for what error our library caught.

error code - the custom error. can be ERR_PARSE which is a library error or ERR_SERVER_RESPONSE which is an error from outside the library coming from Transparent Quantum Gateway.

Issues = an Array of class CustomIssue related to the overall message + error code.
*/
class CustomError<C extends string> extends Error {
  message: string;
  issues: CustomIssue[];
  code?: C;

  constructor({
    message,
    issues,
    code,
  }: {
    message: string;
    issues: CustomIssue[];
    code?: C;
  }) {
    super();
    this.message = message;
    this.code = code;
    this.issues = issues;
  }
}

export default CustomError;
