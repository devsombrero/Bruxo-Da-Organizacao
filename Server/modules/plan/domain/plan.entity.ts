import { PlanType } from "./plan.types";

export class Plan {
	constructor(
		public id: string,
		public name: string,
		public type: PlanType,
		public startDate: Date,
		public endDate: Date,
	) {}

	isActive(date: Date): boolean {
		return date >= this.startDate && date <= this.endDate;
	}
}
