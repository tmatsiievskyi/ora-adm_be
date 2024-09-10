import { TCookieOptions } from '@common/types';

export class Cookie {
  public set(name: string, value: string, options?: TCookieOptions) {
    const cookieValue = encodeURIComponent(value);
    let newCookie = `${name}=${cookieValue}`;
    const cookieOptions: Record<string, any> = { ...options };

    if (cookieOptions?.Expires) {
      let d = new Date(
        new Date().getTime() + Number(cookieOptions.Expires) * 1000,
      ).toUTCString();
      cookieOptions['Expires'] = d;
    }

    for (const optionName in cookieOptions) {
      const optionValue = cookieOptions[optionName];

      if (optionName === 'HttpOnly' || optionName === 'Secure') {
        newCookie += '; ' + optionName;
        continue;
      }

      newCookie += '; ' + optionName + '=' + optionValue;
    }

    return newCookie;
  }

  public get(cookieString = '') {
    return cookieString
      .split(';')
      .map((pair) => {
        const indexOfEquals = pair.indexOf('=');
        let name;
        let value;
        if (indexOfEquals === -1) {
          name = '';
          value = pair.trim();
        } else {
          name = pair.substring(0, indexOfEquals).trim();
          value = pair.substring(indexOfEquals + 1).trim();
        }
        const firstQuote = value.indexOf('"');
        const lastQuote = value.lastIndexOf('"');
        if (firstQuote !== -1 && lastQuote !== -1) {
          value = value.substring(firstQuote + 1, lastQuote);
        }
        return { [name]: value };
      })
      .reduce((acc, cur) => {
        return {
          ...acc,
          [Object.keys(cur)[0]]: Object.values(cur)[0],
        };
      }, {});
  }

  public delete(name: string) {
    return this.set(name, '', { Expires: '-1' });
  }
}
