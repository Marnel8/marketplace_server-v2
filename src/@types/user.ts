import { UserRole } from "@/db/models/user";

export interface IUser {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	age: number;
	contactNumber: string;
	password: string;
	role?: UserRole;
	comparePassword: (password: string) => Promise<boolean>;
	SignAccessToken: () => string;
	SignRefreshToken: () => string;
}

export type CreateUserParams = {
	firstName: string;
	lastName: string;
	email: string;
	age: number;
	role: UserRole;
	contactNumber: string;
	password: string;
	avatar?: string | undefined;
};

export type FindUserParams = {
	email: string;
};

export type IActivationToken = {
	token: string;
	activationCode: string;
};

export type IActivationRequest = {
	activation_token: string;
	activation_code: string;
};
