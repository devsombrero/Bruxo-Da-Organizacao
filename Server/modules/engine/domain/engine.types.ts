import { Task } from "../../task/domain/task.entity";

export type EngineResult = {
	orderedTasks: Task[];
	nextTask: Task | null;
};
