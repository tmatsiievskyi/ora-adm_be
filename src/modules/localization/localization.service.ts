import { BadRequest, NotFoundException } from '@common/exceptions';
import { TContainer } from '@common/types';
import { promises as fsp } from 'node:fs';
import { resolve } from 'node:path';
import { LocalizationRepo } from './localization.repo';
import { TFindAllLocalizationInput } from './localization.schema';

export class LocalizationService {
  private readonly localizationRepo: LocalizationRepo;

  constructor(private readonly container: TContainer) {
    this.localizationRepo = new LocalizationRepo();
  }

  public async synchronize() {
    const localFilesPaths = await this.container.fileService.readdirRecur(
      './dataFromClient/locales',
      '.json',
    );
    const lngsNames = localFilesPaths
      .map((item) => item.filePath.split('/').slice(-2, -1))
      .flat();

    if (!localFilesPaths.length) throw new NotFoundException();

    await this.localizationRepo.deleteMany({});

    const filesPromises: Promise<Buffer>[] = [];

    localFilesPaths.forEach((item) => {
      filesPromises.push(
        new Promise<Buffer>((res, rej) => {
          const file = fsp.readFile(process.cwd() + '/' + item.filePath);
          res(file);
        }),
      );
    });

    const parsedFile = (await Promise.all(filesPromises)).map(
      (item) => JSON.parse(item.toString()) as Record<string, string>,
    );

    const dbItems = parsedFile.map((item, i) => {
      return new Promise((res, rej) => {
        const data = Object.entries(item).map(([key, value]) => {
          return {
            key,
            value,
            lng: lngsNames[i],
          };
        });

        res(this.localizationRepo.createMany(data));
      });
    });

    await Promise.all(dbItems);
  }

  public async findAllJson(data: TFindAllLocalizationInput['query'] | null) {
    if (!data) throw new NotFoundException();
    const res = await this.localizationRepo.find(data);

    const obj = res.reduce(
      (acc, cur) => ({ ...acc, [cur.key]: cur.value }),
      {},
    );

    return obj;
  }
}
