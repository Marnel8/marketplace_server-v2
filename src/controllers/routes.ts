import usersRoutes from "./user/routes";
import productRoutes from "./product/routes";
import vendorRoutes from "./vendor/routes";
import orderRoutes from "./order/routes";

export const routes = [
	usersRoutes,
	productRoutes,
	vendorRoutes,
	orderRoutes,
] as const;

export type AppRoutes = (typeof routes)[number];
