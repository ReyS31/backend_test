import moment from 'moment';
import type AuthRepository from '../../domains/auth/AuthRepository';
import type UserRepository from '../../domains/user/UserRepository';
import type PasswordHash from '../../security/PasswordHash';
import type TokenManager from '../../security/TokenManager';
import {type Register, type AuthResponse, type Login} from './AuthTypes';

export type AuthServiceT = {
	registerUser(register: Register, userAgent: string): Promise<AuthResponse>;
	loginUser(login: Login, userAgent: string): Promise<AuthResponse>;
};

export default class AuthService implements AuthServiceT {
	constructor(
		private readonly passwordHash: PasswordHash,
		private readonly tokenManager: TokenManager,
		private readonly userRepository: UserRepository,
		private readonly authRepository: AuthRepository,
	) {}

	public async registerUser(
		register: Register,
		userAgent: string,
	): Promise<AuthResponse> {
		const date = moment().utc().format('YYYY-MM-DD HH:mm:ss');
		await this.userRepository.isUsernameAvailable(register.username);
		register.password = await this.passwordHash.hash(register.password);
		const userId = await this.userRepository.createUser(register, date);
		const user = await this.userRepository.getUser(userId);
		const auth = await this.authRepository.login(userId, userAgent, date);

		const accessToken = await this.tokenManager.createAccessToken({
			id: auth.id,
			userId: auth.userId,
		});

		const refreshToken = await this.tokenManager.createRefreshToken({
			id: auth.id,
			userId: auth.userId,
		});

		return {
			user,
			token: {
				accessToken,
				refreshToken,
			},
		};
	}

	public async loginUser(
		login: Login,
		userAgent: string,
	): Promise<AuthResponse> {
		const date = moment().utc().format('YYYY-MM-DD HH:mm:ss');
		const userIdPass = await this.userRepository.getPassword(login.credential);
		const userId = userIdPass.id as number;
		try {
			await this.passwordHash.comparePassword(
				login.password,
				userIdPass.password as string,
			);
			const user = await this.userRepository.getUser(userId);
			await this.authRepository.expiresAllAuth(userId);
			const auth = await this.authRepository.login(userId, userAgent, date);

			const [accessToken, refreshToken] = await Promise.all([
				this.tokenManager.createAccessToken({
					id: auth.id,
					userId: auth.userId,
				}),
				this.tokenManager.createRefreshToken({
					id: auth.id,
					userId: auth.userId,
				}),
			]);

			return {
				user,
				token: {
					accessToken,
					refreshToken,
				},
			};
		} catch (error) {
			await this.authRepository.loginError(userId, userAgent, date);
			throw error;
		}
	}
}
