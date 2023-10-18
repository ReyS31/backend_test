export default abstract class ClientError extends Error {
	public statusCode: number;
	constructor(statusCode: number, message: string | undefined) {
		super(message);
		this.statusCode = statusCode;
	}
}
