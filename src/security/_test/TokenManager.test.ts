import Jwt from 'jsonwebtoken';
import TokenManager from '../TokenManager';
import InvariantError from '../../error/InvariantError';

import dotenv from 'dotenv';

dotenv.config();
describe('JwtTokenManager', () => {
	describe('createAccessToken function', () => {
		it('should create accessToken correctly', async () => {
			// Arrange
			const payload = {
				username: 'test',
			};
			const mockJwtToken = {
				sign: jest.fn().mockImplementation(() => 'mock_token'),
			};
			const jwtTokenManager = new TokenManager(mockJwtToken);

			// Action
			const accessToken = await jwtTokenManager.createAccessToken(payload);

			// Assert
			expect(mockJwtToken.sign).toBeCalledWith(
				payload,
				process.env.ACCESS_TOKEN_KEY,
			);
			expect(accessToken).toEqual('mock_token');
		});
	});

	describe('createRefreshToken function', () => {
		it('should create refreshToken correctly', async () => {
			// Arrange
			const payload = {
				username: 'test',
			};
			const mockJwtToken = {
				sign: jest.fn().mockImplementation(() => 'mock_token'),
			};
			const jwtTokenManager = new TokenManager(mockJwtToken);

			// Action
			const refreshToken = await jwtTokenManager.createRefreshToken(payload);

			// Assert
			expect(mockJwtToken.sign).toBeCalledWith(
				payload,
				process.env.REFRESH_TOKEN_KEY,
			);
			expect(refreshToken).toEqual('mock_token');
		});
	});

	describe('verifyRefreshToken function', () => {
		it('should throw InvariantError when verification failed', async () => {
			// Arrange
			const jwtTokenManager = new TokenManager(Jwt);
			const accessToken = await jwtTokenManager.createAccessToken({
				username: 'test',
			});

			// Action & Assert
			await expect(
				jwtTokenManager.verifyRefreshToken(accessToken),
			).rejects.toThrow(InvariantError);
		});

		it('should not throw InvariantError when refresh token verified', async () => {
			// Arrange
			const jwtTokenManager = new TokenManager(Jwt);
			const refreshToken = await jwtTokenManager.createRefreshToken({
				username: 'test',
			});

			// Action & Assert
			await expect(
				jwtTokenManager.verifyRefreshToken(refreshToken),
			).resolves.not.toThrow(InvariantError);
		});
	});

	describe('decodePayload function', () => {
		it('should decode payload correctly', async () => {
			// Arrange
			const jwtTokenManager = new TokenManager(Jwt);
			const accessToken = await jwtTokenManager.createAccessToken({
				username: 'test',
			});

			// Action
			const {username: expectedUsername}
				= await jwtTokenManager.decodePayload(accessToken);

			// Action & Assert
			expect(expectedUsername).toEqual('test');
		});
	});
});
