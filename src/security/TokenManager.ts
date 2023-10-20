import AuthenticationError from '../error/AuthenticationError';
import {type AuthCredential} from '../services/auth/AuthTypes';

/* eslint-disable @typescript-eslint/ban-types */
export default class TokenManager {
	private readonly _jwt: Record<string, Function>;
	constructor(jwt: Record<string, Function>) {
		this._jwt = jwt;
	}

	async createAccessToken(payload: Record<string, unknown>): Promise<string> {
		return this._jwt.sign(payload, process.env.ACCESS_TOKEN_KEY) as string;
	}

	async createRefreshToken(payload: Record<string, unknown>): Promise<string> {
		return this._jwt.sign(payload, process.env.REFRESH_TOKEN_KEY) as string;
	}

	async verifyRefreshToken(token: string): Promise<void> {
		try {
			this._jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
		} catch (error) {
			throw new AuthenticationError('invalid refresh token');
		}
	}

	async decodePayload(token: string): Promise<AuthCredential> {
		return this._jwt.decode(token) as AuthCredential;
	}
}
