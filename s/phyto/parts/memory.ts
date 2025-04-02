
export class MemoryPage {
	bytes = new Uint8Array(new ArrayBuffer(64 * 1024))
	view = new DataView(this.bytes.buffer)
	constructor(public id: number) {}
}

export class Memory {
	#nextPageId = 0
	#pages = new Map<number, MemoryPage>()

	create() {
		const id = this.#nextPageId++
		const page = new MemoryPage(id)
		this.#pages.set(id, page)
		return id
	}

	delete(id: number) {
		this.#pages.delete(id)
	}

	has(id: number) {
		return this.#pages.has(id)
	}

	get(id: number) {
		const page = this.#pages.get(id)
		if (page === undefined)
			throw new Error(`memory page not found "${id}"`)
		return page
	}
}

