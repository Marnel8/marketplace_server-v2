import { IProduct } from "@/@types/product";
import sequelize from "@/db";
import { findVendorByOwnerID } from "./vendor";
import Product from "@/db/models/product";
import { ConflictError } from "@/utils/error";
import Variant from "@/db/models/variants";

/**
 * TODO : Add more validation
 * !TODO : Test it
 */

export const createProductData = async (productData: IProduct) => {
	const t = await sequelize.transaction();

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
		throw new ConflictError("Failed to create variants.");
	}

	await t.commit();

	return product;
};
