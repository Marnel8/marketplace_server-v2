import {
	Table,
	Column,
	Model,
	DataType,
	CreatedAt,
	UpdatedAt,
	BelongsTo,
	ForeignKey,
} from "sequelize-typescript";
import Product from "./product";

@Table({
	tableName: "variant",
	timestamps: true,
	modelName: "Variant",
})
export default class Variant extends Model {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	declare id: string;

	@Column({
		type: DataType.STRING,
		defaultValue: "default",
	})
	declare variant: string;

	@Column({
		type: DataType.FLOAT,
	})
	declare price: number;

	@Column({
		type: DataType.INTEGER,
	})
	declare stocks: number;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	declare variantImage: string;

	@ForeignKey(() => Product)
	@Column({
		type: DataType.UUID,
	})
	declare productId: string;

	@BelongsTo(() => Product)
	declare product: Product;

	@CreatedAt
	declare createdAt: Date;
	@UpdatedAt
	declare updatedAt: Date;
}
