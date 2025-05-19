/**
 * Converts stringified JSON to an object.
 *
 * @param json - an object or string assumed to have a proper JSON format.
 * @returns The object version of a stringified JSON or the original JSON object if the param passed in was an object.
 */
export function parseJson(json: unknown): Exclude<unknown, string> {
  let parsed: unknown;

  if (typeof json === "string") {
    try {
      parsed = JSON.parse(json);
    } catch {
      throw new Error("Invalid JSON string.");
    }
  } else {
    parsed = json;
  }

  return parsed;
}
