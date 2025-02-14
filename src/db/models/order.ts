import {
	Table,
	Column,
	Model,
	DataType,
	CreatedAt,
	UpdatedAt,
	HasMany,
	BelongsTo,
	ForeignKey,
} from "sequelize-typescript";
import User from "./user";
import Product from "./product";

export enum OrderStatus {
	PENDING = "pending",
	TO_BE_PICKED_UP = "to pick up",
	CONFIRMED = "confirmed",
	APPROVED = "approved",
	SUCCESS = "success",
	CANCELLED = "cancelled",
	DENIED = "denied",
}

@Table({
	tableName: "orders",
	timestamps: true,
	modelName: "Order",
})
export default class Order extends Model {
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

	@HasMany(() => Product)
	declare products: Product[];

	@ForeignKey(() => User)
	@Column({ type: DataType.UUID })
	declare vendorId: string;

	@BelongsTo(() => User)
	declare vendor: User;

	@Column({ type: DataType.INTEGER })
	declare quantity: number;

	@Column({ type: DataType.FLOAT })
	declare totalPrice: number;

	@Column({
		type: DataType.ENUM(
			OrderStatus.PENDING,
			OrderStatus.TO_BE_PICKED_UP,
			OrderStatus.CONFIRMED,
			OrderStatus.APPROVED,
			OrderStatus.SUCCESS,
			OrderStatus.CANCELLED,
			OrderStatus.DENIED
		),
	})
	declare status: OrderStatus;

	@Column({ type: DataType.STRING })
	declare orderCode: string;

	@CreatedAt
	declare createdAt?: Date;

	@UpdatedAt
	declare updatedAt?: Date;
}
