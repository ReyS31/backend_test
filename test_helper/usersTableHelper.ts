/* istanbul ignore next */
import {type RowDataPacket} from 'mysql2';
import pool from '../src/pool';
import User from '../src/domains/user/User';
import {type Register} from '../src/services/auth/AuthTypes';

export async function createUser(
	user: Register = {
		firstName: 'test',
		lastName: 'test',
		city: 'test',
		dateOfBirth: '2001-01-03',
		streetAddress: 'Jl. Test',
		email: 'test@test.test',
		password: ' test',
		province: 'test',
		telephone: '+6281231892476',
		username: 'test',
	},
): Promise<void> {
	await pool.query(
		`
    INSERT INTO users
    (first_name, last_name, date_of_birth, street_address, city, province, telephone, email, username, password, registered_at)
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
		[
			user.firstName,
			user.lastName,
			user.dateOfBirth,
			user.streetAddress,
			user.city,
			user.province,
			user.telephone,
			user.email,
			user.username,
			user.password,
			new Date().toISOString(),
		],
	);
}

export async function getUsers(): Promise<User[]> {
	const [rows] = await pool.query('SELECT * from users');
	console.log(rows);

	return (rows as RowDataPacket[]).map((r) => new User(r));
}

export async function clearTable(): Promise<void> {
	await pool.query('TRUNCATE users');
}
