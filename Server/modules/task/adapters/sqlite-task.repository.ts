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

	findById(id: string): Promise<Task | null> {
		return new Promise((resolve, reject) => {
			const sql = `SELECT * FROM tasks WHERE id = ?`;

			this.db.get(sql, [id], (err, row: any) => {
				if (err) {
					console.error("Erro ao buscar tarefa:", err.message);
					return reject(err);
				}

				if (!row) {
					return resolve(null);
				}

				const task = new Task(
					row.id,
					row.planId,
					row.title,
					row.status,
					row.priority,
				);

				resolve(task);
			});
		});
	}

	update(task: Task): Promise<void> {
		return new Promise((resolve, reject) => {
			const sql = `
        UPDATE tasks 
        SET planId = ?, title = ?, status = ?, priority = ? 
        WHERE id = ?
      `;

			this.db.run(
				sql,
				[task.planId, task.title, task.status, task.priority, task.id],
				(err) => {
					if (err) {
						console.error("Erro ao atualizar tarefa:", err.message);
						return reject(err);
					}
					resolve();
				},
			);
		});
	}
}
