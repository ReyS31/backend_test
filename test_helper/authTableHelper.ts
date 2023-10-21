/* istanbul ignore file */
import {type RowDataPacket} from 'mysql2';
import pool from '../src/pool';
import Auth from '../src/domains/auth/Auth';
import moment from 'moment';

export async function createAuth(
	auth = {
		userId: 1,
		userAgent: 'test',
		loggedInAt: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
		isExpired: false,
	},
): Promise<void> {
	await pool.query(
		`
    INSERT INTO auth
    (user_id, user_agent, logged_in_at, is_expired)
    VALUES
    (?, ?, ?, ?)
    `,
		[auth.userId, auth.userAgent, auth.loggedInAt, auth.isExpired],
	);
}

export async function getAuth(): Promise<Auth[]> {
	const [rows] = await pool.query('SELECT * from auth');

	return (rows as RowDataPacket[]).map((r) => new Auth(r));
}

export async function clearTable(): Promise<void> {
	await pool.query('TRUNCATE auth');
}
