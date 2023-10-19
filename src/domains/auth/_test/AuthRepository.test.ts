import * as UserTableHelper from '../../../../test_helper/usersTableHelper';
import * as AuthTableHelper from '../../../../test_helper/authTableHelper';
import pool from '../../../pool';
import AuthRepository from '../AuthRepository';
import Auth from '../Auth';
import AuthenticationError from '../../../error/AuthenticationError';
import moment from 'moment';

describe('AuthRepository', () => {
	let authRepository: AuthRepository;
	beforeAll(async () => {
		await UserTableHelper.createUser();
		authRepository = new AuthRepository(pool);
	});

	afterEach(async () => {
		await AuthTableHelper.clearTable();
	});

	afterAll(async () => {
		await pool.query('SET FOREIGN_KEY_CHECKS = 0');
		await UserTableHelper.clearTable();
		await pool.query('SET FOREIGN_KEY_CHECKS = 1');
		await pool.end();
	});

	describe('login', () => {
		it('sucess', async () => {
			const payload = {
				userId: 1,
				userAgent: 'test',
				date: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
			};

			const auth = await authRepository.login(
				payload.userId,
				payload.userAgent,
				payload.date,
			);

			expect(auth).toBeInstanceOf(Auth);
			expect(auth.id).toBe(1);
			expect(auth.isExpired).toBe(false);
			expect(auth.userId).toBe(payload.userId);
			expect(auth.userAgent).toBe(payload.userAgent);
			expect(auth.loggedInAt).toBe(payload.date);
		});
	});

	describe('verifyAuth', () => {
		it('auth not found throws AuthenticationError', async () => {
			await expect(
				authRepository.verifyAuth({id: 1, userId: 1}),
			).rejects.toThrow(AuthenticationError);
		});

		it('auth verified', async () => {
			await AuthTableHelper.createAuth();

			await expect(
				authRepository.verifyAuth({id: 1, userId: 1}),
			).resolves.not.toThrow(AuthenticationError);
		});
	});

	describe('expiresAllAuth', () => {
		it('success', async () => {
			await AuthTableHelper.createAuth();

			await authRepository.expiresAllAuth(1);

			const auth = await AuthTableHelper.getAuth();

			expect(auth).toHaveLength(1);
			expect(auth[0].isExpired).toBe(true);
		});
	});
});
