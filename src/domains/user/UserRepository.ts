import {
	type ResultSetHeader,
	type Pool,
	type RowDataPacket,
} from 'mysql2/promise';
import User, {type UserT} from './User';
import InvariantError from '../../error/InvariantError';
import NotFoundError from '../../error/NotFoundError';
import AuthenticationError from '../../error/AuthenticationError';
import {type Register} from '../../services/auth/AuthTypes';

export default class UserRepository {
	constructor(private readonly pool: Pool) {}

	public async isUsernameAvailable(username: string): Promise<void> {
		const [rows] = await this.pool.query(
			'SELECT id FROM `users` WHERE `username` = ?',
			[username],
		);

		if ((rows as unknown[]).length) {
			throw new InvariantError('username not available');
		}
	}

	public async getUser(id: number): Promise<User> {
		let [rows] = await this.pool.query('SELECT * FROM `users` WHERE `id` = ?', [
			id,
		]);

		rows = rows as RowDataPacket[];

		if (!rows.length) {
			throw new NotFoundError('user not found');
		}

		return new User(rows[0] as UserT);
	}

	public async createUser(data: Register, date: string): Promise<number> {
		try {
			let [row] = await this.pool.query(
				`
				INSERT INTO users
				(first_name, last_name, date_of_birth, street_address, city, province, telephone, email, username, password, registered_at)
				VALUES
				(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
				[
					data.firstName,
					data.lastName,
					data.dateOfBirth,
					data.streetAddress,
					data.city,
					data.province,
					data.telephone,
					data.email,
					data.username,
					data.password,
					date,
				],
			);
			row = row as ResultSetHeader;

			if (!row.insertId) {
				throw new InvariantError('cant register user');
			}

			return row.insertId;
		} catch (error) {
			if (error instanceof Error && error.message.includes('username')) {
				throw new InvariantError('username is not available');
			}

			throw error;
		}
	}

	public async getPassword(creds: string): Promise<Record<string, unknown>> {
		let [rows] = await this.pool.query(
			'SELECT id, password FROM users where username = ? OR email = ?',
			[creds, creds],
		);

		rows = rows as RowDataPacket[];

		if (!rows.length) {
			throw new AuthenticationError('invalid credentials');
		}

		return rows[0] as Record<string, unknown>;
	}
}
