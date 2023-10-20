import {type RowDataPacket} from 'mysql2/promise';
import {z} from 'zod';

export type CreateWallet = {
	id: string;
	userId: number;
	pin: string;
};

export type CreateTranscation = {
	walletId: string;
	amount: number;
	latestWalletBalance: number;
	operation: 'ADD' | 'SUB';
	date: string;
};

export type TransactionResponse = {
	balance: number;
	date: string;
};

export type TopUpRequest = {
	amount: number;
};

export type PayRequest = {
	amount: number;
	pin: string;
};

export type ChangePinRequest = {
	pin: string;
	newPin: string;
};

export class WalletIdBalance {
	public readonly id: string;
	public readonly pin: string;
	public readonly balance: number;
	constructor(data: RowDataPacket) {
		this.id = data.id as string;
		this.balance = data.balance as number;
		this.pin = data.pin as string;
	}
}

export function verifyTopupPayload(request: unknown): TopUpRequest {
	const topUpPayloadValidator = z
		.object({
			amount: z.number(),
		})
		.required();

	return topUpPayloadValidator.parse(request);
}

export function verifyPayPayload(request: unknown): PayRequest {
	const topUpPayloadValidator = z
		.object({
			amount: z.number(),
			pin: z.string(),
		})
		.required();

	return topUpPayloadValidator.parse(request);
}

export function verifyChangePinPayload(request: unknown): ChangePinRequest {
	const changePinPayloadValidator = z
		.object({
			pin: z.string(),
			newPin: z.string(),
		})
		.required();

	return changePinPayloadValidator.parse(request);
}
