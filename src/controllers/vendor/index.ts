import {
	createVendorData,
	deleteVendorData,
	findVendorByOwnerID,
	getAllVendorsData,
	verifyVendorData,
} from "@/data/vendor";
import { BusinessType } from "@/db/enums/vendor";
import { VerificationStatus } from "@/db/enums/verification";
import { BadRequestError } from "@/utils/error";
import sendMail from "@/utils/send-mail";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";

export const createVendorController = async (req: Request, res: Response) => {
	const ownerId = req.user.id;

	const { businessName, businessType, businessDescription, businessAddress } =
		req.body;

	const files = req.files as MulterFiles;

	const banner = files?.banner?.[0] || null;
	const logo = files?.logo?.[0] || null;
	const validId = files?.validId?.[0] || null;

	if (!Object.values(BusinessType).includes(businessType)) {
		throw new BadRequestError("Invalid business type");
	}

	const vendorData = {
		businessName,
		businessType,
		businessDescription,
		businessAddress,
		banner: banner?.filename,
		logo: logo?.filename,
		validId: validId?.filename,
		ownerId,
	};

	await createVendorData(vendorData);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Vendor created successfully",
	});
};

export const getVendorInfoController = async (req: Request, res: Response) => {
	const userId = req.user.id;

	const vendor = await findVendorByOwnerID(userId);

	res.status(StatusCodes.OK).json(vendor);
};

export const getAllVendorsController = async (req: Request, res: Response) => {
	const vendors = await getAllVendorsData();

	res.status(StatusCodes.OK).json(vendors);
};

export const verifyVendorController = async (req: Request, res: Response) => {
	const { id } = req.params;

	const { reason, newStatus } = req.body;

	if (!Object.values(VerificationStatus).includes(newStatus)) {
		throw new BadRequestError("Invalid verification status");
	}

	const vendor = await verifyVendorData(id, reason, newStatus as string);

	await sendMail({
		email: vendor.owner.email,
		subject: "Verification Status",
		template: "verification-update.ejs",
		data: {
			vendor: {
				owner: { name: vendor.owner.firstName },
				shopName: vendor.businessName,
			},
			newStatus,
			reason,
		},
		attachments: [
			{
				filename: "logo.png",
				path: path.join(__dirname, "../../assets/logo.png"),
				cid: "logo",
			},
		],
	});

	res.status(StatusCodes.OK).json(vendor);
};

export const deleteVendorController = async (req: Request, res: Response) => {
	const { id } = req.params;

	await deleteVendorData(id);

	res.status(StatusCodes.OK).json({ message: "Vendor deleted successfully." });
};
