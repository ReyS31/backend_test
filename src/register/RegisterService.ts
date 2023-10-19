import type PasswordHash from '../security/PasswordHash';
import type TokenManager from '../security/TokenManager';
import type User from '../user/User';
import type UserRepository from '../user/UserRepository';
import type Register from './Register';

export default class RegisterService {
	constructor(
		private readonly passwordHash: PasswordHash,
		private readonly tokenManager: TokenManager,
		private readonly userRepository: UserRepository,
	) {}

	public async registerUser(register: Register): Promise<User> {
		await this.userRepository.isUsernameAvailable(register.username);
		register.password = await this.passwordHash.hash(register.password);
		const userId = await this.userRepository.createUser(register);
		const user = await this.userRepository.getUser(userId);

		return user;
	}
}
