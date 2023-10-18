import {type Pool, type RowDataPacket} from 'mysql2/promise';
import InvariantError from '../error/InvariantError';
import {type User} from './User';

export default class UserRepository {
	constructor(private readonly pool: Pool) {}

	public async isUsernameAvailable(username: string): Promise<void> {
		const [rows] = await this.pool.query(
			'SELECT id FROM `users` WHERE `username` = ?',
			[username],
		);

		if (rows) {
			throw new InvariantError('username not available');
		}
	}

	public async getUser(id: number): Promise<User> {
		let [rows] = await this.pool.query('SELECT * FROM `users` WHERE `id` = ?', [
			id,
		]);

		rows = rows as RowDataPacket[];

		return rows[0] as User;
	}
}
