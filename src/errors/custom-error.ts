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
/**
 * ### Description
 * The options for the {@link CustomError} class.
 *
 */
interface ErrorOptions<C extends string> {
  /**
   *  a human readable display for what error our library caught.
   */
  message: string;

  /**
   * specific information regarding the error that occurred.
   */
  issues: CustomIssue[];

  /**
   * the custom error code.
   */
  code?: C;
}

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
   * @param options - The {@link ErrorOptions} object containing the error message, issues, and code.
   */
  constructor({ message, issues, code }: ErrorOptions<C>) {
    super();
    this.message = message;
    this.code = code;
    this.issues = issues;
  }
}

export { CustomError };
