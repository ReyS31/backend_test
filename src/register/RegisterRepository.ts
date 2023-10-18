import {type ResultSetHeader, type Pool} from 'mysql2/promise';
import InvariantError from '../error/InvariantError';
import type Register from './Register';

export default class RegisterRepository {
	constructor(private readonly pool: Pool) {}

	/**
	 * RegisterUser
	 * Register user to database
	 */
	public async registerUser(register: Register): Promise<number> {
		let [rows] = await this.pool.query(
			`
            INSERT INTO users
            (first_name, last_name, date_of_birth, street_address, city, province, telephone, email, username, password, registered_at)
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
			[
				register.firstName,
				register.lastName,
				register.dateOfBirth,
				register.streetAddress,
				register.city,
				register.province,
				register.telephone,
				register.email,
				register.username,
				register.password,
				new Date().toUTCString(),
			],
		);

		rows = rows as ResultSetHeader;

		if (!rows.insertId) {
			throw new InvariantError('cant register user');
		}

		return rows.insertId;
	}
}
