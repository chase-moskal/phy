
export class Stack {
	#array: number[] = []

	constructor(public max: number) {}

	get size() {
		return this.#array.length
	}

	copyArray() {
		return [...this.#array]
	}

	#checkOverflow(n: number) {
		if (this.size + n > this.max)
			throw new Error(`stack overflow (max ${this.max})`)
	}

	at(index: number) {
		const value = this.#array.at(index)
		if (value === undefined)
			throw new Error("stack value not found")
		return value
	}

	push(value: number) {
		this.#checkOverflow(1)
		this.#array.push(value)
	}

	pushN(values: number[]) {
		this.#checkOverflow(values.length)
		this.#array.push(...values.toReversed())
	}

	pop() {
		const value = this.#array.pop()!
		if (value === undefined)
			throw new Error("stack underflow")
		return value
	}

	popN(n: number) {
		const popped: number[] = []
		for (let i = 0; i < n; i++)
			popped.push(this.pop())
		return popped
	}
}

