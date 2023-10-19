import type Register from '../Register';
describe('Register type test', () => {
	it('return register correctly', () => {
		const payload = {
			firstName: 'test',
			lastName: 'test',
			dateOfBirth: '2000-01-01',
			streetAddress: 'Jl. Juanda 5, Gang Karet',
			city: 'Samarinda',
			province: 'Kalimantan Timur',
			telephone: '+6281224974874',
			email: 'rey.pratama311@gmail.com',
			username: 'reyquaza',
			password: 'testtest',
		};

		const register: Register = payload;

		expect(register.firstName).toBe('test');
		expect(register.lastName).toBe('test');
		expect(register.dateOfBirth).toBe('2000-01-01');
		expect(register.streetAddress).toBe('Jl. Juanda 5, Gang Karet');
		expect(register.city).toBe('Samarinda');
		expect(register.province).toBe('Kalimantan Timur');
		expect(register.telephone).toBe('+6281224974874');
		expect(register.email).toBe('rey.pratama311@gmail.com');
		expect(register.username).toBe('reyquaza');
		expect(register.password).toBe('testtest');
	});

	it('return register correctly with overload payload', () => {
		const payload = {
			firstName: 'test',
			lastName: 'test',
			dateOfBirth: '2000-01-01',
			streetAddress: 'Jl. Juanda 5, Gang Karet',
			city: 'Samarinda',
			province: 'Kalimantan Timur',
			telephone: '+6281224974874',
			email: 'rey.pratama311@gmail.com',
			username: 'reyquaza',
			password: 'testtest',
			passwordTest: 'testtest',
		};

		const register: Register = payload as Register;

		expect(register.firstName).toBe('test');
		expect(register.lastName).toBe('test');
		expect(register.dateOfBirth).toBe('2000-01-01');
		expect(register.streetAddress).toBe('Jl. Juanda 5, Gang Karet');
		expect(register.city).toBe('Samarinda');
		expect(register.province).toBe('Kalimantan Timur');
		expect(register.telephone).toBe('+6281224974874');
		expect(register.email).toBe('rey.pratama311@gmail.com');
		expect(register.username).toBe('reyquaza');
		expect(register.password).toBe('testtest');
	});
});
