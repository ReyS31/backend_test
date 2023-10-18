import InvariantError from '../InvariantError';
import ClientError from '../ClientError';

describe('InvariantError', () => {
	it('should create InvariantError correctly', () => {
		const invariantError = new InvariantError('invariant error!');

		expect(invariantError).toBeInstanceOf(InvariantError);
		expect(invariantError).toBeInstanceOf(ClientError);
		expect(invariantError).toBeInstanceOf(Error);

		expect(invariantError.statusCode).toEqual(400);
		expect(invariantError.message).toEqual('invariant error!');
		expect(invariantError.name).toEqual('InvariantError');
	});
});
