import AuthenticationError from '../error/AuthenticationError';

/* eslint-disable @typescript-eslint/ban-types */
export default class PasswordHash {
	private readonly _bcrypt: Record<string, Function>;
	private readonly _saltRound: number;
	constructor(bcrypt: Record<string, Function>, saltRound = 10) {
		this._bcrypt = bcrypt;
		this._saltRound = saltRound;
	}

	async hash(password: string): Promise<string> {
		return this._bcrypt.hash(password, this._saltRound) as string;
	}

	async comparePassword(
		password: string,
		hashedPassword: string,
	): Promise<void> {
		const result = (await this._bcrypt.compare(
			password,
			hashedPassword,
		)) as boolean;

		if (!result) {
			throw new AuthenticationError('kredensial yang Anda masukkan salah');
		}
	}
}
