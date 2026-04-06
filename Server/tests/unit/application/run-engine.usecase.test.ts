import { RunEngineUseCase } from "../../../modules/engine/application/run-engine.usecase";
import { Plan } from "../../../modules/plan/domain/plan.entity";
import { Task } from "../../../modules/task/domain/task.entity";

describe("Engine - Suggest Next Task", () => {
	it('should suggest the next pending task', () => {
		const plan = new Plan(
			"1",
			"Plano de Teste",
			"STUDY",
			new Date(),
			new Date()
		);

		const tasks = [
			new Task("1", "1", "Task 1", "FEITO", 1),
			new Task("2", "1", "Task 2", "PENDENTE", 2),
			new Task("3", "1", "Task 3", "PENDENTE", 1)
		];

		const useCase = new RunEngineUseCase();

		const result = useCase.execute(plan, tasks);

		expect(result.nextTask?.id).toBe("2");
	});

	it("should return null if no pending tasks", () => {
		const plan = new Plan("1", "Plano", "STUDY", new Date(), new Date());

		const tasks = [
			new Task("1", "1", "Task 1", "FEITO", 1),
			new Task("2", "1", "Task 2", "FEITO", 2),
		];

		const useCase = new RunEngineUseCase();

		const result = useCase.execute(plan, tasks);

		expect(result.nextTask).toBeNull();
	});

	it("should prioritize highest priority task", () => {
		const plan = new Plan("1", "Plano", "STUDY", new Date(), new Date());

		const tasks = [
			new Task("1", "1", "Task 1", "PENDENTE", 1),
			new Task("2", "1", "Task 2", "PENDENTE", 10),
		];

		const useCase = new RunEngineUseCase();

		const result = useCase.execute(plan, tasks);

		expect(result.nextTask?.id).toBe("2");
	});
})