import {
  HASH_ENCODING,
  HASH_KEY_LENGTH,
  SALT_DEVIDER,
  SALT_LENGTH,
} from '@common/contstants';
import { randomBytes, timingSafeEqual, scrypt, randomUUID } from 'crypto';

export class Crypting {
  public generateUuid() {
    return randomUUID();
  }

  public hashPassword(password: string): Promise<string> {
    return new Promise((res, rej) => {
      if (!password) rej(null);

      const salt = randomBytes(SALT_LENGTH);

      scrypt(password, salt, HASH_KEY_LENGTH, (err, derivedKey) => {
        if (err) rej(err);

        res(this.serializeHash(derivedKey, salt));
      });
    });
  }

  public serializeHash(hash: Buffer, salt: Buffer) {
    const saltString = salt.toString(HASH_ENCODING).split('=')[0];
    const hashString = hash.toString(HASH_ENCODING).split('=')[0];

    return `${saltString}${SALT_DEVIDER}${hashString}`;
  }

  public deserializeHash(hashedString: string) {
    const [salt, hash] = hashedString.split(SALT_DEVIDER);
    if (!salt || !hash) {
      throw new Error(`String: \n ${hashedString} can not be deserialized`);
    }

    const saltBuf = Buffer.from(salt, HASH_ENCODING);
    const hashBuf = Buffer.from(hash, HASH_ENCODING);

    return { salt, hash, saltBuf, hashBuf };
  }

  public async comparePasswords(
    hashedPassword?: string | null,
    password?: string,
  ): Promise<boolean> {
    return new Promise((res) => {
      if (!hashedPassword || !password) {
        return res(false);
      }

      const { saltBuf, hashBuf } = this.deserializeHash(hashedPassword);

      scrypt(password, saltBuf, HASH_KEY_LENGTH, (err, derivedKey) => {
        if (err || hashBuf.length !== derivedKey.length) {
          return res(false);
        }

        return res(timingSafeEqual(hashBuf, derivedKey));
      });
    });
  }
}
