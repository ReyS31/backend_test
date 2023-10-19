import { type NextFunction, type Request, type Response } from 'express';
import type TokenManager from '../security/TokenManager';
import AuthorizationError from '../error/AuthorizationError';

export default function auth(tokenManager: TokenManager) {
	return async function (request: Request, _: Response, next: NextFunction) {
		try {
			const token = request.headers.authorization?.split('Bearer')[1];
			if (token === undefined) {
				throw new AuthorizationError('invalid token');
			}

			request.auth = await tokenManager.decodePayload(token);
			console.log(request.userAgent);
			next();
		} catch (error) {
			next(error);
		}
	};
}
