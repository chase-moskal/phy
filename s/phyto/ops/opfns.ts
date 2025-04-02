
import {Vm} from "../vm.js"
import {Opcode} from "./opcode.js"
import {terp} from "../utils/terp.js"

export const opfns: Record<keyof typeof Opcode, (vm: Vm) => void> = {

	//
	// outside world stuff
	//

	halt: vm => { vm.done = true },
	capability: _vm => { throw new Error("todo: op not yet implemented") },
	capabilitycheck: _vm => { throw new Error("todo: op not yet implemented") },

	//
	// stack stuff
	//

	push: vm => {
		const value = vm.bytecode.getFloat()
		vm.stack.push(value)
	},

	pushbytes: vm => {
		const length = vm.bytecode.getUint()
		const bytes = vm.bytecode.getBytes(length)
		vm.stack.pushN([...bytes])
	},

	pop: vm => {
		vm.stack.pop()
	},

	swap: vm => {
		const [a, b] = vm.stack.popN(2)
		vm.stack.pushN([b, a])
	},

	dup: vm => {
		vm.stack.push(vm.stack.at(-1))
	},

	dup2: vm => {
		const [a, b] = vm.stack.popN(2)
		vm.stack.pushN([a, b, a, b])
	},

	over: vm => {
		const [a, b] = vm.stack.popN(2)
		vm.stack.pushN([a, b, a])
	},

	select: vm => {
		const [cond, a, b] = vm.stack.popN(3)
		vm.stack.push(cond ? a : b)
	},

	jump: vm => {
		const isConditional = vm.bytecode.getBoolean()
		const targetPosition = vm.bytecode.getUint()
		if (isConditional) {
			const condition = vm.stack.pop()
			if (condition)
				vm.bytecode.position = targetPosition
		}
		else {
			vm.bytecode.position = targetPosition
		}
	},

	//
	// memory stuff
	//

	memplz: vm => {
		const pageId = vm.memory.create()
		vm.stack.push(pageId)
	},

	memcya: vm => {
		const pageId = terp.uint(vm.stack.pop())
		vm.memory.delete(pageId)
	},

	memcheck: vm => {
		const pageId = terp.uint(vm.stack.pop())
		const hasPage = vm.memory.has(pageId)
		vm.stack.push(hasPage ? 1 : 0)
	},

	memload: vm => {
		const byteMode = vm.bytecode.getBoolean()
		const [pageId, address, length] = vm.stack.popN(3).map(terp.uint)
		const page = vm.memory.get(pageId)
		if (byteMode) {
			for (const byte of page.bytes.slice(address, address + length).reverse())
				vm.stack.push(byte)
		}
		else {
			const numbers: number[] = []
			for (let i = 0; i < length; i += 8) {
				const float = page.view.getFloat64(address + i, true)
				numbers.push(float)
			}
			for (const number of numbers.reverse())
				vm.stack.push(number)
		}
	},

	memstore: vm => {
		const byteMode = vm.bytecode.getBoolean()
		const [pageId, address, length] = vm.stack.popN(3).map(terp.uint)
		const page = vm.memory.get(pageId)
		const numbers = vm.stack.popN(length)
		if (byteMode) {
			page.bytes.set(numbers, address)
		}
		else {
			numbers.forEach((number, index) => {
				page.view.setFloat64(address + (index * 8), number, true)
			})
		}
	},

	//
	// comparison stuff
	//

	eq: vm => {
		const [a, b] = vm.stack.popN(2)
		vm.stack.push(terp.bool(b === a))
	},

	lt: vm => {
		const [a, b] = vm.stack.popN(2)
		vm.stack.push(terp.bool(b < a))
	},

	lte: vm => {
		const [a, b] = vm.stack.popN(2)
		vm.stack.push(terp.bool(b <= a))
	},

	gt: vm => {
		const [a, b] = vm.stack.popN(2)
		vm.stack.push(terp.bool(b > a))
	},

	gte: vm => {
		const [a, b] = vm.stack.popN(2)
		vm.stack.push(terp.bool(b >= a))
	},

	//
	// float stuff
	//

	nan: vm => {
		const a = vm.stack.pop()
		vm.stack.push(terp.bool(isNaN(a)))
	},

	finite: vm => {
		const a = vm.stack.pop()
		vm.stack.push(terp.bool(Number.isFinite(a)))
	},

	positive: vm => {
		const a = vm.stack.pop()
		vm.stack.push(terp.bool(a >= 0))
	},

	integer: vm => {
		const a = vm.stack.pop()
		vm.stack.push(terp.bool(Number.isSafeInteger(a)))
	},

	//
	// boolean stuff
	//

	not: vm => {
		const a = vm.stack.pop()
		vm.stack.push(terp.bool(!terp.truthy(a)))
	},

	truthy: vm => {
		const a = vm.stack.pop()
		vm.stack.push(terp.bool(terp.truthy(a)))
	},

	falsy: vm => {
		const a = vm.stack.pop()
		vm.stack.push(terp.bool(!terp.truthy(a)))
	},

	//
	// math stuff
	//

	abs: vm => {
		const a = vm.stack.pop()
		vm.stack.push(Math.abs(a))
	},

	sign: vm => {
		const a = vm.stack.pop()
		vm.stack.push(Math.sign(a))
	},

	min: vm => {
		const [a, b] = vm.stack.popN(2)
		vm.stack.push(Math.min(a, b))
	},

	max: vm => {
		const [a, b] = vm.stack.popN(2)
		vm.stack.push(Math.max(a, b))
	},

	add: vm => {
		const [a, b] = vm.stack.popN(2)
		vm.stack.push(a + b)
	},

	sub: vm => {
		const [a, b] = vm.stack.popN(2)
		vm.stack.push(b - a)
	},

	mul: vm => {
		const [a, b] = vm.stack.popN(2)
		vm.stack.push(a * b)
	},

	div: vm => {
		const [a, b] = vm.stack.popN(2)
		vm.stack.push(b / a)
	},

	rem: vm => {
		const [a, b] = vm.stack.popN(2)
		vm.stack.push(b % a)
	},

	neg: vm => {
		const a = vm.stack.pop()
		vm.stack.push(-a)
	},

	floor: vm => {
		const a = vm.stack.pop()
		vm.stack.push(Math.floor(a))
	},

	ceil: vm => {
		const a = vm.stack.pop()
		vm.stack.push(Math.ceil(a))
	},

	trunc: vm => {
		const a = vm.stack.pop()
		vm.stack.push(Math.trunc(a))
	},

	round: vm => {
		const a = vm.stack.pop()
		vm.stack.push(Math.round(a))
	},

	sqrt: vm => {
		const a = vm.stack.pop()
		vm.stack.push(Math.sqrt(a))
	},

	cbrt: vm => {
		const a = vm.stack.pop()
		vm.stack.push(Math.cbrt(a))
	},
}

