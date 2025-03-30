
export enum Op {
	push,   // Push float64 literal (8 bytes follow)
	pop,    // Pop and discard top of stack

	add,    // Pop a, b → Push b + a
	sub,    // Pop a, b → Push b - a
	mul,
	div,
	rem,    // JS-style remainder (b % a)
	neg,    // Unary negation (Push -a)

	print,  // Pop and console.log
	dup,    // Duplicate top of stack
	swap,   // Swap top two

	halt = 0xFF,    // Stop execution
}

const maxStackSize = 1024

export function run(bytecode: Uint8Array) {
	const stack: number[] = []
	const view = new DataView(bytecode.buffer, bytecode.byteOffset, bytecode.byteLength)
	let pc = 0

	function push(value: number) {
		if (stack.length >= maxStackSize)
			throw new Error("stack overflow")
		stack.push(value)
	}

	while (pc < bytecode.length) {
		const op = bytecode[pc++]

		switch (op) {
			case Op.push: {
				const val = view.getFloat64(pc, true) // little-endian
				push(val)
				pc += 8
				break
			}
			case Op.pop: {
				if (stack.length < 1) throw new Error('Stack underflow on Pop')
				stack.pop()
				break
			}
			case Op.add: {
				if (stack.length < 2) throw new Error('Stack underflow on Add')
				const a = stack.pop()!
				const b = stack.pop()!
				push(b + a)
				break
			}
			case Op.sub: {
				if (stack.length < 2) throw new Error('Stack underflow on Sub')
				const a = stack.pop()!
				const b = stack.pop()!
				push(b - a)
				break
			}
			case Op.mul: {
				if (stack.length < 2) throw new Error('Stack underflow on Mul')
				const a = stack.pop()!
				const b = stack.pop()!
				push(b * a)
				break
			}
			case Op.div: {
				if (stack.length < 2) throw new Error('Stack underflow on Div')
				const a = stack.pop()!
				const b = stack.pop()!
				push(b / a)
				break
			}
			case Op.rem: {
				if (stack.length < 2) throw new Error('Stack underflow on Rem')
				const a = stack.pop()!
				const b = stack.pop()!
				push(b % a)
				break
			}
			case Op.neg: {
				if (stack.length < 1) throw new Error('Stack underflow on Neg')
				const a = stack.pop()!
				push(-a)
				break
			}
			case Op.print: {
				if (stack.length < 1) throw new Error('Stack underflow on Print')
				console.log(stack.pop())
				break
			}
			case Op.dup: {
				if (stack.length < 1) throw new Error('Stack underflow on Dup')
				push(stack[stack.length - 1])
				break
			}
			case Op.swap: {
				if (stack.length < 2) throw new Error('Stack underflow on Swap')
				const a = stack.pop()!
				const b = stack.pop()!
				push(a)
				push(b)
				break
			}
			case Op.halt: {
				return
			}
			default:
				throw new Error(`Unknown opcode: 0x${op.toString(16).padStart(2, '0')}`)
		}
	}
}

class NumberWriter {
	#buffer = new ArrayBuffer(8)
	#view = new DataView(this.#buffer)
	#bytes = new Uint8Array(this.#buffer)

	setNumber(n: number) {
		this.#view.setFloat64(0, n, true)
	}

	getBytes() {
		return this.#bytes.slice(0, 8)
	}
}

export function assemble(assembly: string) {
	const lines = assembly.trim().split("\n").map(line => line.trim()).filter(line => line.length > 0)
	const bytes: number[] = []
	const temp = new NumberWriter()

	function writeOpcode(opname: keyof typeof Op) {
		const opcode = Op[opname]
		if (opcode === undefined)
			throw new Error(`unknown opname "${opname}"`)
		bytes.push(opcode)
	}

	function writeNumber(n: number) {
		temp.setNumber(n)
		bytes.push(...temp.getBytes())
	}

	for (const line of lines) {
		const [opname, ...params] = line.split(/\s+/g)
		writeOpcode(opname as keyof typeof Op)
		for (const param of params)
			writeNumber(Number(param))
	}

	return new Uint8Array(bytes)
}

const bytecode = assemble(`
	push 2
	push 3
	add
	push 4
	mul
	push 5
	sub
	print
	halt
`)

run(bytecode)

