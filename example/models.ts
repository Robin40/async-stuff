import {
    array,
    boolean,
    enums,
    integer,
    lazy,
    nullable,
    object,
    optional,
    string,
    union,
} from 'superstruct';
import { decimal, localDate } from '../src/types';

export const models = {
    LoginResponse: () =>
        object({
            token: string(),
            id: integer(),
        }),

    Divisa: () => enums(['pesos', 'dolares', 'uf']),

    Morosidad: () =>
        object({
            monto: decimal(),
            divisa: lazy(models.Divisa),
            pagado: boolean(),
            id: integer(),
        }),

    VoucherPagination: () =>
        object({
            count: integer(),
            next: optional(nullable(string())),
            previous: optional(nullable(string())),
            results: array(lazy(models.Voucher)),
        }),

    Voucher: () =>
        object({
            id: integer(),
            fecha: localDate(),
            state: lazy(models.VoucherState),
            total: integer(),
            user: lazy(models.User),
            partes: array(lazy(models.VoucherPart)),
        }),

    VoucherPart: () =>
        object({
            id: integer(),
            partition_part: lazy(models.PartitionPart),
            state: lazy(models.VoucherPartState),
            pago_data: union([
                object({
                    filial: optional(lazy(models.Filial)),
                }),
                object({
                    cuenta: optional(lazy(models.Cuenta)),
                    direccion: optional(lazy(models.Direccion)),
                }),
            ]),
            factura: object({
                uri: optional(nullable(string())),
                state: optional(lazy(models.FacturaState)),
                waiting_facturation: optional(boolean()),
            }),
        }),

    Filial: () =>
        object({
            id: integer(),
            nombre: string(),
            matriz_id: integer(),
            rut: string(),
        }),

    Cuenta: () =>
        object({
            id: integer(),
            banco: string(),
            tipo: string(),
            rut: string(),
        }),

    Direccion: () =>
        object({
            id: integer(),
            nombre: string(),
            direccion: string(),
        }),

    FacturaState: () => enums(['No Confirmada', 'Confirmada', 'Emitida']),

    PartitionPart: () =>
        object({
            id: integer(),
            total: integer(),
            items: array(lazy(models.PartitionPartItem)),
        }),

    VoucherPartState: () =>
        enums([
            'Pendiente/Facturación Requerida',
            'Pagado/Facturación Requerida',
            'Pendiente',
            'Pagado',
            'Anulado',
        ]),

    VoucherState: () =>
        enums([
            'Pendiente/Facturación Requerida',
            'Pagado/Facturación Requerida',
            'Pendiente',
            'Pagado',
            'Anulado',
        ]),

    PartitionPartItem: () =>
        object({
            id: integer(),
            monto: integer(),
            data: string(),
        }),

    User: () =>
        object({
            id: integer(),
            rut: string(),
            nombre: string(),
            facturacion_anticipada: boolean(),
        }),
};
