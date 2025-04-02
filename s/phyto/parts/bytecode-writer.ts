
import {terp} from "../utils/terp.js"
import {Opkey, Opcode} from "../ops/opcode.js"

export class BytecodeWriter {
	#bytes: number[] = []
	#temp64bytes = new Uint8Array(8)
	#temp64view = new DataView(this.#temp64bytes.buffer)

	toBytecode() {
		return new Uint8Array(this.#bytes)
	}

	opcode(code: number) {
		this.#bytes.push(code)
	}

	opkey(opkey: Opkey) {
		const opcode = Opcode[opkey]
		this.#bytes.push(opcode)
	}

	float(n: number) {
		this.#temp64view.setFloat64(0, n, true)
		this.#bytes.push(...this.#temp64bytes)
	}

	uint(n: number) {
		this.#temp64view.setFloat64(0, terp.uint(n), true)
		this.#bytes.push(...this.#temp64bytes)
	}

	byte(byte: number) {
		this.#bytes.push(byte)
	}

	bytes(bytes: number[]) {
		this.#bytes.push(...bytes)
	}

	boolean(b: boolean) {
		this.#bytes.push(b ? 1 : 0)
	}
}

