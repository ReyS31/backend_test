/* istanbul ignore file */
import moment from 'moment';
import validator from 'validator';
import {z} from 'zod';
import type User from '../../domains/user/User';

export type Register = {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	streetAddress: string;
	city: string;
	province: string;
	telephone: string;
	email: string;
	username: string;
	password: string;
};

export type Login = {
	credential: string;
	password: string;
};

export type AuthResponse = {
	user: User;
	token: Record<string, string>;
};

export function verifyRegisterPayload(register: unknown): Register {
	const registerPayloadValidator = z
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
			dateOfBirth: z.coerce
				.date()
				.transform((val) => moment(val).format('YYYY-MM-DD')),
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

	return registerPayloadValidator.parse(register);
}

export function verifyLoginPayload(login: unknown): Login {
	const loginPayloadValidator = z
		.object({
			credential: z.string(),
			password: z.string(),
		})
		.required();

	return loginPayloadValidator.parse(login);
}

export type AuthCredential = {id: number; userId: number};
