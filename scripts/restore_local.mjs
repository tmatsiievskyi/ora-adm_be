import { execSync } from 'node:child_process';

const params = process.argv.slice(2).join(' ');

const cmd = `mongorestore ${params} ${process.env.DB_URL}`;

execSync(cmd);
