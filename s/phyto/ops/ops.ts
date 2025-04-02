
import {Vm} from "../vm.js"
import {opfns} from "./opfns.js"
import {Opkey, Opcode} from "./opcode.js"

export const ops = new Map<number, [Opkey, (vm: Vm) => void]>(
	Object.entries(opfns).map(([key, fn]) => [
		Opcode[key as Opkey],
		[key as Opkey, fn],
	])
)

