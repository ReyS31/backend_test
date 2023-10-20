/* eslint-disable @typescript-eslint/naming-convention */
import {
	type ResultSetHeader,
	type Pool,
	type RowDataPacket,
} from 'mysql2/promise';
import Auth from './Auth';
import moment from 'moment';
import AuthorizationError from '../../error/AuthorizationError';

export default class AuthRepository {
	constructor(private readonly pool: Pool) {}

	async login(userId: number, userAgent: string, date: string): Promise<Auth> {
		let [result] = await this.pool.query(
			'INSERT INTO auth(user_id, user_agent, logged_in_at) VALUES(?, ?, ?)',
			[userId, userAgent, date],
		);

		result = result as ResultSetHeader;

		return new Auth({
			user_id: userId,
			id: result.insertId,
			is_expired: 0,
			logged_in_at: moment(date).toISOString(),
			user_agent: userAgent,
		});
	}

	async verifyAuth(data: {id: number; userId: number}): Promise<void> {
		let [res] = await this.pool.query(
			'SELECT is_expired FROM auth WHERE id = ? and user_id = ?',
			[data.id, data.userId],
		);

		res = res as RowDataPacket[];

		if (!res.length) {
			throw new AuthorizationError('auth not found');
		}

		if ((res[0].is_expired as number) === 1) {
			throw new AuthorizationError('auth expired');
		}
	}

	async expiresAllAuth(userId: number): Promise<void> {
		await this.pool.query('UPDATE auth SET is_expired = 1 WHERE user_id = ?', [
			userId,
		]);
	}
}
