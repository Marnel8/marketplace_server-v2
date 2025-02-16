import { UserRole } from "@/db/models/user";
import {
	authorizeRoles,
	isAuthenticated,
	isVerifiedVendor,
} from "@/middlewares/auth";
import { Router } from "express";
import {
	createProductController,
	deleteProductController,
	getProductsByOwnerController,
	getProductsController,
	getVerifiedProductsController,
	updateProductController,
} from ".";
import upload from "@/utils/uploader";

const router = Router();

router.post(
	"/product/",

	isAuthenticated,
	authorizeRoles(UserRole.VENDOR),
	// isVerifiedVendor,
	upload.fields([
		{ name: "thumbnail", maxCount: 1 },
		{ name: "variantImages", maxCount: 10 },
	]),
	createProductController
);

router.put(
	"/product/:id",
	isAuthenticated,
	authorizeRoles(UserRole.VENDOR),
	isVerifiedVendor,
	upload.fields([
		{ name: "thumbnail", maxCount: 1 },
		{ name: "variantImages", maxCount: 10 },
	]),
	updateProductController
);

router.delete(
	"/product/:id",
	isAuthenticated,
	authorizeRoles(UserRole.VENDOR, UserRole.ADMIN),
	isVerifiedVendor,
	deleteProductController
);

router.get("/product/", getProductsController);
router.get(
	"/product/vendor-products",
	isAuthenticated,
	authorizeRoles(UserRole.VENDOR, UserRole.ADMIN),
	// isVerifiedVendor,
	getProductsByOwnerController
);
router.get("/product/verified-products", getVerifiedProductsController);

export default router;
