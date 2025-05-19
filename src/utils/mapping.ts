export interface Mappable<T, K extends keyof T> {
  /**
   * Function that maps the instance's fields to a subset of T's fields
   */
  toPartial(): Pick<T, K>;
}
