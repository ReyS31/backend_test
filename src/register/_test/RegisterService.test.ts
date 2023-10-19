/* eslint-disable @typescript-eslint/ban-types */
import * as userTableHelpers from '../../../test_helper/usersTableHelper';
import pool from '../../pool';
import PasswordHash from '../../security/PasswordHash';
import TokenManager from '../../security/TokenManager';
import User from '../../user/User';
import UserRepository from '../../user/UserRepository';
import type Register from '../Register';
import RegisterService from '../RegisterService';
describe('RegisterRepository', () => {
	afterEach(async () => {
		await userTableHelpers.clearTable();
	});

	afterAll(async () => {
		await pool.end();
	});

	it('create users correctly', async () => {
		const payload: Register = {
			firstName: 'create',
			lastName: 'user',
			city: 'denpasar',
			province: 'bali',
			dateOfBirth: '2001-01-03',
			email: 'create@test.test',
			password: 'test',
			streetAddress: 'Jl. A. Yani',
			telephone: '+62812312314',
			username: 'test',
		};

		const mockBcrypt: Record<string, Function> = {};
		mockBcrypt.hash = jest
			.fn()
			.mockImplementation(async () => Promise.resolve('hashed'));
		mockBcrypt.compare = jest
			.fn()
			.mockImplementation(async () => Promise.resolve());

		const mockJwt: Record<string, Function> = {};

		const passwordHash = new PasswordHash(mockBcrypt, 14);
		const tokenManager = new TokenManager(mockJwt);

		const userRepository = new UserRepository(pool);
		const registerService = new RegisterService(
			passwordHash,
			tokenManager,
			userRepository,
		);

		const user = await registerService.registerUser(payload);

		expect(user).toBeInstanceOf(User);
		expect(user.firstName).toBe(payload.firstName);
		expect(user.lastName).toBe(payload.lastName);
		expect(user.dateOfBirth).toBe(payload.dateOfBirth);
		expect(user.streetAddress).toBe(payload.streetAddress);
		expect(user.city).toBe(payload.city);
		expect(user.province).toBe(payload.province);
		expect(user.username).toBe(payload.username);
		expect(user.telephone).toBe(payload.telephone);
		expect(user.email).toBe(payload.email);
	});
});
