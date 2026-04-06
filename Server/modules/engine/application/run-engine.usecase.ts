import { Task } from "../../task/domain/task.entity";
import { Plan } from "../../plan/domain/plan.entity";
import { EngineResult } from "../domain/engine.types";

export class RunEngineUseCase {
	execute(plan: Plan, tasks: Task[]): EngineResult {
		// 1. filtrar tasks pendentes
		const pendingTasks = tasks.filter((task) => task.status === "PENDENTE");

		// 2. ordenar por prioridade (maior primeiro)
		const orderedTasks = pendingTasks.sort((a, b) => b.priority - a.priority);

		// 3. pegar próxima task
		const nextTask = orderedTasks.length > 0 ? orderedTasks[0] : null;

		return {
			orderedTasks,
			nextTask,
		};
	}
}
