import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
} from "sequelize-typescript";
import Order from "./order";

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export enum UserRole {
	ADMIN = "admin",
	USER = "user",
	GUEST = "guest",
	VENDOR = "vendor",
}

@Table({
	tableName: "users",
	timestamps: true,
	modelName: "User",
})
export default class User extends Model {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	declare id: string;

	@Column({ type: DataType.STRING })
	declare firstName: string;

	@Column({ type: DataType.STRING })
	declare lastName: string;

	@Column({
		type: DataType.STRING,
	})
	declare email: string;

	@Column({ type: DataType.INTEGER })
	declare age: number;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	declare contactNumber: string;

	@Column({ type: DataType.STRING })
	declare password: string;

	@Column({
		type: DataType.ENUM(
			UserRole.ADMIN,
			UserRole.USER,
			UserRole.GUEST,
			UserRole.VENDOR
		),
	})
	declare role: UserRole;

	@Column({ type: DataType.FLOAT, defaultValue: 0.0 })
	declare points: number;

	@HasMany(() => Order)
	declare orders: Order[];

	@CreatedAt
	declare createdAt?: Date;

	@UpdatedAt
	declare updatedAt?: Date;

	@BeforeCreate
	static async hashPassword(instance: User) {
		if (instance.password) {
			instance.password = await bcrypt.hash(instance.password, 10);
		}
	}

	@BeforeUpdate
	static async hashPasswordOnUpdate(instance: User) {
		if (instance.changed("password")) {
			instance.password = await bcrypt.hash(instance.password, 10);
		}
	}

	SignAccessToken(): string {
		return jwt.sign(
			{
				id: this.id,
				role: this.role,
			},
			process.env.ACCESS_TOKEN_SECRET || "",
			{
				expiresIn: "1h",
			}
		);
	}

	SignRefreshToken(): string {
		return jwt.sign(
			{
				id: this.id,
				role: this.role,
			},
			process.env.REFRESH_TOKEN_SECRET || "",
			{
				expiresIn: "3d",
			}
		);
	}

	comparePassword = async (enteredPassword: string) => {
		return await bcrypt.compare(enteredPassword, this.password);
	};
}
