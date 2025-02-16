import { createOrderData } from "@/data/order";
import { findProductById } from "@/data/product";
import { findUserByID } from "@/data/user";
import { OrderStatus } from "@/db/models/order";
import { ConflictError, NotFoundError } from "@/utils/error";

export const createOrderService = async (
	productId: string,
	variantId: string,
	quantity: number,
	userId: string,
	newStatus: OrderStatus,
	vendorId: string
) => {
	const product = await findProductById(productId);

	if (!product) {
		throw new NotFoundError("Item not found");
	}

	const variant = product.variants.find((v) => v.id === variantId);

	if (!variant) {
		throw new NotFoundError("Variant not found");
	}

	const totalPrice = variant.price * quantity;

	if (variant.stocks < quantity) {
		throw new ConflictError("Insufficient stock");
	}

	await variant.update({ stocks: variant.stocks - quantity });

	const user = await findUserByID(userId);

	if (!user) {
		throw new NotFoundError("User not found");
	}

	const orderCode = Math.random().toString(36).substring(2, 12).toUpperCase();

	const order = await createOrderData({
		userId: user.id,
		productId: product.id,
		quantity,
		totalPrice,
		orderCode,
		status: newStatus,
		vendorId: vendorId,
	});

	return order;
};
