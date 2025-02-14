import { CreateUserParams } from "@/@types/user";
import sequelize from "@/db";
import User from "@/db/models/user";
import { BadRequestError, ConflictError, NotFoundError } from "@/utils/error";

export const findUserByID = async (id: string) => {
	const user = await User.findByPk(id);

	if (!user) throw new NotFoundError("User not found.");

	return user;
};

export const createUserData = async (userData: CreateUserParams) => {
	const t = await sequelize.transaction();
	const user = await User.create(
		{
			firstName: userData.firstName,
			lastName: userData.lastName,
			contactNumber: userData.contactNumber,
			email: userData.email,
			password: userData.password,
			age: userData.age,
			avatar: userData?.avatar || "",
			role: userData.role || "user",
		},
		{ transaction: t }
	);

	if (!user) {
		await t.rollback();
		throw new ConflictError("Failed to create user.");
	}

	await t.commit();

	return user;
};

export const login = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}) => {
	const user = await User.findOne({
		where: {
			email,
		},
	});

	if (!user) {
		throw new NotFoundError("User not found.");
	}

	const isPasswordMatch = await user.comparePassword(password);

	if (!isPasswordMatch) throw new BadRequestError("Invalid Credentials.");

	return user;
};
