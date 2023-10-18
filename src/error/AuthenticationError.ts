import ClientError from './ClientError';

export default class AuthenticationError extends ClientError {
	constructor(message: string) {
		super(401, message);
		this.name = 'AuthenticationError';
	}
}
