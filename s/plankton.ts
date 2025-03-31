
export const macros = new Map<string, () => number[]>([
	["not_equal", () => []],
])

export class Plankton {
	compile(): Uint8Array {
		const bytes = new Uint8Array()
		return bytes
	}
}

