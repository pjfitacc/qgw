/**
 * ### Description
 *  In depth information about the general error that occurred.
 *
 * @remarks
 * inspired by ZodIssue https://zod.dev/ERROR_HANDLING?id=zodissue
 */
export interface CustomIssue {
  code: string;
  path?: (string | number)[];
  message: string;
}

/*

*/
/**
 * ### Description
 *  The base error class for this library.
 *
 * @remarks
 * Inspired by ZodError: https://zod.dev/ERROR_HANDLING?id=zoderror
 */
class CustomError<C extends string> extends Error {
  message: string;
  issues: CustomIssue[];
  code?: C;

  /**
   * @param options - The options for the error
   * @param options.message - a human readable display for what error our library caught.
   * @param options.issues - specific information regarding the error that occurred.
   * @param options.code - the custom error code.
   */
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
