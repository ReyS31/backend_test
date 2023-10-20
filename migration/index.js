/* istanbul ignore next */
require('dotenv').config();

const { readdirSync, readFileSync } = require('fs');
const mysql = require('mysql2/promise');

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

process.argv.forEach(async (val, index) => {
	if (index < 2) {
		return;
	}

	if (index === 2) {
		const promises = [pool.query('SET FOREIGN_KEY_CHECKS=0;')];
		if (val === 'up' || val === 'up-all') {
			const baseDir = `${__dirname}/up`;
			const dir = readdirSync(baseDir);
			const migrator = readFileSync(`${baseDir}/0_migrator.sql`).toString();
			await pool.query(migrator);
			const [last] = await pool.query(
				'SELECT filename FROM migrator ORDER BY migrated_at DESC LIMIT 1',
			);
			dir.shift();
			const number = last.length > 0 ? Number(last[0].filename.split('_')[0]) : 0;
			if (number !== 0 && dir[dir.length - 1] === last[0].filename) {
				console.log('NOTHING TO MIGRATE');
				process.exit();
			}

			for (let index = 0; index < dir.length; index++) {
				const currentFile = dir[index];
				const currentNumber = Number(currentFile.split('_')[0]);

				if (currentNumber <= number) {
					continue;
				}

				const sql = readFileSync(`${baseDir}/${currentFile}`).toString();
				promises.push(
					pool
						.query(sql)
						.then(
							pool.query('INSERT INTO migrator(id, filename) VALUES(?, ?)', [
								currentNumber,
								currentFile,
							]),
						),
				);
				console.log(`${currentFile} MIGRATED`);
				if (val === 'up') {
					break;
				}
			}
		}

		if (val === 'down' || val === 'down-all') {
			const baseDir = `${__dirname}/down`;
			const dir = readdirSync(baseDir).reverse();
			const [last] = await pool.query(
				'SELECT filename FROM migrator ORDER BY id DESC LIMIT 1',
			);

			if (!last.length) {
				console.log('NOTHING TO DROP');
				process.exit();
			}

			const number = Number(last[0].filename.split('_')[0]);

			for (let index = 0; index < dir.length; index++) {
				const currentFile = dir[index];
				const currentNumber = Number(currentFile.split('_')[0]);

				if (currentNumber > number) {
					continue;
				}

				const sql = readFileSync(`${baseDir}/${currentFile}`).toString();
				promises.push(
					pool
						.query(sql)
						.then(
							pool.query('DELETE FROM migrator WHERE filename = ?', [currentFile]),
						),
				);

				console.log(`${currentFile} DROPPED`);
				if (val === 'down') {
					break;
				}
			}
		}

		let proms = promises[0];
		for (let i = 0; i < promises.length; i++) {
			proms = proms.then(promises[i]);
		}

		setTimeout(() => process.exit(), 2000);
	}
});
