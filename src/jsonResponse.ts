import { LocalDate } from 'js-joda';
import { Decimal } from 'decimal.js';

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
export type JsonCounterpart<T> =
// dates are passed as strings in JSON
    T extends LocalDate ? string
        // decimals are also passed as strings
        : T extends Decimal ? string
        // objects are mapped recursively to JSON
        : T extends object ? { [P in keyof T]: JsonCounterpart<T[P]> }
            // in other case, assume `T` is valid JSON
            : T;
