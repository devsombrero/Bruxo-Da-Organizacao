import { Task } from "../../../modules/task/domain/task.entity";

describe("Task Entity", () => {
	it("should start a task", () => {
		const task = new Task("1", "1", "Test");

		task.start();

		expect(task.status).toBe("FAZENDO");
	});

	it("should finish a task", () => {
		const task = new Task("1", "1", "Test");

		task.finish();

		expect(task.status).toBe("FEITO");
	});

	it("should NOT start task if status is not PENDENTE", () => {
		const task = new Task("1", "1", "Test", "FAZENDO");

		task.start();

		expect(task.status).toBe("FAZENDO");
	});
});
