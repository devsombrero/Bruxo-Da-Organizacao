import { generateId } from "../../../../shared/utils/id-generator";

describe("IdGenerator", () => {
	it("deve gerar um ID em formato de string que não seja vazio", () => {
		const id = generateId();

		expect(typeof id).toBe("string");
		expect(id.length).toBeGreaterThan(0);
	});

	it("deve gerar IDs diferentes em chamadas consecutivas (aleatoriedade)", () => {
		const id1 = generateId();
		const id2 = generateId();

		expect(id1).not.toBe(id2);
	});
});
