import { CreateTaskUseCase } from "../../../modules/task/application/create-task.usecase";
import { Task } from "../../../modules/task/domain/task.entity";
import { TaskRepository } from "../../../modules/task/domain/task.repository";

describe('CreateTaskUseCase', () => {
	it('must create and save a new task successfully', () => {
		const mockRepository: TaskRepository = {
			save: jest.fn(),
		};

		const useCase = new CreateTaskUseCase(mockRepository);

		const result = useCase.execute({
			planId: "plan-123",
			title: "Aprender TDD",
			priority: 1,
		});

		expect(result.title).toBe("Aprender TDD");
		expect(result.status).toBe("PENDENTE");
		expect(result.planId).toBe("plan-123");
		expect(mockRepository.save).toHaveBeenCalledTimes(1);
		expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Task));
	});

	it("must create a new task with default priority (0) when the priority is not informed", () => {
		const mockRepository = {
			save: jest.fn(),
		};
		const useCase = new CreateTaskUseCase(mockRepository);

		const result = useCase.execute({
			planId: "plan-123",
			title: "Estudar Cobertura de Testes",
		});

		expect(result.title).toBe("Estudar Cobertura de Testes");
		expect(result.priority).toBe(0);
		expect(mockRepository.save).toHaveBeenCalledTimes(1);
	});
});