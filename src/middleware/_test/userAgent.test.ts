import express, {type Request, type Response} from 'express';
import request from 'supertest';
import getUserAgent from '../userAgent';

describe('userAgent middleware', () => {
	it('getUserAgent', async () => {
		const app = express();
		app.get('/', [getUserAgent], (req: Request, res: Response) =>
			res.send({
				status: 'success',
				message: 'OK',
				userAgent: req.userAgent,
			}),
		);

		await request(app)
			.get('/')
			.set('User-Agent', 'test')
			.expect('Content-Type', /json/)
			.expect(200)
			.then((response) => {
				expect(response.body.status).toBe('success');
				expect(response.body.message).toBe('OK');
				expect(response.body.userAgent).toBe('test');
			});
	});
});
