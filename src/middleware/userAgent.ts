import {type NextFunction, type Request, type Response} from 'express';

export default function getUserAgent(
	request: Request,
	_: Response,
	next: NextFunction,
) {
	request.userAgent = request.headers['user-agent'];
	next();
}
