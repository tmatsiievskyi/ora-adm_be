import { NotFoundException } from '@common/exceptions';
import { TParseReq, TRequest } from '@common/types';
import { parse } from 'node:url';

export class Common {
  public parseURL(url?: string, method?: string) {
    if (!url) return null;
    const href = url.split('?')[0];
    const [base, name, action] = href.substring(1).split('/');

    return {
      parseUrl: parse(url, true),
      name,
      action,
      method,
      href,
      url,
      methodWithHref: `${method}:${href}`,
    };
  }

  public async getReqBody<T>(req: TRequest) {
    const buffers = [];

    for await (const chunk of req) buffers.push(chunk);
    const data = Buffer.concat(buffers).toString();

    return data ? (JSON.parse(data) as T) : null;
  }

  public getReqQueryParams<T>(req: TRequest) {
    const paramsArr = req.url?.split('?')?.slice(1)[0]?.split('&');

    if (!paramsArr || !paramsArr.length) return null;

    const paramObj = paramsArr.reduce((acc, cur) => {
      const [key, value] = cur.split('=');
      return {
        ...acc,
        [key]: value,
      };
    }, {});

    return paramObj as T;
  }

  public async parseReq<TBody = void, TParams = void, TQuery = void>(
    req: TRequest,
    reqMask?: string,
  ) {
    const body = await this.getReqBody<TBody>(req);
    const parsedURL = this.parseURL(req.url, req.method);
    const reqParams = this.getReqParams<TParams>(req.url, reqMask);
    const queryParams = this.getReqQueryParams<TQuery>(req);

    return { url: parsedURL, reqParams, body, queryParams };
  }

  getReqParams<T>(url?: string, mask?: string) {
    if (!url || !mask) return null;

    let params: null | Record<string, string> = null;
    const href = url.split('?');

    const urlArr = url.split('/');
    const maskArr = mask.split('/');

    maskArr.forEach((item, index) => {
      if (item.startsWith(':')) {
        params = {
          ...params,
          [item.split(':')[1]]: urlArr[index],
        };
      }
    });
    return params as T;
  }

  public checkUrlToEnum(localUrl: string, reqUrl?: string) {
    console.log(localUrl, reqUrl);

    if (!localUrl.includes('/:') && localUrl === reqUrl) {
      return true;
    }

    if (localUrl.includes('/:')) {
      const [methodLoc, ...restLocal] = localUrl.split('/');
      const [methodReq, ...restFromReq] = reqUrl!.split('/');
      const resArr: string[] = [];

      if (restLocal.length !== restFromReq?.length) return false;

      if (methodLoc !== methodReq) return false;

      restLocal.forEach((item, index) => {
        if (item !== restFromReq[index] && !item.includes(':')) {
          return false;
        }

        item.includes(':')
          ? resArr.push(restFromReq[index])
          : resArr.push(item);
      });

      if (resArr.join('/') === restFromReq.join('/')) return true;
    }

    return false;
  }

  public removeFromObj(obj: Record<string, any>, toRemove: string[]) {
    const result = Object.fromEntries(
      Object.entries(obj).filter(([key]) => !toRemove.includes(key)),
    );
    return result;
  }

  public splitStringToArray(str: string, div: string) {
    const strArr = str.split(div);
    return {
      strArr,
      length: strArr.length,
    };
  }
}
