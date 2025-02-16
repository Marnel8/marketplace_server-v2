import { ICreateOrderParams } from "@/@types/order";
import sequelize from "@/db";
import Order from "@/db/models/order";
import { ConflictError } from "@/utils/error";

export const createOrderData = async (orderData: ICreateOrderParams) => {
	const t = await sequelize.transaction();

	const createdOrder = await Order.create(
		{
			userId: orderData.userId,
			productId: orderData.productId,
			quantity: orderData.quantity,
			totalPrice: orderData.totalPrice,
			orderCode: orderData.orderCode,
			status: orderData.status,
			vendorId: orderData.vendorId,
		},
		{ transaction: t }
	);

	if (!createdOrder) {
		await t.rollback();
		throw new ConflictError("Failed to create order");
	}

	await t.commit();

	return createdOrder;
};
