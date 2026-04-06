import { TaskStatus } from "./task.types";

export class Task {
	constructor(
		public id: string,
		public planId: string,
		public title: string,
		public status: TaskStatus = 'PENDENTE',
		public priority: number = 0
	) {}

	start() {
		if(this.status === 'PENDENTE') {
			this.status = 'FAZENDO';
		}
	}

	finish() {
		this.status = 'FEITO';
	}
}