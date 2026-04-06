import { Task } from "../domain/task.entity";
import { TaskRepository } from "../domain/task.repository";
import { StartTaskInput } from "./input/task.input";

export class StartTaskUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(input: StartTaskInput): Promise<Task> {
		const task = await this.taskRepository.findById(input.taskId);

		if (!task) {
			throw new Error("Task not found");
		}

		task.start();

		await this.taskRepository.update(task);

		return task;
	}
}
