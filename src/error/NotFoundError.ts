import ClientError from './ClientError';

export default class NotFoundError extends ClientError {
	constructor(message: string | undefined) {
		super(404, message);
		this.name = 'NotFoundError';
	}
}
