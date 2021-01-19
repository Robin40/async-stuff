import { coerce, instance, string, Struct } from 'superstruct';
import { Decimal } from 'decimal.js';
import { LocalDate } from 'js-joda';

/** The subset of HTTP methods used for CRUD operations. */
export type CrudMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';

/** A SuperStruct custom type that coerces a string into a `Decimal` from `decimal.js`. */
export const decimal = () =>
    coerce(instance(Decimal), string(), s => new Decimal(s));

/** A SuperStruct custom type that coerces a string into a `LocalDate` from `js-joda`. */
export const localDate = (): Struct<LocalDate, null> /* [2] */ =>
    coerce(instance(LocalDate as any /* [1] */), string(), s =>
        LocalDate.parse(s)
    );
/* [1]: LocalDate constructor is private so we have to do this.
 * [2]: LocalDate was casted to any in [1] so we tell TypeScript the correct type. */

/** Possible id types for REST resources. */
export type PossibleId = number | string;
