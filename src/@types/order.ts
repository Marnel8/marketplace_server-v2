import { OrderStatus } from "@/db/models/order";

export interface ICreateOrderParams {
	userId: string;
	productId: string;
	quantity: number;
	totalPrice: number;
	orderCode: string;
	status: OrderStatus;
	vendorId: string;
}
