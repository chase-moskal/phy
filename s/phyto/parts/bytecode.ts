
import {terp} from "../utils/terp.js"

export class BytecodeReader {
	position = 0
	view: DataView

	constructor(public bytes: Uint8Array) {
		this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
	}

	getOpcode() {
		const opcode = this.bytes.at(this.position)
		if (opcode !== undefined)
			this.position += 1
		return opcode
	}

	getFloat() {
		const value = this.view.getFloat64(this.position)
		this.position += 8
		return value
	}

	getInteger() {
		const value = terp.uint(this.view.getFloat64(this.position, true))
		this.position += 8
		return value
	}

	getByte() {
		const value = this.view.getUint8(this.position)
		this.position += 1
		return value
	}

	getBytes(length: number) {
		const bytes = this.bytes.slice(this.position, this.position + length)
		this.position += length
		return bytes
	}

	getBoolean() {
		return !!this.getByte()
	}
}

