import {
	Table,
	Column,
	Model,
	DataType,
	CreatedAt,
	UpdatedAt,
	BelongsTo,
	ForeignKey,
	HasMany,
} from "sequelize-typescript";
import Order from "./order";
import { VerificationStatus } from "../enums/verification";
import Image from "./images";
import Vendor from "./vendor";
import { ProductCategory } from "../enums/product";
import Variant from "./variants";

@Table({
	tableName: "products",
	timestamps: true,
	modelName: "Product",
})
export default class Product extends Model {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	declare id: string;

	@Column({ type: DataType.STRING })
	declare name: string;

	@Column({ type: DataType.TEXT })
	declare description: string;

	@Column({
		type: DataType.ENUM(...Object.values(ProductCategory)),
		allowNull: false,
	})
	declare category: ProductCategory;

	@Column({ type: DataType.STRING })
	declare thumbnail: string;

	@Column({ type: DataType.STRING })
	declare brand: string;

	@Column({ type: DataType.FLOAT })
	declare rating: number;

	@Column({
		type: DataType.ENUM(...Object.values(VerificationStatus)),
		defaultValue: VerificationStatus.PENDING,
	})
	declare isVerified: string;

	@HasMany(() => Variant)
	declare variants: Variant[];

	@HasMany(() => Image)
	declare images: Image[];

	@ForeignKey(() => Vendor)
	@Column({ type: DataType.UUID })
	declare vendorId: string;

	@BelongsTo(() => Vendor)
	declare vendor: Vendor;

	@CreatedAt
	declare createdAt?: Date;

	@UpdatedAt
	declare updatedAt?: Date;
}
