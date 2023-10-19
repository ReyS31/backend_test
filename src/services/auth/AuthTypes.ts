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
