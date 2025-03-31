
import {Vm} from "../../phyto.js"
import {Opname} from "./opname.js"

export const opfns: Record<keyof typeof Opname, (vm: Vm) => void> = {

	//
	// outside world stuff
	//

	capability: _vm => { throw new Error("todo: op not yet implemented") },
	capcheck: _vm => { throw new Error("todo: op not yet implemented") },

	halt: vm => { vm.done = true },

	//
	// stack stuff
	//

	push: vm => {
		const val = vm.view.getFloat64(vm.position, true)
		vm.stack.push(val)
		vm.position += 8
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
		vm.stack.push(vm.stack.at(vm.stack.size - 1))
	},

	jump: vm => {
		const cond = vm.stack.pop()
		const position = vm.stack.pop()
		if (cond === 1)
			vm.position = position
	},

	//
	// memory stuff
	//

	memplz: vm => {
		const page = vm.memory.memplz()
		vm.stack.push(page)
	},

	memcya: vm => {
		const pageId = vm.stack.pop()
		vm.memory.membye(pageId)
	},

	memload: vm => {
		const address = vm.stack.pop()
		const pageId = vm.stack.pop()
		const page = vm.memory.getPage(pageId)
		const value = page.view.getFloat64(address, true)
		vm.stack.push(value)
	},

	memstore: vm => {
		const value = vm.stack.pop()
		const address = vm.stack.pop()
		const pageId = vm.stack.pop()
		const page = vm.memory.getPage(pageId)
		page.view.setFloat64(address, value, true)
	},

	// memload_byte: vm => {
	// 	const address = vm.stack.pop()
	// 	const pageId = vm.stack.pop()
	// 	const page = vm.memory.getPage(pageId)
	// 	const byte = page.bytes.at(address)
	// 	if (byte === undefined)
	// 		throw new Error("out of bounds memory access")
	// 	vm.stack.push(byte)
	// },
	//
	// memstore_byte: vm => {
	// 	const value = vm.stack.pop()
	// 	const address = vm.stack.pop()
	// 	const pageId = vm.stack.pop()
	// 	const page = vm.memory.getPage(pageId)
	// 	if (address < 0 || address >= page.bytes.length)
	// 		throw new Error("out of bounds memory access")
	// 	page.bytes[address] = value % 256
	// },

	//
	// math stuff
	//

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

	sqrt: vm => {
		const a = vm.stack.pop()
		vm.stack.push(Math.sqrt(a))
	},
}

