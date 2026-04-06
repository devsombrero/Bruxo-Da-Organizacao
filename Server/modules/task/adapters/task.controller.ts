import { Request, Response } from "express";
import { CreateTaskUseCase } from "../application/create-task.usecase";
import { StartTaskUseCase } from "../application/start-task.usecase";
import { FinishTaskUseCase } from "../application/finish-task.usecase";

export class TaskController {
	constructor(
		private readonly createTaskUseCase: CreateTaskUseCase,
		private readonly startTaskUseCase: StartTaskUseCase,
		private readonly finishTaskUseCase: FinishTaskUseCase,
	) {}

	async create(req: Request, res: Response): Promise<Response> {
		try {
			const { planId, title, priority } = req.body;

			if (!planId || !title) {
				return res.status(400).json({ error: "planId and title are required" });
			}

			const task = this.createTaskUseCase.execute({
				planId,
				title,
				priority,
			});

			return res.status(201).json(task);
		} catch (error) {
			console.error("Error creating task:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	}

	async start(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;

			const task = await this.startTaskUseCase.execute({
				taskId: id as string,
			});

			return res.status(200).json(task);
		} catch (error: any) {
			console.error("Error starting task:", error);

			if (error.message === "Task not found") {
				return res.status(404).json({ error: error.message });
			}

			return res.status(500).json({ error: "Internal server error" });
		}
	}

	async finish(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;

			const task = await this.finishTaskUseCase.execute({
				taskId: id as string,
			});

			return res.status(200).json(task);
		} catch (error: any) {
			console.error("Error finishing task:", error);

			if (error.message === "Task not found") {
				return res.status(404).json({ error: error.message });
			}

			return res.status(500).json({ error: "Internal server error" });
		}
	}
}
