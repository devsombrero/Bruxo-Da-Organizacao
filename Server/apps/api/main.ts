import express from "express";
import cors from "cors";
import { initDatabase } from "../database/database";
import { setupRoutes } from "./routes/routes";

async function bootstrap() {
	const app = express();
	const port = 3000;

	app.use(cors());
	app.use(express.json());

	try {
		const db = await initDatabase();

		setupRoutes(app, db);

		app.listen(port, () => {
			console.log(`Bruxo-Da-Organizacao is running on http://localhost:${port}`);
		});
	} catch (error) {
		console.error("Failed to start the server:", error);
		process.exit(1);
	}
}

bootstrap();
