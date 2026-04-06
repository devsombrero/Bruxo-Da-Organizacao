import { TaskRepository } from "../domain/task.repository";
import { ReorderTasksInput } from "./input/task.input";

export class ReorderTasksUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(input: ReorderTasksInput): Promise<void> {
		const { planId, taskIdsInOrder } = input;

		// 1. Busca todas as tarefas do plano para garantir que estamos mexendo nos objetos certos
		const tasks = await this.taskRepository.findManyByPlanId(planId);

		// 2. Mapeia as tarefas por ID para facilitar o acesso
		const taskMap = new Map(tasks.map((t) => [t.id, t]));

		// 3. Itera sobre a nova ordem e atualiza a prioridade
		for (let i = 0; i < taskIdsInOrder.length; i++) {
			const id = taskIdsInOrder[i];
			const task = taskMap.get(id);

			if (task) {
				task.priority = i;
				await this.taskRepository.update(task);
			}
		}
	}
}
