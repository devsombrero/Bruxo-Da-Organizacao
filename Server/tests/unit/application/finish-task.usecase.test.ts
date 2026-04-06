import { TaskRepository } from "../../../modules/task/domain/task.repository";
import { Task } from "../../../modules/task/domain/task.entity";
import { FinishTaskUseCase } from "../../../modules/task/application/finish-task.usecase";

describe("FinishTaskUseCase", () => {
	let mockRepository: TaskRepository;
	let useCase: FinishTaskUseCase;

	beforeEach(() => {
		mockRepository = {
			save: jest.fn(),
			findById: jest.fn(),
			update: jest.fn(),
			findManyByPlanId: jest.fn(),
		};
		useCase = new FinishTaskUseCase(mockRepository);
	});

	it("should find a task, finish it, and save the update", async () => {
		const existingTask = new Task(
			"task-123",
			"plan-456",
			"Finalizar TDD",
			"FAZENDO",
			1,
		);

		(mockRepository.findById as jest.Mock).mockResolvedValue(existingTask);
		const result = await useCase.execute({ taskId: "task-123" });

		expect(mockRepository.findById).toHaveBeenCalledWith("task-123");
		expect(result.status).toBe("FEITO");
		expect(mockRepository.update).toHaveBeenCalledWith(existingTask);
	});

	it("should throw an error if the task is not found", async () => {
		(mockRepository.findById as jest.Mock).mockResolvedValue(null);
		await expect(
			useCase.execute({ taskId: "task-inexistente" }),
		).rejects.toThrow("Task not found");
	});
});
