import { Plan } from "../../../modules/plan/domain/plan.entity";

describe("Plan Entity", () => {
	it("should return true if active", () => {
		const now = new Date();

		const plan = new Plan(
			"1",
			"Plano",
			"STUDY",
			new Date(now.getTime() - 1000),
			new Date(now.getTime() + 1000),
		);

		expect(plan.isActive(now)).toBe(true);
	});

	it("should return false if not active", () => {
		const now = new Date();

		const plan = new Plan(
			"1",
			"Plano",
			"STUDY",
			new Date(now.getTime() - 2000),
			new Date(now.getTime() - 1000),
		);

		expect(plan.isActive(now)).toBe(false);
	});
});
