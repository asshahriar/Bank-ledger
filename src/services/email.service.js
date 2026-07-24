import dotenv from "dotenv"
import nodemailer from "nodemailer"

dotenv.config()

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		type: "OAuth2",
		user: process.env.EMAIL_USER,
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		refreshToken: process.env.REFRESH_TOKEN,
	},
});

// Verify the connection configuration
transporter.verify((error, success) => {
	if (error) {
		console.error("Error connecting to email server:", error);
	} else {
		console.log("Email server is ready to send messages");
	}
});

const sendEmail = async (to, subject, text, html) => {
	try {
		const info = await transporter.sendMail({
			from: `"Bank-ledger" <${process.env.EMAIL_USER}>`, // sender address
			to, // list of receivers
			subject, // Subject line
			text, // plain text body
			html, // html body
		});

		console.log("Message sent: %s", info.messageId);
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
	} catch (error) {
		console.error("Error sending email:", error);
	}
};


async function sendRegisterationEmail(userEmail, name) {
	const subject = "Welcome to bank-ledger";
	const text = `Hello ${name}, \n\nThank You for registering at Backend Ledger. We Are excited to see you!`;
	const html = `<p>Hello ${name}</p><p>Thank You for registering at bank ledger</p>`

	await sendEmail(userEmail, subject, text, html)
}

export default {sendRegisterationEmail};


