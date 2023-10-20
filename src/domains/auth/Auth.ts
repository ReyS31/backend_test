/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {type RowDataPacket} from 'mysql2';

export type AuthT = {
	id: number;
	user_id: number;
	user_agent: string;
	logged_in_at: string;
	is_expired: number;
};

export default class Auth {
	public readonly id: number;
	public readonly userId: number;
	public readonly userAgent: string;
	public readonly loggedInAt: string;
	public readonly isExpired: boolean;

	constructor(raw: AuthT | RowDataPacket) {
		this.id = raw.id;
		this.userId = raw.user_id;
		this.userAgent = raw.user_agent;
		this.loggedInAt = raw.logged_in_at;
		this.isExpired = raw.is_expired === 1;
	}
}
