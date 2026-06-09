import type { ServerError } from './cartFetcher';

export class CartAPiServerError extends Error {
    declare code: string;

    constructor({ errorCode, errorMessage }: ServerError) {
        super(errorMessage);
        this.code = errorCode;
    }
}
