/* istanbul ignore file */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Create the connection pool. The pool-specific settings are the defaults
const config = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	maxIdle: 10, // Max idle connections, the default value is the same as `connectionLimit`
	idleTimeout: 60000, // Idle connections timeout, in milliseconds, the default value 60000
	queueLimit: 0,
	enableKeepAlive: true,
	keepAliveInitialDelay: 0,
};

const testConfig = {
	host: process.env.DB_TEST_HOST,
	user: process.env.DB_TEST_USER,
	password: process.env.DB_TEST_PASSWORD,
	database: process.env.DB_TEST_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	maxIdle: 10, // Max idle connections, the default value is the same as `connectionLimit`
	idleTimeout: 60000, // Idle connections timeout, in milliseconds, the default value 60000
	queueLimit: 0,
	enableKeepAlive: true,
	keepAliveInitialDelay: 0,
};

const pool = mysql.createPool(
	process.env.NODE_ENV === 'test' ? testConfig : config,
);

export default pool;
