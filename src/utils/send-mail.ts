import nodemailer, { Transporter } from "nodemailer";
import path from "path";
import ejs from "ejs";
import "dotenv/config";

interface EmailOptions {
	email: string;
	subject: string;
	template: string;
	data: { [key: string]: any };
	attachments?: { filename: string; path: string; cid: string }[];
}

const sendMail = async (options: EmailOptions): Promise<void> => {
	const transporter: Transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: parseInt(process.env.SMTP_PORT || "587"),
		service: process.env.SMTP_SERVICE,
		auth: {
			user: process.env.MAIL,
			pass: process.env.MAILER_KEY,
		},
	});

	const { email, subject, template, data, attachments } = options;

	const templatePath = path.join(__dirname, "../mails", template);

	const html: string = await ejs.renderFile(templatePath, data);

	const mailOptions = {
		from: process.env.MAIL,
		to: email,
		subject,
		html,
		attachments,
	};

	await transporter.sendMail(mailOptions);
};

export default sendMail;
