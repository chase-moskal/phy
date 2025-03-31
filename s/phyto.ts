
export class MemoryPage {
	bytes = new Uint8Array(new ArrayBuffer(64 * 1024))
	view = new DataView(this.bytes.buffer, this.bytes.byteOffset, this.bytes.byteLength)
	constructor(public id: number) {}
}

export class Memory {
	#nextPageId = 0
	#pages = new Map<number, MemoryPage>()

	memplz() {
		const id = this.#nextPageId++
		const page = new MemoryPage(id)
		this.#pages.set(id, page)
		return id
	}

	membye(id: number) {
		this.#pages.delete(id)
	}

	getPage(id: number) {
		const page = this.#pages.get(id)
		if (page === undefined)
			throw new Error(`memory page not found "${id}"`)
		return page
	}
}

export class Vm {
	stack = new Stack(10_000)
	position = 0
	done = false
	view: DataView
	memory = new Memory()

	constructor(public bytecode: Uint8Array) {
		this.view = new DataView(bytecode.buffer, bytecode.byteOffset, bytecode.byteLength)
	}

	*execute() {
		const opcode = this.bytecode.at(this.position)
		if (opcode === undefined) {
			this.done = true
			yield true
		}
		else if (this.done) {
			yield true
		}
		else {
			this.position += 1
			// // TODO redo with new opfns
			// const opresult = opcodes.get(opcode)!
			// if (!opresult)
			// 	throw new Error(`unknown opcode ${opcode}`)
			// const [,fn] = opresult
			// fn(this)
			yield this.done
		}
	}
}

export class Stack {
	#array: number[] = []

	constructor(public max: number) {}

	get size() {
		return this.#array.length
	}

	at(index: number) {
		const value = this.#array.at(index)
		if (value === undefined)
			throw new Error("stack value not found")
		return value
	}

	push(value: number) {
		if (this.size >= this.max)
			throw new Error(`stack overflow (max ${this.max})`)
		this.#array.push(value)
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

