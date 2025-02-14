import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import Product from "./product";

@Table({
	tableName: "images",
	timestamps: true,
	modelName: "Image",
})
export default class Image extends Model {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	declare id: string;

	@Column({ type: DataType.STRING })
	declare url: string;

	@ForeignKey(() => Product)
	@Column({ type: DataType.UUID })
	declare productId: string;

	@BelongsTo(() => Product)
	declare item: Product;
}
