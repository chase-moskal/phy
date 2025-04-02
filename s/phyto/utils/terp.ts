
export const terp = new class {

	uint(float: number) {
		if (!Number.isSafeInteger(float))
			throw new Error("safe integer required")

		if (float < 0)
			throw new Error("positive integer required")

		return float
	}

	truthy(float: number) {
		return !!float
	}

	bool(value: boolean) {
		return value ? 1 : 0
	}
}

