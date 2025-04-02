
export type Opkey = keyof typeof Opcode

// [typed operand] (f64 popped from stack) {description}
export enum Opcode {

	// outside world stuff
	halt,
	capability, // [f64 length], ...[u8 name] ...(any)
	capabilitycheck, // [f64 length], ...[u8 name] {pushes 1 if capability exists}

	// stack stuff
	push, // [f64] {add a literal f64 to stack}
	pushbytes, // [f64 length], ...[u8 bytes] {add bytes to stack as f64s}
	pop, swap, dup, dup2, over,
	select, // (cond) (a) (b) {pushes a to stack if cond is 1}
	jump, // [bool is-conditional], [f64 position] {cond true will pop jump condition from stack}

	// memory stuff
	memplz, // {request memory page, page-id pushed to stack}
	memcya, // (page-id) {free a memory page}
	memload, // [bool byte-mode], (page-id), (address), (length)
	memstore, // [bool byte-mode], (page-id), (address), (length), ...(data)

	// comparison stuff
	eq, lt, gt, lte, gte,

	// float stuff
	nan, finite, positive, integer,

	// booleans
	not, truthy, falsy,

	// math stuff
	abs, sign, min, max,
	add, sub, mul, div, rem, neg,
	floor, ceil, trunc, round,
	sqrt, cbrt,
	// pow, exp, log, log10,

	// // trig stuff
	// sin, cos, tan,
	// asin, acos, atan, atan2,
}

