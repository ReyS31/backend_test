import {type NextFunction, type Request, type Response} from 'express';
import type TokenManager from '../security/TokenManager';
import AuthorizationError from '../error/AuthorizationError';
import {type AuthCredential} from '../services/auth/AuthTypes';
import type AuthRepository from '../domains/auth/AuthRepository';

export type AuthVerifyer = {
	verifyAuth(authCredential: AuthCredential): Promise<void>;
};

export type TokenDecoder = {
	decodePayload(token: string): Promise<AuthCredential>;
};

export default function auth(
	tokenDecoder: TokenDecoder | TokenManager,
	authVerifyer: AuthVerifyer | AuthRepository,
) {
	return async function (request: Request, _: Response, next: NextFunction) {
		try {
			const token = request.headers.authorization?.split('Bearer')[1].trim();

			if (!token) {
				throw new AuthorizationError('invalid token');
			}

			const auth = await tokenDecoder.decodePayload(token);
			await authVerifyer.verifyAuth(auth);
			request.auth = auth;

			next();
		} catch (error) {
			next(error);
		}
	};
}
