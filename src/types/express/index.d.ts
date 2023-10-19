/* istanbul ignore next */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import express from 'express';

declare global {
	namespace Express {
		interface Request {
			userAgent?: string;
			auth?: Record<string, unknown>;
		}
	}
}
