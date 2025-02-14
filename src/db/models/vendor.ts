import {
	Table,
	Column,
	Model,
	DataType,
	CreatedAt,
	UpdatedAt,
	BeforeCreate,
	HasMany,
	BeforeUpdate,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import User from "./user";
import Product from "./product";
import { VerificationStatus } from "../enums/verification";
import { BusinessType } from "../enums/vendor";

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Table({
	tableName: "vendors",
	timestamps: true,
})
export default class Vendor extends Model {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	declare id: string;

	@Column({ type: DataType.STRING })
	declare businessName: string;

	@Column({
		type: DataType.ENUM(...Object.values(BusinessType)),
		allowNull: false,
	})
	declare businessType: BusinessType;

	@Column({ type: DataType.STRING })
	declare businessDescription: string;

	@Column({ type: DataType.STRING })
	declare businessAddress: string;

	@Column({ type: DataType.STRING, allowNull: true })
	declare validId: string;

	@ForeignKey(() => User)
	@Column({ type: DataType.UUID })
	declare ownerId: string;

	@BelongsTo(() => User)
	declare owner: User;

	@Column({ type: DataType.STRING })
	declare logo: string;

	@Column({ type: DataType.STRING, allowNull: true })
	declare banner: string;

	@HasMany(() => Product)
	declare products: Product[];

	@Column({
		type: DataType.ENUM(...Object.values(VerificationStatus)),
		defaultValue: VerificationStatus.PENDING,
	})
	declare isVerified: string;
}
