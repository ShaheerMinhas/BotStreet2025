import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = createPool({
    host: 'mysql-1d5d11f7-samrazafar003-b598.c.aivencloud.com',       // DB Host
    user: 'avnadmin',       // DB User
    password: 'AVNS_k6A1Odud193pXjnUnBf', // DB Password
    database: 'BotStreet',   // DB Name
    port: 15410,         // Replace with your DB port
});

export default pool;


 