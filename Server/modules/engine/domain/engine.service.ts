import { Task } from "../../task/domain/task.entity";
import { Plan } from "../../plan/domain/plan.entity";

export class EngineService {
	private readonly WIP_LIMIT = 2;

	execute(plan: Plan, tasks: Task[]) {
		const now = new Date();

		if (!plan.isActive(now) || this.isWipLimitReached(tasks)) {
			return this.emptyResult();
		}

		const inProgress = tasks.filter((t) => t.status === "FAZENDO");
		const pending = tasks.filter((t) => t.status === "PENDENTE");

		// Se já existe uma tarefa em andamento, ela é a prioridade absoluta
		if (inProgress.length === 1) {
			return {
				orderedTasks: [...inProgress, ...pending],
				nextTask: inProgress[0],
			};
		}

		// Ordenação de pendentes (maior prioridade primeiro)
		const orderedPending = [...pending].sort((a, b) => b.priority - a.priority);

		return {
			orderedTasks: orderedPending,
			nextTask: orderedPending[0] || null,
		};
	}

	private isWipLimitReached(tasks: Task[]): boolean {
		const count = tasks.filter((t) => t.status === "FAZENDO").length;
		return count >= this.WIP_LIMIT;
	}

	private emptyResult() {
		return { orderedTasks: [], nextTask: null };
	}
}
