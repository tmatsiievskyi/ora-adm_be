import { TParseReq, TRequest } from '@common/types';

export class Common {
  public parseURL(url?: string, method?: string) {
    if (!url) return null;
    const href = url.split('?')[0];
    const [base, name, action] = href.substring(1).split('/');
    const query = new URLSearchParams(url);
    return {
      name,
      action,
      query,
      method,
      url,
      urlWithMethod: `${method}:${href}`,
    };
  }

  public async getReqBody<T>(req: TRequest) {
    const buffers = [];

    for await (const chunk of req) buffers.push(chunk);
    const data = Buffer.concat(buffers).toString();

    return data ? (JSON.parse(data) as T) : null;
  }

  public getReqParams(req: TRequest) {
    const paramsArr = req.url?.split('?')?.slice(1)[0]?.split('&');

    if (!paramsArr || !paramsArr.length) return null;

    const paramsObj = paramsArr.map((item) => {
      const [key, value] = item.split('=');
      return {
        [key]: value,
      };
    });

    return paramsObj;
  }

  public async parseReq<TBody = void>(req: TRequest) {
    const body = await this.getReqBody<TBody>(req);
    const parsedURL = this.parseURL(req.url, req.method);
    const params = this.getReqParams(req);

    return { parsedURL, body, params };
  }

  public removeFromObj(obj: Record<string, any>, toRemove: string[]) {
    const result = Object.fromEntries(
      Object.entries(obj).filter(([key]) => !toRemove.includes(key)),
    );
    return result;
  }
}
