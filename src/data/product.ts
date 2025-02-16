import { ICreateVariant, IProduct } from "@/@types/product";
import sequelize from "@/db";
import { findVendorByOwnerID } from "./vendor";
import Product from "@/db/models/product";
import { ConflictError, NotFoundError } from "@/utils/error";
import Variant from "@/db/models/variants";
import { deleteFiles } from "@/utils/file";

/**
 * TODO : Add more validation
 */

export const createProductData = async (productData: IProduct) => {
	const t = await sequelize.transaction();

	if (!productData.ownerId) {
		throw new NotFoundError("Owner not found.");
	}

	try {
		const vendor = await findVendorByOwnerID(productData.ownerId);

		const product = await Product.create(
			{
				name: productData.name,
				description: productData.description,
				category: productData.category,
				thumbnail: productData.thumbnail,
				brand: productData.brand,
				vendorId: vendor.id,
			},
			{ transaction: t }
		);

		if (!product) {
			await deleteFiles([productData.thumbnail]);
			await t.rollback();
			throw new ConflictError("Failed to create product.");
		}

		const variants = productData.variants.map((variant) => ({
			...variant,
			productId: product.id,
		}));

		const createdVariants = await Variant.bulkCreate(variants, {
			transaction: t,
		});

		if (!createdVariants) {
			await t.rollback();
			await deleteFiles(variants.map((variant) => variant.variantImage));
			throw new ConflictError("Failed to create variants.");
		}

		await t.commit();

		return product;
	} catch (error) {
		await t.rollback();

		const filesToDelete = [
			productData.thumbnail,
			...(productData.variants || []).map((variant) => variant.variantImage),
		];

		await deleteFiles(filesToDelete);

		throw error;
	}
};

export const getProductsData = async (query?: any) => {
	const products = await Product.findAll({
		...query,
		include: {
			model: Variant,
			as: "variants",
		},
	});

	if (!products) {
		throw new ConflictError("Failed to get products.");
	}

	return products;
};

export const findProductById = async (id: string) => {
	const product = await Product.findByPk(id, {
		include: {
			model: Variant,
		},
	});

	if (!product) {
		throw new NotFoundError("Product not found.");
	}

	return product;
};

export const updateProductData = async (
	productId: string,
	productData: IProduct
) => {
	const t = await sequelize.transaction();

	try {
		const product = await Product.findByPk(productId);

		if (!product) {
			throw new NotFoundError("Product not found.");
		}

		const currentThumbnail = product.thumbnail;
		const currentVariants = await Variant.findAll({ where: { productId } });
		const currentVariantImages = currentVariants.map((v) => v.variantImage);

		await product.update(
			{
				name: productData.name,
				description: productData.description,
				category: productData.category,
				thumbnail: productData.thumbnail,
				brand: productData.brand,
			},
			{ transaction: t }
		);

		await Variant.destroy({
			where: { productId },
			transaction: t,
		});

		const variants = productData.variants.map((variant) => ({
			...variant,
			productId: product.id,
		}));

		const createdVariants = await Variant.bulkCreate(variants, {
			transaction: t,
		});

		if (!createdVariants) {
			await t.rollback();
			throw new ConflictError("Failed to update variants.");
		}

		await t.commit();

		const filesToDelete = [currentThumbnail, ...currentVariantImages];

		await deleteFiles(filesToDelete);

		return product;
	} catch (error) {
		await t.rollback();

		const filesToDelete = [
			productData.thumbnail,
			...(productData.variants || []).map((variant) => variant.variantImage),
		];

		await deleteFiles(filesToDelete);

		throw error;
	}
};

export const deleteProductData = async (id: string) => {
	const t = await sequelize.transaction();

	try {
		const existingProduct = await findProductById(id);

		if (!existingProduct) {
			throw new NotFoundError("Product not found.");
		}

		await deleteFiles([existingProduct.thumbnail]);

		await deleteFiles(
			existingProduct.variants.map(
				(variant: ICreateVariant) => variant.variantImage
			)
		);

		await Product.destroy({ where: { id } });

		await t.commit();

		return existingProduct;
	} catch (error) {
		await t.rollback();
		throw error;
	}
};

export const getProductsByOwnerData = async (ownerId: string) => {
	const vendor = await findVendorByOwnerID(ownerId);

	if (!vendor) {
		throw new NotFoundError("Vendor not found.");
	}

	const products = await Product.findAll({
		where: { vendorId: vendor.id },
		include: {
			model: Variant,
		},
	});

	if (!products) {
		throw new ConflictError("Failed to get products.");
	}

	return products;
};
