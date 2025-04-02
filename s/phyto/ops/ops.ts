
import {Vm} from "../vm.js"
import {opfns} from "./opfns.js"
import {Opkey, Opname} from "./opname.js"

export const ops = new Map<number, [Opkey, (vm: Vm) => void]>(
	Object.entries(opfns).map(([key, fn]) => [
		Opname[key as Opkey],
		[key as Opkey, fn],
	])
)

