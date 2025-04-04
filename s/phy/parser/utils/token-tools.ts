
export class SourcePosition {
	constructor(
		public line: number,
		public start: number,
		public end: number,
	) {}
}

export class Token {
	constructor(public position: SourcePosition) {}
}

