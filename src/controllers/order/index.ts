import { findProductById } from "@/data/product";
import { OrderStatus } from "@/db/models/order";
import { createOrderService } from "@/services/order";
import { BadRequestError } from "@/utils/error";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const createOrderController = async (req: Request, res: Response) => {
	const userId = req.user.id;
	const { productId, variantId, quantity } = req.body;

	if (!productId || !variantId || !quantity) {
		throw new BadRequestError("Please provide necessary data.");
	}

	const product = await findProductById(productId);

	const order = await createOrderService(
		productId,
		variantId,
		quantity,
		userId,
		OrderStatus.CONFIRMED,
		product.vendorId
	);

	res.status(StatusCodes.OK).json(order);
};

export const confirmOrder = async (req: Request, res: Response) => {};
