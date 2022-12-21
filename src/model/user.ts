import { NEW_ID } from 'src/shared/util/util';

export class User {
	constructor(public readonly id: number = NEW_ID) {}
}
