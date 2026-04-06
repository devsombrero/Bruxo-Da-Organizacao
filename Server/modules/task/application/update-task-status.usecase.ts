import { Task } from "../domain/task.entity";
import { TaskRepository } from "../domain/task.repository";
import { UpdateTaskStatusInput } from "./input/task.input";

export class UpdateTaskStatusUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(input: UpdateTaskStatusInput): Promise<Task> {
		const task = await this.taskRepository.findById(input.taskId);

		if (!task) {
			throw new Error("Task not found");
		}
		
		task.status = input.status;

		await this.taskRepository.update(task);

		return task;
	}
}
