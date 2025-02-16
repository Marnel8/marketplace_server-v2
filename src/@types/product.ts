import { ProductCategory } from "@/db/enums/product";

export interface ICreateVariant {
	variant: string;
	price: number;
	stocks: number;
	variantImage: string;
}

export interface IProduct {
	name: string;
	description: string;
	variants: ICreateVariant[];
	category: ProductCategory;
	thumbnail: string;
	brand?: string;
	ownerId?: string;
}
