
import {Vm} from "../../phyto.js"
import {Opname} from "./opname.js"

function uint(f: number) {
	if (!Number.isSafeInteger(f))
		throw new Error("safe integer required")
	if (f < 0)
		throw new Error("positive integer required")
	return f
}

function truthy(float: number) {
	return !!float
}

function bool(bool: boolean) {
	return bool ? 1 : 0
}

function getOperandFloat(vm: Vm) {
	const value = vm.view.getFloat64(vm.position, true)
	vm.position += 8
	return value
}

function getOperandInteger(vm: Vm) {
	const value = uint(vm.view.getFloat64(vm.position, true))
	vm.position += 8
	return value
}

function getOperandByte(vm: Vm) {
	const value = vm.view.getUint8(vm.position)
	vm.position += 1
	return value
}

function getOperandBoolean(vm: Vm) {
	return !!getOperandByte(vm)
}

export const opfns: Record<keyof typeof Opname, (vm: Vm) => void> = {

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
		const value = getOperandFloat(vm)
		vm.stack.push(value)
	},

	pushbytes: vm => {
		const length = getOperandInteger(vm)
		for (const byte of vm.bytecode.slice(vm.position, vm.position + length)) {
			vm.stack.push(byte)
			vm.position += 1
		}
	},

	pop: vm => {
		vm.stack.pop()
	},

	swap: vm => {
		const a = vm.stack.pop()
		const b = vm.stack.pop()
		vm.stack.push(a)
		vm.stack.push(b)
	},

	dup: vm => {
		vm.stack.push(vm.stack.at(-1))
	},

	dup2: vm => {
		const a = vm.stack.at(-2)
		const b = vm.stack.at(-1)
		vm.stack.push(a)
		vm.stack.push(b)
	},

	over: vm => {
		vm.stack.push(vm.stack.at(-2))
	},

	select: vm => {
		const cond = vm.stack.pop()
		const a = vm.stack.pop()
		const b = vm.stack.pop()
		vm.stack.push(cond ? a : b)
	},

	jump: vm => {
		const isConditional = getOperandBoolean(vm)
		const targetPosition = getOperandInteger(vm)
		if (isConditional) {
			const condition = vm.stack.pop()
			if (condition)
				vm.position = targetPosition
		}
		else {
			vm.position = targetPosition
		}
	},

	//
	// memory stuff
	//

	memplz: vm => {
		const pageId = vm.memory.memplz()
		vm.stack.push(pageId)
	},

	memcya: vm => {
		const pageId = uint(vm.stack.pop())
		vm.memory.membye(pageId)
	},

	memload: vm => {
		const byteMode = getOperandBoolean(vm)
		const pageId = uint(vm.stack.pop())
		const address = uint(vm.stack.pop())
		const length = uint(vm.stack.pop())
		const page = vm.memory.getPage(pageId)
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
		const byteMode = getOperandBoolean(vm)
		const pageId = uint(vm.stack.pop())
		const address = uint(vm.stack.pop())
		const length = uint(vm.stack.pop())
		const page = vm.memory.getPage(pageId)
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
		const b = vm.stack.pop()
		const a = vm.stack.pop()
		vm.stack.push(bool(a === b))
	},

	lt: vm => {
		const b = vm.stack.pop()
		const a = vm.stack.pop()
		vm.stack.push(bool(a < b))
	},

	lte: vm => {
		const b = vm.stack.pop()
		const a = vm.stack.pop()
		vm.stack.push(bool(a <= b))
	},

	gt: vm => {
		const b = vm.stack.pop()
		const a = vm.stack.pop()
		vm.stack.push(bool(a > b))
	},

	gte: vm => {
		const b = vm.stack.pop()
		const a = vm.stack.pop()
		vm.stack.push(bool(a >= b))
	},

	//
	// float stuff
	//

	nan: vm => {
		const a = vm.stack.pop()
		vm.stack.push(bool(isNaN(a)))
	},

	finite: vm => {
		const a = vm.stack.pop()
		vm.stack.push(bool(Number.isFinite(a)))
	},

	positive: vm => {
		const a = vm.stack.pop()
		vm.stack.push(bool(a >= 0))
	},

	integer: vm => {
		const a = vm.stack.pop()
		vm.stack.push(bool(Number.isSafeInteger(a)))
	},

	//
	// boolean stuff
	//

	not: vm => {
		const a = vm.stack.pop()
		vm.stack.push(bool(!truthy(a)))
	},

	truthy: vm => {
		const a = vm.stack.pop()
		vm.stack.push(bool(truthy(a)))
	},

	falsy: vm => {
		const a = vm.stack.pop()
		vm.stack.push(bool(!truthy(a)))
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
		const b = vm.stack.pop()
		const a = vm.stack.pop()
		vm.stack.push(Math.min(a, b))
	},

	max: vm => {
		const b = vm.stack.pop()
		const a = vm.stack.pop()
		vm.stack.push(Math.max(a, b))
	},

	add: vm => {
		const b = vm.stack.pop()
		const a = vm.stack.pop()
		vm.stack.push(a + b)
	},

	sub: vm => {
		const b = vm.stack.pop()
		const a = vm.stack.pop()
		vm.stack.push(a - b)
	},

	mul: vm => {
		const b = vm.stack.pop()
		const a = vm.stack.pop()
		vm.stack.push(a * b)
	},

	div: vm => {
		const b = vm.stack.pop()
		const a = vm.stack.pop()
		vm.stack.push(a / b)
	},

	rem: vm => {
		const b = vm.stack.pop()
		const a = vm.stack.pop()
		vm.stack.push(a % b)
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

