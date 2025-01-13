import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Create a connection pool using environment variables
const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10), // Ensure the port is a number
});

export default pool;
