import { Task } from "../../task/domain/task.entity";
import { Plan } from "../../plan/domain/plan.entity";
import { EngineResult } from "../domain/engine.types";
import { EngineService } from "../domain/engine.service";

export class RunEngineUseCase {
  constructor(private readonly engine: EngineService = new EngineService()) {}

  execute(plan: Plan, tasks: Task[]): EngineResult {
    return this.engine.execute(plan, tasks);
  }
}