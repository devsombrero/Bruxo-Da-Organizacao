import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import { Task } from "../../../modules/task/domain/task.entity";
import { SqliteTaskRepository } from "../../../modules/task/adapters/sqlite-task.repository";

describe("SqliteTaskRepository", () => {
	let db: sqlite3.Database;
	let repository: SqliteTaskRepository;

	beforeAll((done) => {
		db = new sqlite3.Database(":memory:");

		const schemaPath = path.resolve(
			__dirname,
			"../../../../Database/schema.sql",
		);

		const schema = fs.readFileSync(schemaPath, "utf-8");

		db.exec(schema, (err) => {
			if (err) console.error("Error creating schema:", err);
			done();
		});
	});

	afterAll((done) => {
		db.close(done);
	});

	beforeEach(() => {
		repository = new SqliteTaskRepository(db);
	});

	it("should save a task in the SQLite database", (done) => {
		const task = new Task(
			"task-123",
			"plan-456",
			"Study SQLite",
			"PENDENTE",
			1,
		);

		repository.save(task);

		setTimeout(() => {
			db.get(
				"SELECT * FROM tasks WHERE id = ?",
				["task-123"],
				(err, row: any) => {
					expect(err).toBeNull();
					expect(row).toBeDefined();
					expect(row.id).toBe("task-123");
					expect(row.title).toBe("Study SQLite");
					done();
				},
			);
		}, 50);
	});

	it("should log an error to the console if saving fails (e.g., duplicate ID)", (done) => {
		const consoleSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});

		const task = new Task(
			"duplicate-task-123",
			"plan-456",
			"Force SQLite Error",
			"PENDENTE",
			1,
		);

		repository.save(task);

		setTimeout(() => {
			repository.save(task);

			setTimeout(() => {
				expect(consoleSpy).toHaveBeenCalled();
				consoleSpy.mockRestore();
				done();
			}, 50);
		}, 50);
	});
});
