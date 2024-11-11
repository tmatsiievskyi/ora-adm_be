import { TApiResponse } from '@common/types';

export class Formatter {
  public formatResp<T>(
    result: any,
    time: number,
    message?: string,
    respTotal?: number,
  ) {
    let numRecords = 0;
    let errors: string[] | null = null;
    let data = null;
    let total = 0;

    if (result && result instanceof Array) {
      numRecords = result.length;
      data = result;
    } else if (
      result &&
      typeof result === 'object' &&
      !(result instanceof Error)
    ) {
      data = result.items ?? result;
      total = respTotal
        ? respTotal
        : Array.isArray(result?.metadata)
          ? result.metadata[0].totalCount
          : 1;
      numRecords = result.items?.length ?? 1;
    } else if (result && result instanceof Error) {
      errors = [this.errorStringify(result)];
    } else if (result || result === 0) {
      numRecords = 1;
      data = result;
    }

    const resp: TApiResponse<T> = {
      data,
      errors,
      message: message ? message : null,
      meta: {
        length: numRecords,
        took: time,
        total: total ? total : numRecords,
      },
    };

    return JSON.stringify(resp);
  }

  public errorHandler(value: unknown): Error {
    if (value instanceof Error) return value;

    let stringified = '[Unable to stringify the thrown value]';
    try {
      stringified = JSON.stringify(value);
    } catch {}

    const error = new Error(`Error value: ${stringified}`);
    return error;
  }

  public errorStringify(error: Error): string {
    return JSON.stringify(
      Object.assign({}, error, {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }),
    );
  }
}
