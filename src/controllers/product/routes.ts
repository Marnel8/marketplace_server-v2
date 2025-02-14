import { UserRole } from "@/db/models/user";
import {
	authorizeRoles,
	isAuthenticated,
	isVerifiedVendor,
} from "@/middlewares/auth";
import { Router } from "express";
import { createProductController } from ".";
import upload from "@/utils/uploader";

const router = Router();

router.post(
	"/product/",
	upload.fields([
		{ name: "thumbnail", maxCount: 1 },
		{ name: "variantImages", maxCount: 10 },
	]),
	isAuthenticated,
	authorizeRoles(UserRole.VENDOR),
	isVerifiedVendor,
	createProductController
);
