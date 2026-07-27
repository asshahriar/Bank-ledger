import mongoose from "mongoose";

function connectToDB() {
	mongoose
		.connect(process.env.MONGO_URI)
		.then(() => {
			console.log("Server is Connected to DB");
		})
		.catch((error) => {
			console.log("Error connecting DB to the server", error);
			process.exit(1);
		});
}

export default connectToDB;
