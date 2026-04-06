import sqlite3 from "sqlite3";
import { Task } from "../domain/task.entity";
import { TaskRepository } from "../domain/task.repository";

export class SqliteTaskRepository implements TaskRepository {

	constructor(private readonly db: sqlite3.Database) {}

	save(task: Task): void {
		const sql = `
      INSERT INTO tasks (id, planId, title, status, priority)
      VALUES (?, ?, ?, ?, ?)
    `;

		this.db.run(
			sql,
			[task.id, task.planId, task.title, task.status, task.priority],
			(err) => {
				if (err) {
					console.error("Erro ao salvar tarefa no banco:", err.message);
				}
			},
		);
	}
}
