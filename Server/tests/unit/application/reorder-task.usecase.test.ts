import { TaskRepository } from "../../../modules/task/domain/task.repository";
import { Task } from "../../../modules/task/domain/task.entity";
import { ReorderTasksUseCase } from "../../../modules/task/application/reorder-task.usecase";

describe("ReorderTasksUseCase", () => {
	let mockRepository: TaskRepository;
	let useCase: ReorderTasksUseCase;

	beforeEach(() => {
		mockRepository = {
			save: jest.fn(),
			findById: jest.fn(),
			update: jest.fn(),
			findManyByPlanId: jest.fn(),
		};
		useCase = new ReorderTasksUseCase(mockRepository);
	});

	it("deve reordenar as tarefas com base na ordem do array fornecido", async () => {
		const task1 = new Task("t-1", "plan-1", "A", "PENDENTE", 10);
		const task2 = new Task("t-2", "plan-1", "B", "PENDENTE", 5);
		const task3 = new Task("t-3", "plan-1", "C", "PENDENTE", 1);

		(mockRepository.findManyByPlanId as jest.Mock).mockResolvedValue([
			task1,
			task2,
			task3,
		]);

		await useCase.execute({
			planId: "plan-1",
			taskIdsInOrder: ["t-3", "t-1", "t-2"],
		});

		expect(mockRepository.findManyByPlanId).toHaveBeenCalledWith("plan-1");

		expect(mockRepository.update).toHaveBeenCalledTimes(3);

		expect(task3.priority).toBe(0);

		expect(task1.priority).toBe(1);

		expect(task2.priority).toBe(2);
	});

	it("deve ignorar IDs no array que não pertencem ao plano", async () => {
		const task1 = new Task("t-1", "plan-1", "A", "PENDENTE", 0);
		(mockRepository.findManyByPlanId as jest.Mock).mockResolvedValue([task1]);

		await useCase.execute({
			planId: "plan-1",
			taskIdsInOrder: ["t-1", "t-invalido-que-veio-do-frontend"],
		});

		expect(mockRepository.update).toHaveBeenCalledTimes(1);
		expect(task1.priority).toBe(0);
	});
});
