
import {Vm} from "./vm.js"
import {Opcode} from "./ops/opcode.js"
import {BytecodeWriter} from "./parts/bytecode-writer.js"

export const bytecode = (() => {
	const w = new BytecodeWriter()

	w.opcode(Opcode.push)
	w.float(2)

	w.opcode(Opcode.push)
	w.float(3)

	w.opcode(Opcode.add)

	w.opcode(Opcode.push)
	w.float(4)

	w.opcode(Opcode.mul)

	w.opcode(Opcode.push)
	w.float(5)

	w.opcode(Opcode.sub)

	w.opcode(Opcode.halt)

	return w.toBytecode()
})()

const vm = new Vm(bytecode)
for (const _ of vm.execute()) {}
console.log(vm.stack.at(-1))

