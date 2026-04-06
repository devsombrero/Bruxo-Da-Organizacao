import { RunEngineUseCase } from "../../../modules/engine/application/run-engine.usecase";
import { EngineService } from "../../../modules/engine/domain/engine.service";
import { Plan } from "../../../modules/plan/domain/plan.entity";
import { Task } from "../../../modules/task/domain/task.entity";

describe("Engine - Suggest Next Task", () => {
	let useCase: RunEngineUseCase;
	let activePlan: Plan;

	beforeEach(() => {
		const engineService = new EngineService();
		useCase = new RunEngineUseCase(engineService);

		const start = new Date();
		start.setMinutes(start.getMinutes() - 10);

		const end = new Date();
		end.setMinutes(end.getMinutes() + 10);

		activePlan = new Plan("1", "Plano Ativo", "STUDY", start, end);
	});

	const createTask = (
		id: string,
		status: "PENDENTE" | "FAZENDO" | "FEITO",
		priority = 0,
	) => {
		return new Task(id, "plan-1", `Task ${id}`, status, priority);
	};

	it("should initialize with default EngineService if none is provided", () => {
		const useCaseDefault = new RunEngineUseCase();

		const plan = new Plan("1", "Plano", "STUDY", new Date(), new Date());
		const tasks: Task[] = [];

		const result = useCaseDefault.execute(plan, tasks);

		expect(result).toBeDefined();
		expect(result.orderedTasks).toEqual([]);
	});

	it("should suggest the next pending task based on priority", () => {
		const tasks = [
			createTask("1", "FEITO", 1),
			createTask("2", "PENDENTE", 2),
			createTask("3", "PENDENTE", 1),
		];

		const result = useCase.execute(activePlan, tasks);

		expect(result.nextTask?.id).toBe("2");
	});

	it("should return null if no pending tasks are available", () => {
		const tasks = [createTask("1", "FEITO"), createTask("2", "FEITO")];

		const result = useCase.execute(activePlan, tasks);

		expect(result.nextTask).toBeNull();
	});

	it("should prioritize a task already in progress (FAZENDO) over higher priority pending tasks", () => {
		const tasks = [
			createTask("1", "PENDENTE", 10),
			createTask("2", "FAZENDO", 1),
		];

		const result = useCase.execute(activePlan, tasks);

		expect(result.nextTask?.id).toBe("2");
	});

	it("should not suggest any new task if WIP limit (2) is reached", () => {
		const tasks = [
			createTask("1", "FAZENDO"),
			createTask("2", "FAZENDO"),
			createTask("3", "PENDENTE"),
		];

		const result = useCase.execute(activePlan, tasks);

		expect(result.nextTask).toBeNull();
		expect(result.orderedTasks).toHaveLength(0);
	});

	it("should ignore all tasks if the plan is expired or inactive", () => {
		const expiredPlan = new Plan(
			"1",
			"Expirado",
			"STUDY",
			new Date(2020, 0, 1),
			new Date(2020, 0, 2),
		);

		const tasks = [createTask("1", "PENDENTE", 1)];

		const result = useCase.execute(expiredPlan, tasks);

		expect(result.nextTask).toBeNull();
	});

	it("should return ordered tasks list when valid", () => {
		const tasks = [
			createTask("1", "PENDENTE", 1),
			createTask("2", "PENDENTE", 5),
		];

		const result = useCase.execute(activePlan, tasks);

		expect(result.orderedTasks[0].id).toBe("2");
		expect(result.orderedTasks[1].id).toBe("1");
	});
});
