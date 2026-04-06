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

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe("save", () => {
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
					done();
				}, 50);
			}, 50);
		});
	});

	describe("findById", () => {
		it("should return a task if it exists", async () => {
			const task = new Task("find-123", "plan-456", "Find Me", "PENDENTE", 2);
			await new Promise<void>((resolve) => {
				db.run(
					"INSERT INTO tasks (id, planId, title, status, priority) VALUES (?, ?, ?, ?, ?)",
					[task.id, task.planId, task.title, task.status, task.priority],
					() => resolve(),
				);
			});

			const result = await repository.findById("find-123");

			expect(result).toBeDefined();
			expect(result?.id).toBe("find-123");
			expect(result?.title).toBe("Find Me");
			expect(result).toBeInstanceOf(Task);
		});

		it("should return null if task is not found", async () => {
			const result = await repository.findById("does-not-exist");
			expect(result).toBeNull();
		});

		it("should log and reject if there is a database error during findById", async () => {
			const consoleSpy = jest
				.spyOn(console, "error")
				.mockImplementation(() => {});

			jest
				.spyOn(db, "get")
				.mockImplementationOnce((query, params, callback: any) => {
					callback(new Error("Fake DB Error"));
					return db;
				});

			await expect(repository.findById("error-id")).rejects.toThrow(
				"Fake DB Error",
			);
			expect(consoleSpy).toHaveBeenCalled();
		});
	});

	describe("update", () => {
		it("should update an existing task successfully", async () => {
			const task = new Task(
				"update-123",
				"plan-456",
				"Old Title",
				"PENDENTE",
				1,
			);
			await new Promise<void>((resolve) => {
				db.run(
					"INSERT INTO tasks (id, planId, title, status, priority) VALUES (?, ?, ?, ?, ?)",
					[task.id, task.planId, task.title, task.status, task.priority],
					() => resolve(),
				);
			});

			task.title = "New Title";
			task.status = "FAZENDO";
			await repository.update(task);

			const row: any = await new Promise((resolve) => {
				db.get("SELECT * FROM tasks WHERE id = ?", ["update-123"], (err, row) =>
					resolve(row),
				);
			});

			expect(row.title).toBe("New Title");
			expect(row.status).toBe("FAZENDO");
		});

		it("should log and reject if there is a database error during update", async () => {
			const consoleSpy = jest
				.spyOn(console, "error")
				.mockImplementation(() => {});
			const task = new Task(
				"update-error-123",
				"plan-456",
				"Title",
				"PENDENTE",
				1,
			);

			jest
				.spyOn(db, "run")
				.mockImplementationOnce((query, params, callback: any) => {
					callback(new Error("Fake DB Update Error"));
					return db;
				});

			await expect(repository.update(task)).rejects.toThrow(
				"Fake DB Update Error",
			);
			expect(consoleSpy).toHaveBeenCalled();
		});
	});

	describe("findManyByPlanId", () => {
		it("should return an array of tasks ordered by priority ascending", async () => {
			const planId = "plan-order-123";
			const task1 = new Task("t-1", planId, "T1", "PENDENTE", 5);
			const task2 = new Task("t-2", planId, "T2", "PENDENTE", 1);
			const task3 = new Task("t-3", planId, "T3", "PENDENTE", 3);
			const taskOtherPlan = new Task(
				"t-other",
				"other-plan",
				"Other",
				"PENDENTE",
				0,
			);

			await new Promise<void>((resolve) => {
				const insert =
					"INSERT INTO tasks (id, planId, title, status, priority) VALUES (?, ?, ?, ?, ?)";
				db.serialize(() => {
					db.run(insert, [
						task1.id,
						task1.planId,
						task1.title,
						task1.status,
						task1.priority,
					]);
					db.run(insert, [
						task2.id,
						task2.planId,
						task2.title,
						task2.status,
						task2.priority,
					]);
					db.run(insert, [
						task3.id,
						task3.planId,
						task3.title,
						task3.status,
						task3.priority,
					]);
					db.run(
						insert,
						[
							taskOtherPlan.id,
							taskOtherPlan.planId,
							taskOtherPlan.title,
							taskOtherPlan.status,
							taskOtherPlan.priority,
						],
						() => resolve(),
					);
				});
			});

			const results = await repository.findManyByPlanId(planId);

			expect(results).toHaveLength(3);
			expect(results[0].id).toBe("t-2");
			expect(results[1].id).toBe("t-3");
			expect(results[2].id).toBe("t-1");
			expect(results[0]).toBeInstanceOf(Task);
		});

		it("should return an empty array if no tasks are found for the planId", async () => {
			const results = await repository.findManyByPlanId("empty-plan");
			expect(results).toEqual([]);
		});

		it("should log and reject if there is a database error during findManyByPlanId", async () => {
			const consoleSpy = jest
				.spyOn(console, "error")
				.mockImplementation(() => {});

			jest
				.spyOn(db, "all")
				.mockImplementationOnce((query, params, callback: any) => {
					callback(new Error("Fake DB findMany Error"));
					return db;
				});

			await expect(repository.findManyByPlanId("error-plan")).rejects.toThrow(
				"Fake DB findMany Error",
			);
			expect(consoleSpy).toHaveBeenCalled();
		});
	});
});
