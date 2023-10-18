import ClientError from './ClientError';

export default class InvariantError extends ClientError {
	constructor(message: string | undefined) {
		super(400, message);
		this.name = 'InvariantError';
	}
}
