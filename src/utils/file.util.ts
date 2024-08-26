import { promises as fsp } from 'node:fs';
import { join, basename } from 'node:path';

export class FileService {
  public async readdirRecur(
    dirPath: string,
    fileName: string,
  ): Promise<{ fileName: string; fullName: string; filePath: string }[]> {
    const data = await fsp.readdir(dirPath, { withFileTypes: true });

    const paths = (
      await Promise.all(
        data.flatMap(async (item) => {
          const itemPath = join(dirPath, item.name);

          if (item.isDirectory()) {
            return this.readdirRecur(itemPath, fileName);
          }

          if (item.isFile() && item.name.includes(fileName)) {
            return {
              fileName: basename(item.name, fileName),
              fullName: item.name,
              filePath: itemPath,
            };
          }
          return [];
        }),
      )
    ).flat();
    return paths;
  }
}
