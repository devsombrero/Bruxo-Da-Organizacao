import { Task } from "../domain/task.entity";
import { TaskRepository } from "../domain/task.repository";
import { FinishTaskInput } from "./input/task.input";

export class FinishTaskUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(input: FinishTaskInput): Promise<Task> {
		const task = await this.taskRepository.findById(input.taskId);

		if (!task) {
			throw new Error("Task not found");
		}

		task.finish();

		await this.taskRepository.update(task);

		return task;
	}
}
