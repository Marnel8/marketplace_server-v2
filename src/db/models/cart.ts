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
import User from "./user";
import Product from "./product";

@Table({
	tableName: "cart",
	timestamps: true,
	modelName: "Cart",
})
export default class Cart extends Model {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	declare id: string;

	@ForeignKey(() => User)
	@Column({ type: DataType.UUID })
	declare userId: string;

	@BelongsTo(() => User)
	declare user: User;

	@ForeignKey(() => Product)
	@Column({ type: DataType.UUID })
	declare productId: string;

	@BelongsTo(() => Product)
	declare product: Product;

	@Column({ type: DataType.INTEGER })
	declare quantity: number;

	@Column({ type: DataType.INTEGER })
	declare totalPrice: number;

	@CreatedAt
	declare createdAt: Date;

	@UpdatedAt
	declare updatedAt: Date;
}
