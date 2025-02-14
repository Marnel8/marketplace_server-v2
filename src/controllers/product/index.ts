import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createProductData } from "@/data/product";
import { BadRequestError } from "@/utils/error";
import { ICreateVariant } from "@/@types/product";

export const createProductController = async (req: Request, res: Response) => {
	const user = req.user;

	const { name, description, category, variants, brand } = req.body;

	if (!name || !description || !category || !variants) {
		throw new BadRequestError("Please provide all necessary data.");
	}

	const files = req.files as MulterFiles;

	const thumbnail = files?.thumbnail?.[0]?.filename as string;

	const variantImages = files?.variantImages?.map((file) => file.filename);

	const parsedVariants: ICreateVariant[] = Array.isArray(variants)
		? variants
		: JSON.parse(variants);

	if (parsedVariants.length !== (variantImages?.length || 0)) {
		throw new BadRequestError(
			"The number of variants and variant images do not match."
		);
	}

	const variantsWithImages = parsedVariants.map(
		(variant: ICreateVariant, i: number) => ({
			...variant,
			variantImage: variantImages?.[i] as string,
		})
	);

	const productData = {
		name,
		description,
		category,
		variants: variantsWithImages,
		brand,
		thumbnail,
		ownerId: user.id,
	};

	const product = await createProductData(productData);

	res.status(StatusCodes.CREATED).json(product);
};
