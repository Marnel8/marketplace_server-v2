import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { BadRequestError, NotFoundError } from "@/utils/error";

import {
	createProductData,
	deleteProductData,
	findProductById,
	getProductsByOwnerData,
	getProductsData,
	updateProductData,
} from "@/data/product";

import { ICreateVariant } from "@/@types/product";
import { deleteFiles } from "@/utils/file";

export const createProductController = async (req: Request, res: Response) => {
	const user = req.user;

	const { name, description, category, variants, brand } = req.body;

	if (!name || !description || !category) {
		throw new BadRequestError("Please provide all necessary data.");
	}

	const files = req.files as MulterFiles;

	if (!files?.thumbnail?.[0]) {
		throw new BadRequestError("Thumbnail is required.");
	}

	if (!files?.variantImages || files.variantImages.length === 0) {
		throw new BadRequestError("At least one variant image is required.");
	}

	const thumbnail = files.thumbnail[0].filename;
	const variantImages = files.variantImages.map((file) => file.filename);

	let parsedVariants: ICreateVariant[];
	try {
		parsedVariants = Array.isArray(variants) ? variants : JSON.parse(variants);
	} catch (error) {
		throw new BadRequestError("Invalid variants format.");
	}

	if (parsedVariants.length !== variantImages.length) {
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

export const updateProductController = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name, description, category, variants, brand } = req.body;

	const existingProduct = await findProductById(id);
	if (!existingProduct) {
		throw new NotFoundError("Product not found.");
	}

	const files = req.files as MulterFiles;

	let thumbnail = existingProduct.thumbnail;
	let variantImages = existingProduct.variants.map(
		(variant: ICreateVariant) => variant.variantImage
	);

	if (files?.thumbnail?.[0]) {
		await deleteFiles([existingProduct.thumbnail]);
		thumbnail = files.thumbnail[0].filename;
	}

	if (files?.variantImages?.length) {
		await deleteFiles(variantImages);
		variantImages = files.variantImages.map((file) => file.filename);
	}

	let parsedVariants: ICreateVariant[];
	try {
		parsedVariants = Array.isArray(variants) ? variants : JSON.parse(variants);
	} catch (error) {
		throw new BadRequestError("Invalid variants format.");
	}

	if (parsedVariants.length !== variantImages.length) {
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

	const updatedProductData = {
		name: name || existingProduct.name,
		description: description || existingProduct.description,
		category: category || existingProduct.category,
		variants: variantsWithImages,
		brand: brand || existingProduct.brand,
		thumbnail,
	};

	const updatedProduct = await updateProductData(id, updatedProductData);

	res.status(StatusCodes.OK).json(updatedProduct);
};

export const deleteProductController = async (req: Request, res: Response) => {
	const { id } = req.params;

	const deletedProduct = await deleteProductData(id);

	res.status(StatusCodes.OK).json({ message: "Product deleted successfully." });
};

export const getProductsController = async (req: Request, res: Response) => {
	const products = await getProductsData();

	res.status(StatusCodes.OK).json(products);
};

export const getProductsByOwnerController = async (
	req: Request,
	res: Response
) => {
	const { id } = req.user;

	const products = await getProductsByOwnerData(id);

	res.status(StatusCodes.OK).json(products);
};

export const getVerifiedProductsController = async (
	req: Request,
	res: Response
) => {
	const query = { where: { isVerified: "verified" } };

	const products = await getProductsData(query);

	res.status(StatusCodes.OK).json(products);
};
