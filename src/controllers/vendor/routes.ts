import { Router } from "express";
import {
	createVendorController,
	deleteVendorController,
	getAllVendorsController,
	getVendorInfoController,
	verifyVendorController,
} from ".";
import { authorizeRoles, isAuthenticated } from "@/middlewares/auth";
import { UserRole } from "@/db/models/user";

const router = Router();

router.post("/vendor/", isAuthenticated, createVendorController);

router.put(
	"/vendor/verify/:id",
	isAuthenticated,
	authorizeRoles(UserRole.ADMIN),
	verifyVendorController
);

router.get(
	"/vendor/",
	isAuthenticated,
	authorizeRoles(UserRole.ADMIN),
	getAllVendorsController
);

router.get("/vendor/info", isAuthenticated, getVendorInfoController);

router.delete(
	"/vendor/:id",
	isAuthenticated,
	authorizeRoles(UserRole.ADMIN),
	deleteVendorController
);

export default router;
