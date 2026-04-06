import { TaskStatus } from "../../domain/task.types";

export type CreateTaskInput = {
	planId: string;
	title: string;
	priority?: number;
};

export type StartTaskInput = {
	taskId: string;
};

export type FinishTaskInput = {
	taskId: string;
};

export type UpdateTaskStatusInput = {
	taskId: string;
	status: TaskStatus;
};

export type ReorderTasksInput = {
	planId: string;
	taskIdsInOrder: string[];
};