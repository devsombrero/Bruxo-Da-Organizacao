import { Task } from "../../task/domain/task.entity";
import { Plan } from "../../plan/domain/plan.entity";
import { EngineResult } from "../domain/engine.types";

export class RunEngineUseCase {
	execute(plan: Plan, tasks: Task[]): EngineResult {
		const now = new Date();
		const WIP_LIMIT = 2;

		const isPlanActive = plan.isActive(now);
		const inProgressTasks = tasks.filter((t) => t.status === "FAZENDO");
		const pendingTasks = tasks.filter((t) => t.status === "PENDENTE");

		// 1. Plan precisa estar ativo
		if (!isPlanActive) {
			return { orderedTasks: [], nextTask: null };
		}

		// 2. WIP limit
		if (inProgressTasks.length >= WIP_LIMIT) {
			return { orderedTasks: [], nextTask: null };
		}

		// 3. Priorizar tarefa em andamento
		if (inProgressTasks.length === 1) {
			return {
				orderedTasks: [...inProgressTasks, ...pendingTasks],
				nextTask: inProgressTasks[0],
			};
		}

		// 4. Ordenar pendentes por prioridade
		const orderedPending = [...pendingTasks].sort(
			(a, b) => b.priority - a.priority,
		);

		return {
			orderedTasks: orderedPending,
			nextTask: orderedPending[0] || null,
		};
	}
}