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