/* eslint-disable @typescript-eslint/naming-convention */
import User, {type UserT} from '../User';

describe('User', () => {
	it('create User successfully', () => {
		const payload: UserT = {
			first_name: 'test',
			last_name: 'test',
			city: 'test',
			date_of_birth: '2001-01-03',
			email: 'test@test.test',
			province: 'test',
			street_address: 'test test',
			telephone: '+6280000000',
			username: 'test',
		};

		const user = new User(payload);

		expect(user.firstName).toBe(payload.first_name);
		expect(user.lastName).toBe(payload.last_name);
		expect(user.city).toBe(payload.city);
		expect(user.dateOfBirth).toBe(payload.date_of_birth);
		expect(user.email).toBe(payload.email);
		expect(user.province).toBe(payload.province);
		expect(user.streetAddress).toBe(payload.street_address);
		expect(user.telephone).toBe(payload.telephone);
		expect(user.username).toBe(payload.username);
	});
});
