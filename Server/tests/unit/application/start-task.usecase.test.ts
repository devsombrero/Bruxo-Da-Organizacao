import { TaskRepository } from "../../../modules/task/domain/task.repository";
import { Task } from "../../../modules/task/domain/task.entity";
import { StartTaskUseCase } from "../../../modules/task/application/start-task.usecase";

describe("StartTaskUseCase", () => {
	it("should find a pending task, start it, and save the update", async () => {
		const existingTask = new Task(
			"task-123",
			"plan-456",
			"Estudar TDD",
			"PENDENTE",
			1,
		);

		const mockRepository: TaskRepository = {
			save: jest.fn(),
			findById: jest.fn().mockResolvedValue(existingTask),
			update: jest.fn().mockResolvedValue(void 0),
		};

		const useCase = new StartTaskUseCase(mockRepository);

		const result = await useCase.execute({ taskId: "task-123" });

		expect(mockRepository.findById).toHaveBeenCalledWith("task-123");
		expect(result.status).toBe("FAZENDO");
		expect(mockRepository.update).toHaveBeenCalledWith(existingTask);
	});

	it("should throw an error if the task is not found", async () => {
		const mockRepository: TaskRepository = {
			save: jest.fn(),
			findById: jest.fn().mockResolvedValue(null),
			update: jest.fn(),
		};

		const useCase = new StartTaskUseCase(mockRepository);

		await expect(
			useCase.execute({ taskId: "task-inexistente" }),
		).rejects.toThrow("Task not found");
	});
});
