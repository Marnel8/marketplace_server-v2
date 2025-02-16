import { ICreateVendor } from "@/@types/vendor";
import sequelize from "@/db";
import User, { UserRole } from "@/db/models/user";
import Vendor from "@/db/models/vendor";
import { ConflictError, NotFoundError } from "@/utils/error";

export const findVendorByOwnerID = async (id: string) => {
	const vendor = await Vendor.findOne({
		where: { ownerId: id },
		include: [{ model: User }],
	});

	if (!vendor) throw new NotFoundError("Vendor not found.");

	return vendor;
};

export const createVendorData = async (vendorData: ICreateVendor) => {
	const t = await sequelize.transaction();

	const user = await User.findByPk(vendorData.ownerId);

	if (!user) {
		throw new NotFoundError("User not found.");
	}

	const vendor = await Vendor.create(
		{
			businessName: vendorData.businessName,
			businessType: vendorData.businessType,
			businessDescription: vendorData.businessDescription,
			businessAddress: vendorData.businessAddress,
			banner: vendorData.banner,
			logo: vendorData.logo,
			validId: vendorData.validId,
			ownerId: vendorData.ownerId,
		},
		{ transaction: t }
	);

	if (!vendor) {
		await t.rollback();
		throw new ConflictError("Failed to create vendor.");
	}

	const updatedUser = await user.update(
		{ role: UserRole.VENDOR },
		{ transaction: t }
	);

	if (!updatedUser) {
		await t.rollback();
		throw new ConflictError("Failed to update user role.");
	}

	await t.commit();

	return vendor;
};

export const getAllVendorsData = async () => {
	const vendors = await Vendor.findAll({ include: [{ model: User }] });

	return vendors;
};

export const verifyVendorData = async (
	id: string,
	reason: string,
	newStatus: string
) => {
	const vendor = await Vendor.findByPk(id, { include: [{ model: User }] });

	if (!vendor) {
		throw new NotFoundError("Vendor not found.");
	}

	await vendor.update({ isVerified: newStatus });

	return vendor;
};

export const deleteVendorData = async (id: string) => {
	const t = await sequelize.transaction();

	const deletedVendor = await Vendor.destroy({ where: { id } });

	return deletedVendor;
};
