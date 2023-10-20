import {createHash} from 'node:crypto';

describe('WalletService', () => {
	it('encrypt wallet', () => {
		const encrypt = createHash('sha256').update('reyquaza@rey.pratama123@gmail.com1111111111111111111').digest('hex');
		console.log(encrypt);
	});
});
