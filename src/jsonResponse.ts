/** Maps the given type to its JSON counterpart.
 *
 * Example:
 *
 * ```typescript
 * ToJson<{
 *     id: number;
 *     date: LocalDate;
 *     income: Decimal;
 * }>
 * ```
 *
 * results in the following type
 *
 * ```typescript
 * {
 *     id: number;
 *     date: string;
 *     income: string;
 * }
 * ```
 * */
export type JsonCounterpart<T> = T extends { toJSON(): infer J }
    ? J
    : T extends boolean | number | string | null
    ? T
    : T extends Array<any>
    ? Array<JsonCounterpart<T>>
    : T extends Record<string, any>
    ? {
          [P in keyof T]: JsonCounterpart<T[P]>;
      }
    : never;
