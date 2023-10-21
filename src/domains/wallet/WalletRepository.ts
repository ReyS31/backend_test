import {
	type ResultSetHeader,
	type Pool,
	type RowDataPacket,
} from 'mysql2/promise';
import InvariantError from '../../error/InvariantError';
import {
	WalletIdBalance,
	type CreateWallet,
} from '../../services/wallet/WalletTypes';

export default class WalletRepository {
	constructor(private readonly pool: Pool) {}

	public async getBalance(userId: number): Promise<WalletIdBalance> {
		let [rows] = await this.pool.query(
			'SELECT id, balance, pin FROM `wallets` WHERE `user_id` = ?',
			[userId],
		);
		rows = rows as RowDataPacket[];

		if (!rows.length) {
			throw new InvariantError('user has no wallet');
		}

		return new WalletIdBalance(rows[0]);
	}

	public async createWallet(data: CreateWallet): Promise<string> {
		await this.pool.query(
			`
				INSERT INTO wallets
				(id, user_id, pin)
				VALUES
				(?, ?, ?)
			`,
			[data.id, data.userId, data.pin],
		);

		return data.id;
	}

	public async updateBalance(
		walletId: string,
		newBalance: number,
	): Promise<void> {
		let [res] = await this.pool.query(
			'UPDATE wallets SET balance = ? WHERE id = ?',
			[newBalance, walletId],
		);

		res = res as ResultSetHeader;

		if (!res.affectedRows) {
			throw new InvariantError('fails to update wallet');
		}
	}

	public async updatePin(id: string, newPin: string): Promise<void> {
		let [res] = await this.pool.query('UPDATE wallets SET pin = ? WHERE id = ?', [
			newPin,
			id,
		]);

		res = res as ResultSetHeader;

		if (!res.affectedRows) {
			throw new InvariantError('fails to update wallet');
		}
	}
}
