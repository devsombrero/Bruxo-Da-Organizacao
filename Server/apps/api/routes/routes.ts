import { Express } from "express";
import sqlite3 from "sqlite3";
import { SqliteTaskRepository } from "../../../modules/task/adapters/sqlite-task.repository";
import { CreateTaskUseCase } from "../../../modules/task/application/create-task.usecase";
import { TaskController } from "../../../modules/task/adapters/task.controller";
import { StartTaskUseCase } from "../../../modules/task/application/start-task.usecase";
import { FinishTaskUseCase } from "../../../modules/task/application/finish-task.usecase";
import { UpdateTaskStatusUseCase } from "../../../modules/task/application/update-task-status.usecase";
import { ReorderTasksUseCase } from "../../../modules/task/application/reorder-task.usecase";

export function setupRoutes(app: Express, db: sqlite3.Database) {
	// 1. Dependency Injection (Wiring layers)
	const taskRepository = new SqliteTaskRepository(db);
	const createTaskUseCase = new CreateTaskUseCase(taskRepository);
	const startTaskUseCase = new StartTaskUseCase(taskRepository);
	const finishTaskUseCase = new FinishTaskUseCase(taskRepository);
	const updateTaskStatusUseCase = new UpdateTaskStatusUseCase(taskRepository);
	const reorderTasksUseCase = new ReorderTasksUseCase(taskRepository);

	const taskController = new TaskController(
		createTaskUseCase,
		startTaskUseCase, 
		finishTaskUseCase, 
		updateTaskStatusUseCase, 
		reorderTasksUseCase
	);

	// 2. Routes
	app.post("/api/v1/tasks", taskController.create.bind(taskController));
	app.patch(
		"/api/v1/tasks/:id/start",
		taskController.start.bind(taskController),
	);
	app.patch(
		"/api/v1/tasks/:id/finish",
		taskController.finish.bind(taskController),
	);

	app.put(
		"/api/v1/tasks/:id/status",
		taskController.updateStatus.bind(taskController),
	);

	app.post(
		"/api/v1/tasks/reorder",
		taskController.reorder.bind(taskController),
	);
}
