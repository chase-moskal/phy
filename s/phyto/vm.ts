
import {ops} from "./ops/ops.js"
import {Stack} from "./parts/stack.js"
import {Memory} from "./parts/memory.js"
import {BytecodeReader} from "./parts/bytecode.js"

export class Vm {
	stack = new Stack(2 ** 16)
	done = false
	memory = new Memory()
	bytecode: BytecodeReader

	constructor(bytes: Uint8Array) {
		this.bytecode = new BytecodeReader(bytes)
	}

	*execute() {
		const opcode = this.bytecode.getOpcode()
		if (opcode === undefined) {
			this.done = true
			yield true
		}
		else if (this.done) {
			yield true
		}
		else {
			const op = ops.get(opcode)
			if (!op)
				throw new Error(`unknown opcode ${opcode}`)
			const [,fn] = op
			fn(this)
			yield this.done
		}
	}
}

