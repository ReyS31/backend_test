import validator from 'validator';
import express, {
	type NextFunction,
	type Request,
	type Response,
	type Router,
} from 'express';
import {z} from 'zod';

class RegisterController {
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
			dateOfBirth: z.coerce.date(),
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

	public route(): Router {
		// eslint-disable-next-line new-cap
		const app = express.Router();
		app.post('/register', (req: Request, res: Response, next: NextFunction) => {
			this.register(req, res, next);
		});

		return app;
	}

	private register(request: Request, response: Response, next: NextFunction) {
		try {
			const payload = this.registerPayload.parse(request.body);
			response.send({
				status: 'success',
				message: 'OK',
				payload,
			});
		} catch (error) {
			next(error);
		}
	}
}

export default RegisterController;
