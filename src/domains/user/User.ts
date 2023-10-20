/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {type RowDataPacket} from 'mysql2';

export type UserT = {
	id: number;
	first_name: string;
	last_name: string;
	date_of_birth: string;
	street_address: string;
	city: string;
	province: string;
	telephone: string;
	email: string;
	username: string;
};

export default class User {
	public readonly id: number;
	public readonly firstName: string;
	public readonly lastName: string;
	public readonly dateOfBirth: string;
	public readonly streetAddress: string;
	public readonly city: string;
	public readonly province: string;
	public readonly telephone: string;
	public readonly email: string;
	public readonly username: string;

	constructor(raw: UserT | RowDataPacket) {
		this.id = raw.id;
		this.firstName = raw.first_name;
		this.lastName = raw.last_name;
		this.dateOfBirth = raw.date_of_birth;
		this.streetAddress = raw.street_address;
		this.city = raw.city;
		this.province = raw.province;
		this.telephone = raw.telephone;
		this.email = raw.email;
		this.username = raw.username;
	}
}
