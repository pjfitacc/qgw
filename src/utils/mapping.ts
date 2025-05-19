/**
 * @internal
 */
export interface KeyMappable<T, K extends keyof T> {
  /**
   * Function that maps the instance's fields to a subset of T's fields
   */
  toPartial(): Pick<T, K>;
}

/**
 * Mappable interface with conditional return type
 * @internal
 */
export interface TwoStateMappable<
  T,
  StateA,
  StateB,
  SubsetA extends keyof T,
  SubsetB extends keyof T
> {
  /**
   * Gets the current state (must be either StateA or StateB)
   */
  getState(): StateA | StateB;

  /**
   * Returns a partial object with different fields based on current state
   */
  toPartial(): this extends { getState(): StateA }
    ? Pick<T, SubsetA>
    : Pick<T, SubsetB>;

  /**
   * Type guard for StateA
   */
  isStateA(): this is { getState(): StateA };

  /**
   * Type guard for StateB
   */
  isStateB(): this is { getState(): StateB };
}

/**
 * A flexible interface for objects that map to different subsets of fields based on their internal state.
 * enables an object to dynamically expose different subsets of properties (Pick\<T, Keys\>) depending on its internal state.
 *
 * This is useful when:
 * - A class needs to serialize/deserialize different fields based on runtime conditions.
 * - Different states require different subsets of data (e.g., "Admin mode" vs. "User mode").
 * - You want compile-time safety while keeping runtime flexibility.
 * @remarks
 * This does not work at the moment. Do not use.
 */
// interface StateDependentMappable<
//   T,
//   States extends { kind: string },
//   Subsets extends Record<string, keyof T>
// > {
//   /**
//    * Returns a subset of T's fields based on the current state.
//    */
//   toPartial(): Pick<T, Subsets[this["state"]["kind"]]>;

//   /**
//    * The current state object (must have a `kind` discriminator).
//    */
//   state: States;

//   /**
//    * Type guard to check if the current state matches a given kind.
//    * @param kind - The state kind to check (e.g., "A", "B", "Admin", "User").
//    * @returns `true` if the current state matches the kind.
//    */
//   isState<K extends States["kind"]>(
//     kind: K
//   ): this is { state: Extract<States, { kind: K }> };
// }
