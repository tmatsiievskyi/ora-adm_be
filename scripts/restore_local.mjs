import { execSync } from 'node:child_process';

const params = process.argv.slice(2).join(' ');

const cmd = `mongorestore ${params} ${process.env.DB_URL}`;

// const cmd1 = `mongorestore  --uri=mongodb://taras:030922@ora-adm_db:27017/ORA ../dataFromClient/ORA`;

const cmd1 = `mongorestore --db=ORA dataFromClient/ORA --host mongo1:27017 --username ${process.env.MONGO_INITDB_ROOT_USERNAME} --password ${process.env.MONGO_INITDB_ROOT_PASSWORD}`;

execSync(cmd1);

// 948
// subCategory.dentist.consult
// subCategory.dentist.gigiena
// subCategory.dentist.whitening

//add
// Комплекс офісне + домашнє відбілювання

// update
// Медикаментозний сон ( до 2-х год.) -> change price
