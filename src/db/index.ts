import { Sequelize } from "sequelize-typescript";
import "dotenv/config";
import colors from "colors";

import User from "./models/user";
import Order from "./models/order";
import Product from "./models/product";
import Image from "./models/images";
import Cart from "./models/cart";
import Vendor from "./models/vendor";
import Variant from "./models/variants";
const sequelize = new Sequelize({
	database: process.env.DB_NAME,
	dialect: "mysql",
	username: process.env.DB_USER,
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	models: [User, Order, Product, Image, Cart, Vendor, Variant],
	password: process.env.DB_PASSWORD,
});

sequelize
	.authenticate()
	.then(() => {
		console.log(
			colors.green(`Connected to the database: ${process.env.DB_NAME}`)
		);
	})
	.catch((error) => {
		console.error(colors.red("Unable to connect to the database:"), error);
	});

sequelize
	.sync({ alter: true })
	.then(() => {
		console.log(colors.green("Database synchronized successfully."));
	})
	.catch((error) => {
		console.error(colors.red("Error synchronizing the database:"), error);
	});

export default sequelize;
