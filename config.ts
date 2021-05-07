import 'dotenv/config';
const dBType: any = process.env[`DB_TYPE`] || 'mysql';
export const configs = {
  port: parseInt(process.env[`PMS_SERVER_PORT`]) || 3334,
  database: {
    type: dBType,
    host: process.env[`DB_HOST`],
    port: parseInt(process.env[`DB_PORT`]) || 3306,
    username: process.env[`DB_USER`],
    password: process.env[`DB_PASS`],
    dbName: process.env[`DB_DBNAME`],
    sync : Boolean(process.env[`DB_SYNC`]),
},
  jwt_secret:process.env[`JWT_SECRET`],
  expires_in:process.env[`EXPIRESIN`],
  mail:{
    host: process.env[`HOST`],
    port: process.env[`MAILPORT`],
    secure: process.env[`SECURE`],
    user: process.env[`USER`],
    pass: process.env[`PASSWORD`],
  },
  host: {
    url: process.env[`SERVERURL`],
    port: process.env[`PORT`]
},
};

export default configs;
