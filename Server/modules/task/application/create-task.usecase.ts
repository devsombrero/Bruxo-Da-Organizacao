import { generateId } from "../../../shared/utils/id-generator";
import { Task } from "../domain/task.entity";
import { TaskRepository } from "../domain/task.repository";
import { CreateTaskInput } from "./input/task.input";

export class CreateTaskUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	execute(input: CreateTaskInput): Task {
		const generatedId = generateId();

		const task = new Task(
			generatedId,
			input.planId,
			input.title,
			"PENDENTE",
			input.priority || 0,
		);

		this.taskRepository.save(task);

		return task;
	}
}