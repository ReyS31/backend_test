import pool from '../../pool';
import UserRepository from '../UserRepository';
import * as UserTableHelpers from '../../../test_helper/usersTableHelper';
import InvariantError from '../../error/InvariantError';
import NotFoundError from '../../error/NotFoundError';
import User from '../User';

describe('UserRepository', () => {
	let userRepository: UserRepository;
	beforeAll(() => {
		userRepository = new UserRepository(pool);
	});

	afterEach(async () => {
		await UserTableHelpers.clearTable();
	});

	afterAll(async () => {
		await pool.end();
	});

	describe('isUsernameAvailable', () => {
		it('username Available', async () => {
			await expect(
				userRepository.isUsernameAvailable('test'),
			).resolves.not.toThrow(InvariantError);
		});

		it('username unavailable', async () => {
			await UserTableHelpers.createUser();

			await expect(userRepository.isUsernameAvailable('test')).rejects.toThrow(
				InvariantError,
			);
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
		it('user not found', async () => {
			await UserTableHelpers.createUser();

			await expect(
				userRepository.createUser({
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
				}),
			).rejects.toThrow(InvariantError);
		});

		it('user found', async () => {
			const userId = await userRepository.createUser({
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
			});

			expect(userId).toBe(1);
		});
	});
});
