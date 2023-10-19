import validator from 'validator';
import express, {
	type NextFunction,
	type Request,
	type Response,
	type Router,
} from 'express';
import {z} from 'zod';
import type AuthService from './AuthService';
import {type Login, type Register} from './AuthTypes';

class AuthController {
	private readonly registerPayload = z
		.object({
			firstName: z
				.string()
				.min(2)
				.max(20)
				.refine((val) => validator.isAlpha(val)),
			lastName: z
				.string()
				.min(2)
				.max(20)
				.refine((val) => validator.isAlpha(val)),
			dateOfBirth: z.coerce.date().transform((val) => val.toUTCString()),
			streetAddress: z
				.string()
				.min(5)
				.max(40)
				.refine((val) => {
					const clean = val
						.toString()
						.replace(/ /gi, '')
						.replace(/,/gi, '')
						.replace(/\./gi, '');
					return validator.isAlphanumeric(clean);
				}),
			city: z
				.string()
				.min(2)
				.max(20)
				.refine((val) => validator.isAlpha(val)),
			province: z.string(),
			telephone: z.string().refine((val) => validator.isMobilePhone(val)),
			email: z.string().email(),
			username: z.string(),
			password: z.string(),
		})
		.required();

	private readonly loginPayload = z
		.object({
			credential: z.string(),
			password: z.string(),
		})
		.required();

	constructor(private readonly registerService: AuthService) {}

	public route(): Router {
		// eslint-disable-next-line new-cap
		const app = express.Router();
		app.post(
			'/register',
			async (req: Request, res: Response, next: NextFunction) => {
				await this.register(req, res, next);
			},
		);

		app.post(
			'/login',
			async (req: Request, res: Response, next: NextFunction) => {
				await this.login(req, res, next);
			},
		);
		return app;
	}

	private async register(
		request: Request,
		response: Response,
		next: NextFunction,
	) {
		try {
			const payload = this.registerPayload.parse(request.body);

			const data = await this.registerService.registerUser(
				payload as Register,
				request.userAgent ?? 'unknown browser',
			);

			return response.status(201).send({
				status: 'success',
				data,
			});
		} catch (error) {
			next(error);
		}
	}

	private async login(request: Request, response: Response, next: NextFunction) {
		try {
			const payload = this.loginPayload.parse(request.body);

			const data = await this.registerService.loginUser(
				payload as Login,
				request.userAgent ?? 'unknown browser',
			);

			return response.send({
				status: 'success',
				data,
			});
		} catch (error) {
			next(error);
		}
	}
}

export default AuthController;
