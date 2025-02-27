import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/db/models/user";
import "dotenv/config";
import {
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
} from "@/utils/error";
import Vendor from "@/db/models/vendor";
import { VerificationStatus } from "@/db/enums/verification";

// Authenticated Users
export const isAuthenticated = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const access_token = req?.cookies.access_token as string;

	if (!access_token) {
		throw new UnauthorizedError("Please login to access this resource.");
	}

	const decoded = jwt.verify(
		access_token,
		process.env.ACCESS_TOKEN_SECRET || ""
	) as JwtPayload;

	if (!decoded) throw new UnauthorizedError("Invalid token");

	const user = await User.findOne({ where: { id: decoded.id } });

	if (!user) {
		throw new NotFoundError("User not found.");
	}

	req.user = user;

	next();
};

export const isVerifiedVendor = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user;
	const vendor = await Vendor.findOne({
		where: {
			ownerId: req.user.id,
		},
	});

	if (
		user.role === "vendor" &&
		vendor?.isVerified !== VerificationStatus.VERIFIED
	) {
		throw new UnauthorizedError("Vendor not verified");
	}

	next();
};

// Validate user roles
export const authorizeRoles = (...roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(req?.user.role || "")) {
			throw new ForbiddenError(
				`Role: ${req.user?.role} is not allowed to access this resource`
			);
		}
		next();
	};
};
