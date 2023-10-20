import * as userTableHelpers from '../../../../test_helper/usersTableHelper';
import User from '../../../domains/user/User';
import UserRepository from '../../../domains/user/UserRepository';
import pool from '../../../pool';
import PasswordHash from '../../../security/PasswordHash';
import TokenManager from '../../../security/TokenManager';
import { Login, type Register } from '../AuthTypes';
import AuthService from '../AuthService';
import AuthRepository from '../../../domains/auth/AuthRepository';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import AuthenticationError from '../../../error/AuthenticationError';

describe('AuthService', () => {
	const registerPayload: Register = {
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

	beforeAll(async () => {
		await pool.query('SET FOREIGN_KEY_CHECKS = 0');
		await userTableHelpers.clearTable();
	});

	afterAll(async () => {
		await userTableHelpers.clearTable();
		await pool.query('SET FOREIGN_KEY_CHECKS = 1');
		await pool.end();
	});

	it('create users correctly', async () => {
		const response = await registerService.registerUser(registerPayload, 'test');

		expect(response.user).toBeInstanceOf(User);
		expect(response.user.firstName).toBe(registerPayload.firstName);
		expect(response.user.lastName).toBe(registerPayload.lastName);
		expect(response.user.dateOfBirth).toBe(registerPayload.dateOfBirth);
		expect(response.user.streetAddress).toBe(registerPayload.streetAddress);
		expect(response.user.city).toBe(registerPayload.city);
		expect(response.user.province).toBe(registerPayload.province);
		expect(response.user.username).toBe(registerPayload.username);
		expect(response.user.telephone).toBe(registerPayload.telephone);
		expect(response.user.email).toBe(registerPayload.email);
		expect(response.token).toHaveProperty('accessToken');
		expect(response.token).toHaveProperty('refreshToken');
	});

	describe('login', () => {
		it('login with email success', async () => {
			const payload: Login = {
				credential: 'create@test.test',
				password: 'test',
			};

			const response = await registerService.loginUser(payload, 'test');
			expect(response.user).toBeInstanceOf(User);
			expect(response.user.firstName).toBe(registerPayload.firstName);
			expect(response.user.lastName).toBe(registerPayload.lastName);
			expect(response.user.dateOfBirth).toBe(registerPayload.dateOfBirth);
			expect(response.user.streetAddress).toBe(registerPayload.streetAddress);
			expect(response.user.city).toBe(registerPayload.city);
			expect(response.user.province).toBe(registerPayload.province);
			expect(response.user.username).toBe(registerPayload.username);
			expect(response.user.telephone).toBe(registerPayload.telephone);
			expect(response.user.email).toBe(registerPayload.email);
			expect(response.token).toHaveProperty('accessToken');
			expect(response.token).toHaveProperty('refreshToken');
		});

		it('login with username success', async () => {
			const payload: Login = {
				credential: 'test',
				password: 'test',
			};

			const response = await registerService.loginUser(payload, 'test');
			expect(response.user).toBeInstanceOf(User);
			expect(response.user.firstName).toBe(registerPayload.firstName);
			expect(response.user.lastName).toBe(registerPayload.lastName);
			expect(response.user.dateOfBirth).toBe(registerPayload.dateOfBirth);
			expect(response.user.streetAddress).toBe(registerPayload.streetAddress);
			expect(response.user.city).toBe(registerPayload.city);
			expect(response.user.province).toBe(registerPayload.province);
			expect(response.user.username).toBe(registerPayload.username);
			expect(response.user.telephone).toBe(registerPayload.telephone);
			expect(response.user.email).toBe(registerPayload.email);
			expect(response.token).toHaveProperty('accessToken');
			expect(response.token).toHaveProperty('refreshToken');
		});

		it('invalid credential throws AuthenticationError', async () => {
			const payload: Login = {
				credential: 'test',
				password: 'asd',
			};

			await expect(registerService.loginUser(payload, 'test')).rejects.toThrow(
				AuthenticationError,
			);
		});
	});
});
