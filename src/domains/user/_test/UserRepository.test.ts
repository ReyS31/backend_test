import * as UserTableHelpers from '../../../../test_helper/usersTableHelper';
import UserRepository from '../UserRepository';
import User from '../User';
import InvariantError from '../../../error/InvariantError';
import NotFoundError from '../../../error/NotFoundError';
import pool from '../../../pool';
import moment from 'moment';
import AuthenticationError from '../../../error/AuthenticationError';

describe('UserRepository', () => {
	let userRepository: UserRepository;

	beforeAll(async () => {
		await pool.query('SET FOREIGN_KEY_CHECKS = 0');
		await UserTableHelpers.clearTable();
		userRepository = new UserRepository(pool);
	});

	afterEach(async () => {
		await UserTableHelpers.clearTable();
	});

	afterAll(async () => {
		await pool.query('SET FOREIGN_KEY_CHECKS = 1');
		await pool.end();
	});

	describe('isUsernameAvailable', () => {
		it('username unavailable', async () => {
			await UserTableHelpers.createUser();

			await expect(userRepository.isUsernameAvailable('test')).rejects.toThrow(
				InvariantError,
			);
		});
		it('username Available', async () => {
			await expect(
				userRepository.isUsernameAvailable('test'),
			).resolves.not.toThrow(InvariantError);
		});
	});

	describe('getUser', () => {
		it('user not found', async () => {
			await expect(userRepository.getUser(1)).rejects.toThrow(NotFoundError);
		});

		it('user found', async () => {
			await UserTableHelpers.createUser();

			const user = await userRepository.getUser(1);
			expect(user).toBeInstanceOf(User);
			expect(user.id).toBe(1);
			expect(user.firstName).toBe('test');
			expect(user.lastName).toBe('test');
			expect(user.city).toBe('test');
			expect(user.province).toBe('test');
			expect(user.dateOfBirth).toBe('2001-01-03');
			expect(user.streetAddress).toBe('Jl. Test');
			expect(user.username).toBe('test');
			expect(user.email).toBe('test@test.test');
			expect(user.telephone).toBe('+6281231892476');
		});
	});

	describe('createUser', () => {
		it('user not created and throws InvariantError', async () => {
			await UserTableHelpers.createUser();
			const date = moment().utc().format('YYYY-MM-DD HH:mm:ss');

			await expect(
				userRepository.createUser(
					{
						firstName: 'test',
						lastName: 'test',
						city: 'test',
						dateOfBirth: '2001-01-03',
						email: 'test@test.test',
						password: 'test',
						province: 'test',
						streetAddress: 'test',
						telephone: '+6219263192',
						username: 'test',
					},
					date,
				),
			).rejects.toThrow(InvariantError);
		});

		it('user created', async () => {
			const date = moment().utc().format('YYYY-MM-DD HH:mm:ss');
			const userId = await userRepository.createUser(
				{
					firstName: 'test',
					lastName: 'test',
					city: 'test',
					dateOfBirth: '2001-01-03',
					email: 'test@test.test',
					password: 'test',
					province: 'test',
					streetAddress: 'test',
					telephone: '+6219263192',
					username: 'test',
				},
				date,
			);

			expect(userId).toBe(1);
		});
	});

	describe('getPassword', () => {
		beforeEach(async () => {
			const date = moment().utc().format('YYYY-MM-DD HH:mm:ss');
			await userRepository.createUser(
				{
					firstName: 'test',
					lastName: 'test',
					city: 'test',
					dateOfBirth: '2001-01-03',
					email: 'test@test.test',
					password: 'test',
					province: 'test',
					streetAddress: 'test',
					telephone: '+6219263192',
					username: 'test',
				},
				date,
			);
		});
		it('user not found throws AuthenticationError', async () => {
			await expect(userRepository.getPassword('asdasd')).rejects.toThrow(
				AuthenticationError,
			);
		});

		it('get data by username correctly', async () => {
			const data = await userRepository.getPassword('test');

			expect(data.id).toBe(1);
			expect(data.password).toBe('test');
		});

		it('get data by email correctly', async () => {
			const data = await userRepository.getPassword('test@test.test');

			expect(data.id).toBe(1);
			expect(data.password).toBe('test');
		});
	});
});
