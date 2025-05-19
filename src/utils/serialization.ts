import { ClassConstructor, plainToInstance } from "class-transformer";

/**
 * class-transformer's plainToInstance function but it never returns an
 * array of that instance.
 *
 * @param c - The Class that you want to transform the JSON to
 * @returns
 */
export function plainToNonArrayInstance<I>(
  c: ClassConstructor<I>,
  json: unknown
): I {
  const instance = plainToInstance(c, json);
  if (Array.isArray(instance)) {
    throw new Error("fromJSON expected a single object, but got an array");
  }
  return instance;
}
