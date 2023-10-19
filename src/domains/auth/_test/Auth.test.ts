/* eslint-disable @typescript-eslint/naming-convention */
import Auth, {type AuthT} from '../Auth';

describe('Auth', () => {
	it('create Auth successfully', () => {
		const date = new Date().toUTCString();
		const payload: AuthT = {
			id: 1,
			user_id: 1,
			user_agent: 'test',
			is_expired: 0,
			logged_in_at: date,
		};

		const auth = new Auth(payload);

		expect(auth.id).toBe(payload.id);
		expect(auth.userId).toBe(payload.user_id);
		expect(auth.userAgent).toBe(payload.user_agent);
		expect(auth.isExpired).toBe(false);
		expect(auth.loggedInAt).toBe(payload.logged_in_at);
	});
});
