const mysql = require("mysql2/promise");
require("dotenv").config();

const connectionUrl = process.env.DATABASE_URL 
console.log("Using DB URL:", connectionUrl);

const url = new URL(connectionUrl);
const DB_NAME = process.env.DB_NAME || "schooldataset";

const baseConfig = {
  host: url.hostname,
  user: url.username,
  password: url.password,
  port: url.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to DB:", connection.config.database);
    connection.release();
    return true;
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    return false;
  }
};

const initializeDatabase = async () => {
  try {
   
    const tempPool = mysql.createPool(baseConfig);
    await tempPool.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await tempPool.end();

    console.log("✅ Database ready:", DB_NAME);

    
    pool = mysql.createPool({ ...baseConfig, database: DB_NAME });

    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(500) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        contact VARCHAR(15) NOT NULL,
        email_id VARCHAR(255) NOT NULL UNIQUE,
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Schools table ready");
  } catch (err) {
    console.error("❌ Database initialization failed:", err.message);
    throw err;
  }
};

module.exports = {
  initializeDatabase,
  testConnection,
  getPool: () => pool,
};
