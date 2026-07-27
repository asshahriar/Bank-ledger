import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	requireTLS: true,

	family: 4,

	auth: {
		type: "OAuth2",
		user: process.env.EMAIL_USER,
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		refreshToken: process.env.REFRESH_TOKEN,
	},
});

transporter.verify((error, success) => {
	if (error) {
		console.error("❌ Email server connection failed:");
		console.error(error);
	} else {
		console.log("✅ Email server is ready");
	}
});

const sendEmail = async (to, subject, text, html) => {
	try {
		const info = await transporter.sendMail({
			from: `"Backend Ledger" <${process.env.EMAIL_USER}>`,
			to,
			subject,
			text,
			html,
		});

		console.log("✅ Email sent successfully");
		console.log("Message ID:", info.messageId);

		return info;
	} catch (error) {
		console.error("❌ Error sending email:");
		console.error(error);

		throw error;
	}
};

async function sendRegistrationEmail(userEmail, name) {
	const subject = "Welcome to Backend Ledger!";

	const text = `Hello ${name},

Thank you for registering at Backend Ledger.
We're excited to have you on board!

Best regards,
The Backend Ledger Team`;

	const html = `
		<p>Hello ${name},</p>
		<p>
			Thank you for registering at <strong>Backend Ledger</strong>.
			We're excited to have you on board!
		</p>
		<p>
			Best regards,<br>
			The Backend Ledger Team
		</p>
	`;

	return await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
	const subject = "Transaction Successful!";

	const text = `Hello ${name},

Your transaction of $${amount} to account ${toAccount} was successful.

Best regards,
The Backend Ledger Team`;

	const html = `
		<p>Hello ${name},</p>
		<p>
			Your transaction of <strong>$${amount}</strong>
			to account <strong>${toAccount}</strong> was successful.
		</p>
		<p>
			Best regards,<br>
			The Backend Ledger Team
		</p>
	`;

	return await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
	const subject = "Transaction Failed";

	const text = `Hello ${name},

Your transaction of $${amount} to account ${toAccount} has failed.

Please try again later.

Best regards,
The Backend Ledger Team`;

	const html = `
		<p>Hello ${name},</p>
		<p>
			We regret to inform you that your transaction of
			<strong>$${amount}</strong> to account
			<strong>${toAccount}</strong> has failed.
		</p>
		<p>Please try again later.</p>
		<p>
			Best regards,<br>
			The Backend Ledger Team
		</p>
	`;

	return await sendEmail(userEmail, subject, text, html);
}

export default {
	sendRegistrationEmail,
	sendTransactionEmail,
	sendTransactionFailureEmail,
};
