import { promises as fsp } from 'node:fs';
import { resolve } from 'node:path';

const localesPath = resolve(process.cwd() + '/../dataFromClient/locales');

const data = await fsp.readdir(localesPath, { withFileTypes: true });

const file = await fsp.readFile(localesPath + '/en-US' + '/common.json');

const dataFile = JSON.parse(file.toString());
