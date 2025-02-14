import Vendor from "@/db/models/vendor";
import { NotFoundError } from "@/utils/error";

export const findVendorByOwnerID = async (id: string) => {
	const vendor = await Vendor.findOne({ where: { ownerId: id } });

	if (!vendor) throw new NotFoundError("Vendor not found.");

	return vendor;
};
