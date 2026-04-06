import { UpdateTaskStatusUseCase } from "../../../modules/task/application/update-task-status.usecase";
import { TaskRepository } from "../../../modules/task/domain/task.repository";
import { Task } from "../../../modules/task/domain/task.entity";

describe("UpdateTaskStatusUseCase", () => {
	let mockRepository: TaskRepository;
	let useCase: UpdateTaskStatusUseCase;

	beforeEach(() => {
		mockRepository = {
			save: jest.fn(),
			findById: jest.fn(),
			update: jest.fn(),
		};
		useCase = new UpdateTaskStatusUseCase(mockRepository);
	});

	it("should update task status to any valid status", async () => {
		const task = new Task("task-1", "plan-1", "Task", "FAZENDO", 1);
		(mockRepository.findById as jest.Mock).mockResolvedValue(task);
		const result = await useCase.execute({ taskId: "task-1", status: "FEITO" });
		expect(result.status).toBe("FEITO");
		expect(mockRepository.update).toHaveBeenCalledWith(task);
	});

	it("should throw error if task is not found", async () => {
		(mockRepository.findById as jest.Mock).mockResolvedValue(null);

		await expect(
			useCase.execute({ taskId: "non-existent", status: "PENDENTE" }),
		).rejects.toThrow("Task not found");
	});
});
