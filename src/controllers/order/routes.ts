import { isAuthenticated } from "@/middlewares/auth";
import { Router } from "express";
import { createOrderController } from ".";

const router = Router();

router.post("/order/", isAuthenticated, createOrderController);

export default router;
