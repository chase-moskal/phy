
import {SourcePosition, Token} from "./utils/token-tools.js"

export class Atom extends Token {
	constructor(
		public position: SourcePosition,
		public kind: "symbol" | "string" | "number",
		public value: string,
		public quoted: boolean,
	) { super(position) }
}

export class Boundary extends Token {
	constructor(
		public position: SourcePosition,
		public variant: "paren" | "bracket" | "brace",
		public open: boolean,
		public quoted: boolean,
	) { super(position) }
}

export class Newline extends Token {
	constructor(
		public position: SourcePosition,
	) { super(position) }
}

