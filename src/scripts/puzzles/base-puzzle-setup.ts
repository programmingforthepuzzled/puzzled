function deepClone(obj: object): Object {
    return JSON.parse(JSON.stringify(obj))
}

export abstract class Puzzle {

    addState(status: Status, data?: Object) {

        if (data === undefined) {
            data = this.stateData
        }

        this.states.push(new State(deepClone(data), status))
    }

    abstract get stateData(): Object

    protected constructor(public readonly states: State[], initialStateData: Object) {
        this.addState(GenericStatus.NoError, initialStateData)
    }

}

export class State {

    constructor(public readonly data: Object, public readonly status: Status) { }

}

export class Status {
    constructor(public readonly event: GenericEvent | string, public readonly severityLevel: SeverityLevel) { }
}

// https://basarat.gitbooks.io/typescript/docs/styleguide/styleguide.html#enum
export const enum GenericEvent {
    Success = 'success',
    None = ''
}

export const enum SeverityLevel {

    NoError = 'no_error',
    NonFatalError = 'non_fatal_error',
    FatalError = 'fatal_error'

}

export const GenericStatus = {
    NoError: new Status(GenericEvent.None, SeverityLevel.NoError),
    Success: new Status(GenericEvent.Success, SeverityLevel.NoError)
}

