import { Task } from "./task.entity";

export interface TaskRepository {
	save(task: Task): void | Promise<void>;
	findById(id: string): Promise<Task | null> | Task | null;
	update(task: Task): void | Promise<void>;
}
