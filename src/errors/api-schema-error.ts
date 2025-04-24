import { ZodError } from "zod";

class ApiSchemaError extends ZodError<SchemaErrorCode> {}

export default ApiSchemaError;
