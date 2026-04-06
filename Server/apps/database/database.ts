import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";

export function initDatabase(): Promise<sqlite3.Database> {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database("./database.sqlite", (err) => {
			if (err) {
				console.error("Error opening database:", err.message);
				return reject(err);
			}

			const schemaPath = path.resolve(__dirname, "../../../Database/schema.sql");
			const schema = fs.readFileSync(schemaPath, "utf-8");

			db.exec(schema, (err) => {
				if (err) {
					console.error("Error executing schema.sql:", err.message);
					return reject(err);
				}

				console.log("Database initialized successfully!");
				resolve(db);
			});
		});
	});
}
