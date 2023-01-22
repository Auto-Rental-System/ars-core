export const NEW_ID = 0;
export const ZERO = 0;

export type Result<T> = T | undefined;

export function toDoublePrecisionFloat(a: number) {
	return Math.trunc(a * 100) / 100;
}
