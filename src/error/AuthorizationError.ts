import ClientError from './ClientError';

export default class AuthorizationError extends ClientError {
	constructor(message: string | undefined) {
		super(403, message);
		this.name = 'AuthorizationError';
	}
}
