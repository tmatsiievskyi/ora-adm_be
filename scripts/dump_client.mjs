import { promises } from 'node:fs';
import { execSync } from 'node:child_process';

const FOLDER_NAME = 'dataFromClient';

const folderExistsFn = async (path) =>
  !!(await promises.stat(path).catch((e) => false));

const folderExists = await folderExistsFn(`../${FOLDER_NAME}`);

if (!folderExists) {
  promises.mkdir(`${process.cwd()}/${FOLDER_NAME}`, { recursive: true });
}

const cmd = `mongodump ${process.env.ORA_CLIENT_DB_URL} --out=./${FOLDER_NAME}/`;

const options = {
  encoding: 'utf8',
};

execSync(cmd, options);
