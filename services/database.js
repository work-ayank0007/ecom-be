const { Pool } = require('pg');
const fs =require('fs')
require('dotenv').config();
const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl:{
        rejectUnauthorized: true,  // Ensure SSL verification is on
        ca: fs.readFileSync('ca.pem').toString()  // Path to the CA certificate
    },
    max: 20,
    connectionTimeoutMillis: 0,
    idleTimeoutMillis: 0
});

const dbconnect = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS "user" (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                pass VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user'
            );
            
            CREATE TABLE IF NOT EXISTS cart (
                id SERIAL PRIMARY KEY,
                price DECIMAL(10, 2) NOT NULL,
                description TEXT,
                img VARCHAR(255),
                title VARCHAR(255) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                cart_id INT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES "user"(id),
                FOREIGN KEY (cart_id) REFERENCES cart(id)
            );
        `);

        console.log("Tables created successfully.");
    } catch (err) {
        console.error(err.message);
        console.log("Error occurred while creating tables.");
        process.exit(1);
    }
};

module.exports = { pool, dbconnect };
