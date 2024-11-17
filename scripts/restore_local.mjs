import { execSync } from 'node:child_process';

const params = process.argv.slice(2).join(' ');

const cmd = `mongorestore ${params} ${process.env.DB_URL}`;

const cmd1 = `mongorestore  --uri=mongodb://taras:030922@ora-adm_db:27017/ORA ../dataFromClient/ORA`;

execSync(cmd1);
