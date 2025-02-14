import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import colors from "colors";
import path from "path";
import "dotenv/config";
import errorHandlerMiddleware from "./middlewares/error-handler";
import { routes } from "./controllers/routes";

import "./db";

const app = express();

const PORT = process.env.PORT || 5001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

app.use(cookieParser());

app.set("trust proxy", 1);

app.use(
	cors({
		origin:
			process.env.NODE_ENV === "development"
				? "*"
				: [
						"https://atlas.batstate-u.edu.ph:6969",
						"https://atlas.batstate-u.edu.ph:3071",
						"https://atlas.batstate-u.edu.ph:3072",
				  ],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
	})
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

routes.forEach((route) => {
	app.use("/api/v1", route);
});

app.listen(PORT, () => {
	console.log(colors.cyan(`Trioe Server running on port: ${PORT}`));
});

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		success: true,
		message: "API is working",
	});
});

app.use((req: Request, res: Response, next: NextFunction) => {
	const err = new Error(`Route ${req.originalUrl} not found`) as any;
	err.statusCode = 404;
	next(err);
});
app.use(errorHandlerMiddleware);
