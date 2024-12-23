const mysql = require("mysql2/promise"); // Use the promise interface for async/await
require("dotenv").config();

const connection = async () => {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Connection to MySQL successfully established");
    return db; 
  } catch (err) {
    console.error("Failed to connect to MySQL:", err.message);
    throw err; 
  }
};

module.exports = connection;
