/* istanbul ignore file */
import express from 'express';
import {type AuthCredential} from '../../services/auth/AuthTypes';

declare global {
	namespace Express {
		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
		interface Request {
			userAgent?: string;
			auth?: AuthCredential;
		}
	}
}
