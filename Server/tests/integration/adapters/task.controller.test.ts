import express from "express";
import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import { CreateTaskUseCase } from "../../../modules/task/application/create-task.usecase";
import { StartTaskUseCase } from "../../../modules/task/application/start-task.usecase";
import { FinishTaskUseCase } from "../../../modules/task/application/finish-task.usecase";
import { setupRoutes } from "../../../apps/api/routes/routes";
import request from "supertest";
import { UpdateTaskStatusUseCase } from "../../../modules/task/application/update-task-status.usecase";
import { ReorderTasksUseCase } from "../../../modules/task/application/reorder-task.usecase";

describe("TaskController Integration Tests", () => {
	let app: express.Express;
	let db: sqlite3.Database;

	beforeAll((done) => {
		app = express();
		app.use(express.json());

		db = new sqlite3.Database(":memory:");

		const schemaPath = path.resolve(
			__dirname,
			"../../../../Database/schema.sql",
		);
		const schema = fs.readFileSync(schemaPath, "utf-8");

		db.exec(schema, (err) => {
			if (err) console.error("Error creating schema:", err);
			setupRoutes(app, db);
			done();
		});
	});

	afterAll((done) => {
		db.close(done);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe("POST /api/v1/tasks", () => {
		it("should create a task and return 201 Created", async () => {
			const response = await request(app).post("/api/v1/tasks").send({
				planId: "plan-123",
				title: "Learn Integration Testing",
				priority: 5,
			});

			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("id");
			expect(response.body.title).toBe("Learn Integration Testing");
			expect(response.body.planId).toBe("plan-123");
			expect(response.body.status).toBe("PENDENTE");
			expect(response.body.priority).toBe(5);
		});

		it("should return 400 Bad Request if planId is missing", async () => {
			const response = await request(app).post("/api/v1/tasks").send({
				title: "Missing Plan ID",
			});

			expect(response.status).toBe(400);
			expect(response.body).toEqual({ error: "planId and title are required" });
		});

		it("should return 400 Bad Request if title is missing", async () => {
			const response = await request(app).post("/api/v1/tasks").send({
				planId: "plan-123",
			});

			expect(response.status).toBe(400);
			expect(response.body).toEqual({ error: "planId and title are required" });
		});

		it("should return 500 Internal Server Error if an exception occurs", async () => {
			const consoleSpy = jest
				.spyOn(console, "error")
				.mockImplementation(() => {});
			jest
				.spyOn(CreateTaskUseCase.prototype, "execute")
				.mockImplementation(() => {
					throw new Error("Unexpected database failure");
				});

			const response = await request(app).post("/api/v1/tasks").send({
				planId: "plan-123",
				title: "Force 500 Error",
			});

			expect(response.status).toBe(500);
			expect(response.body).toEqual({ error: "Internal server error" });
			expect(consoleSpy).toHaveBeenCalled();
		});
	});

	describe("PATCH /api/v1/tasks/:id/start", () => {
		it("should start a task and return 200 OK", async () => {
			const createRes = await request(app).post("/api/v1/tasks").send({
				planId: "plan-start",
				title: "Task to start",
				priority: 1,
			});
			const taskId = createRes.body.id;

			const response = await request(app).patch(
				`/api/v1/tasks/${taskId}/start`,
			);

			expect(response.status).toBe(200);
			expect(response.body.id).toBe(taskId);
			expect(response.body.status).toBe("FAZENDO");
		});

		it("should return 404 Not Found if task does not exist", async () => {
			const consoleSpy = jest
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const response = await request(app).patch(
				"/api/v1/tasks/id-invalido-123/start",
			);

			expect(response.status).toBe(404);
			expect(response.body).toEqual({ error: "Task not found" });
		});

		it("should return 500 Internal Server Error if an exception occurs", async () => {
			const consoleSpy = jest
				.spyOn(console, "error")
				.mockImplementation(() => {});
			jest
				.spyOn(StartTaskUseCase.prototype, "execute")
				.mockImplementation(() => {
					throw new Error("Unexpected failure");
				});

			const response = await request(app).patch("/api/v1/tasks/any-id/start");

			expect(response.status).toBe(500);
			expect(response.body).toEqual({ error: "Internal server error" });
			expect(consoleSpy).toHaveBeenCalled();
		});
	});

	describe("PATCH /api/v1/tasks/:id/finish", () => {
		it("should finish a task and return 200 OK", async () => {
			const createRes = await request(app).post("/api/v1/tasks").send({
				planId: "plan-finish",
				title: "Task to finish",
				priority: 1,
			});
			const taskId = createRes.body.id;

			const response = await request(app).patch(
				`/api/v1/tasks/${taskId}/finish`,
			);

			expect(response.status).toBe(200);
			expect(response.body.id).toBe(taskId);
			expect(response.body.status).toBe("FEITO");
		});

		it("should return 404 Not Found if task does not exist", async () => {
			const consoleSpy = jest
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const response = await request(app).patch(
				"/api/v1/tasks/id-invalido-123/finish",
			);

			expect(response.status).toBe(404);
			expect(response.body).toEqual({ error: "Task not found" });
		});

		it("should return 500 Internal Server Error if an exception occurs", async () => {
			const consoleSpy = jest
				.spyOn(console, "error")
				.mockImplementation(() => {});
			jest
				.spyOn(FinishTaskUseCase.prototype, "execute")
				.mockImplementation(() => {
					throw new Error("Unexpected failure");
				});

			const response = await request(app).patch("/api/v1/tasks/any-id/finish");

			expect(response.status).toBe(500);
			expect(response.body).toEqual({ error: "Internal server error" });
			expect(consoleSpy).toHaveBeenCalled();
		});
	});

	describe("PUT /api/v1/tasks/:id/status", () => {
		it("should update task status and return 200 OK", async () => {
			const createRes = await request(app).post("/api/v1/tasks").send({
				planId: "plan-status",
				title: "Status update test",
			});
			const taskId = createRes.body.id;

			const response = await request(app)
				.put(`/api/v1/tasks/${taskId}/status`)
				.send({ status: "FEITO" });

			expect(response.status).toBe(200);
			expect(response.body.status).toBe("FEITO");
		});

		it("should return 400 if status is missing", async () => {
			const response = await request(app)
				.put("/api/v1/tasks/any-id/status")
				.send({});

			expect(response.status).toBe(400);
			expect(response.body.error).toBe("Status is required");
		});

		it("should return 404 Not Found if task does not exist", async () => {
			const consoleSpy = jest
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const response = await request(app)
				.put("/api/v1/tasks/non-existent-id/status")
				.send({ status: "FAZENDO" });

			expect(response.status).toBe(404);
			expect(response.body).toEqual({ error: "Task not found" });
		});

		it("should return 500 Internal Server Error if an exception occurs", async () => {
			const consoleSpy = jest
				.spyOn(console, "error")
				.mockImplementation(() => {});
			jest
				.spyOn(UpdateTaskStatusUseCase.prototype, "execute")
				.mockImplementation(() => {
					throw new Error("Unexpected failure");
				});

			const response = await request(app)
				.put("/api/v1/tasks/any-id/status")
				.send({ status: "PENDENTE" });

			expect(response.status).toBe(500);
			expect(response.body).toEqual({ error: "Internal server error" });
			expect(consoleSpy).toHaveBeenCalled();
		});
	});

	describe("POST /api/v1/tasks/reorder", () => {
		it("should reorder tasks and return 204 No Content", async () => {
			
			const task1Res = await request(app).post("/api/v1/tasks").send({
				planId: "plan-reorder",
				title: "Task 1",
			});
			const task2Res = await request(app).post("/api/v1/tasks").send({
				planId: "plan-reorder",
				title: "Task 2",
			});

			const response = await request(app)
				.post("/api/v1/tasks/reorder")
				.send({
					planId: "plan-reorder",
					taskIdsInOrder: [task2Res.body.id, task1Res.body.id],
				});

			expect(response.status).toBe(204);
			expect(response.body).toEqual({});
		});

		it("should return 400 Bad Request if planId is missing", async () => {
			const response = await request(app)
				.post("/api/v1/tasks/reorder")
				.send({ taskIdsInOrder: ["task-1"] });

			expect(response.status).toBe(400);
			expect(response.body.error).toBe(
				"planId and taskIdsInOrder array are required",
			);
		});

		it("should return 400 Bad Request if taskIdsInOrder is not an array", async () => {
			const response = await request(app)
				.post("/api/v1/tasks/reorder")
				.send({ planId: "plan-123", taskIdsInOrder: "not-an-array" });

			expect(response.status).toBe(400);
			expect(response.body.error).toBe(
				"planId and taskIdsInOrder array are required",
			);
		});

		it("should return 500 Internal Server Error if an exception occurs", async () => {
			const consoleSpy = jest
				.spyOn(console, "error")
				.mockImplementation(() => {});
			jest
				.spyOn(ReorderTasksUseCase.prototype, "execute")
				.mockImplementation(() => {
					throw new Error("Unexpected failure");
				});

			const response = await request(app)
				.post("/api/v1/tasks/reorder")
				.send({ planId: "plan-123", taskIdsInOrder: ["task-1"] });

			expect(response.status).toBe(500);
			expect(response.body).toEqual({ error: "Internal server error" });
			expect(consoleSpy).toHaveBeenCalled();
		});
	});
});
