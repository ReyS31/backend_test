import bcrypt from 'bcrypt';
import PasswordHash from '../PasswordHash';
import AuthenticationError from '../../error/AuthenticationError';

describe('PasswordHash', () => {
	describe('hash function', () => {
		it('should encrypt correctly', async () => {
			const spyHash = jest.spyOn(bcrypt, 'hash');
			const passwordHash = new PasswordHash(bcrypt, 14);

			const encryptedPassword = await passwordHash.hash('plain_password');

			expect(typeof encryptedPassword).toEqual('string');
			expect(encryptedPassword).not.toEqual('plain_password');
			expect(spyHash).toBeCalledWith('plain_password', 14); //
		});
	});

	describe('comparePassword function', () => {
		it('should throw AuthenticationError if password not match', async () => {
			// Arrange
			const bcryptEncryptionHelper = new PasswordHash(bcrypt);

			// Act & Assert
			await expect(
				bcryptEncryptionHelper.comparePassword(
					'plain_password',
					'encrypted_password',
				),
			).rejects.toThrow(AuthenticationError);
		});

		it('should not return AuthenticationError if password match', async () => {
			// Arrange
			const bcryptEncryptionHelper = new PasswordHash(bcrypt);
			const plainPassword = 'secret';
			const encryptedPassword = await bcryptEncryptionHelper.hash(plainPassword);

			// Act & Assert
			await expect(
				bcryptEncryptionHelper.comparePassword(plainPassword, encryptedPassword),
			).resolves.not.toThrow(AuthenticationError);
		});
	});
});
