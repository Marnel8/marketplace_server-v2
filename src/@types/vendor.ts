import { BusinessType } from "@/db/enums/vendor";

export interface ICreateVendor {
	businessName: string;
	businessDescription: string;
	businessType: BusinessType;
	businessAddress: string;
	banner?: string;
	logo?: string;
	validId?: string;
	ownerId: string;
}
