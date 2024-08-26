export class Common {
  public parseURL(url: string, method: string) {
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
}
