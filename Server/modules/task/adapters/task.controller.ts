import { Request, Response } from "express";
import { CreateTaskUseCase } from "../application/create-task.usecase";

export class TaskController {
	constructor(private readonly createTaskUseCase: CreateTaskUseCase) {}

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
}