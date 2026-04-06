import { Task } from "./task.entity";

export interface TaskRepository {
	save(task: Task): void | Promise<void>;
}
