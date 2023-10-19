import * as userTableHelpers from '../../../../test_helper/usersTableHelper';
import User from '../../../domains/user/User';
import UserRepository from '../../../domains/user/UserRepository';
import pool from '../../../pool';
import PasswordHash from '../../../security/PasswordHash';
import TokenManager from '../../../security/TokenManager';
import {type Register} from '../AuthTypes';
import AuthService from '../AuthService';
import AuthRepository from '../../../domains/auth/AuthRepository';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';

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

		const passwordHash = new PasswordHash(bcrypt, 14);
		const tokenManager = new TokenManager(Jwt);

		const userRepository = new UserRepository(pool);
		const authRepository = new AuthRepository(pool);

		const registerService = new AuthService(
			passwordHash,
			tokenManager,
			userRepository,
			authRepository,
		);

		const response = await registerService.registerUser(payload, 'test');

		expect(response.user).toBeInstanceOf(User);
		expect(response.user.firstName).toBe(payload.firstName);
		expect(response.user.lastName).toBe(payload.lastName);
		expect(response.user.dateOfBirth).toBe(payload.dateOfBirth);
		expect(response.user.streetAddress).toBe(payload.streetAddress);
		expect(response.user.city).toBe(payload.city);
		expect(response.user.province).toBe(payload.province);
		expect(response.user.username).toBe(payload.username);
		expect(response.user.telephone).toBe(payload.telephone);
		expect(response.user.email).toBe(payload.email);
	});
});
