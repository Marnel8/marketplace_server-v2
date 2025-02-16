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
import Variant from "./variants";

export enum OrderStatus {
	PENDING = "pending",
	DENIED = "denied",
	CONFIRMED = "confirmed",
	APPROVED = "approved",
	TO_PICK_UP = "to pick up",
	PAID = "paid",
	COMPLETED = "completed",
	CANCELLED = "cancelled",
	TO_RETURN = "to return",
	RETURNED = "returned",
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

	@ForeignKey(() => Variant)
	@Column({ type: DataType.UUID })
	declare productId: string;

	@BelongsTo(() => Variant)
	declare product: Variant;

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
		type: DataType.ENUM(...Object.values(OrderStatus)),
		defaultValue: OrderStatus.PENDING,
	})
	declare status: OrderStatus;

	@Column({ type: DataType.STRING })
	declare orderCode: string;

	@CreatedAt
	declare createdAt?: Date;

	@UpdatedAt
	declare updatedAt?: Date;
}
