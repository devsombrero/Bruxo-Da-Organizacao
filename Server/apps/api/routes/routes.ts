import { Express } from "express";
import sqlite3 from "sqlite3";
import { SqliteTaskRepository } from "../../../modules/task/adapters/sqlite-task.repository";
import { CreateTaskUseCase } from "../../../modules/task/application/create-task.usecase";
import { TaskController } from "../../../modules/task/adapters/task.controller";

export function setupRoutes(app: Express, db: sqlite3.Database) {
	// 1. Dependency Injection (Wiring layers)
	const taskRepository = new SqliteTaskRepository(db);
	const createTaskUseCase = new CreateTaskUseCase(taskRepository);
	const taskController = new TaskController(createTaskUseCase);

	// 2. Routes
	app.post("/api/v1/tasks", taskController.create.bind(taskController));
}
