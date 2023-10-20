import {
	type ResultSetHeader,
	type Pool,
	type RowDataPacket,
} from 'mysql2/promise';
import InvariantError from '../../error/InvariantError';
import {type CreateWallet} from '../../services/wallet/WalletTypes';

export default class WalletRepository {
	constructor(private readonly pool: Pool) {}

	public async getBalance(userId: number): Promise<number> {
		let [rows] = await this.pool.query(
			'SELECT balance FROM `wallets` WHERE `user_id` = ?',
			[userId],
		);
		rows = rows as RowDataPacket[];

		if (rows.length) {
			throw new InvariantError('user has no wallet');
		}

		return rows[0].balance as number;
	}

	public async createWallet(data: CreateWallet): Promise<string> {
		try {
			const [row] = await this.pool.query(
				`
				INSERT INTO wallets
				(id, user_id, pin)
				VALUES
				(?, ?, ?)
			`,
				[data.id, data.userId, data.pin],
			);
			if (!(row as ResultSetHeader).affectedRows) {
				throw Error('fails to create wallet');
			}

			return data.id;
		} catch (error) {
			throw new InvariantError((error as Error).message);
		}
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
}
