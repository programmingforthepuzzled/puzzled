/*
Potential TODO - create a sub folders called 'bridge puzzles' and 'river puzzles' and put this under 'bridge puzzles'
Common classes can be extracted into the 'crossing-puzzles', which contains 'bridge puzzles' and 'river puzzles'
*/
/*
This is a barebones implementation of the ghoul puzzle.
If similar puzzles are implemented in the future, then this framework can be fleshed out.
*/

import { Puzzle, State, Status, GenericStatus, SeverityLevel } from '../base-puzzle-setup'
import { Side, Crosser, crossersOnCorrectSide, switchSides, checkSuccess } from './common-setup'


class GhoulPuzzle extends Puzzle {

    get stateData(): GhoulStateData {
        return new GhoulStateData(this.adventurers, this.timePassed, this.currentSide)
    }

    public get outOfTime(): boolean {

        if (puzzle.timePassed > puzzle.timeLimit) {
            return true
        }

        return false
    }

    constructor(public readonly adventurers: Adventurer[], public timePassed = 0, public readonly timeLimit = 17, public currentSide = Side.Left, public readonly states: GhoulState[] = []) {
        super(states, new GhoulStateData(adventurers, timePassed, null))
    }

}

export class GhoulState extends State {

    constructor(public readonly data: GhoulStateData, public readonly status: Status) {
        super(data, status)
    }

}

class GhoulStateData {

    constructor(public readonly adventurers: Adventurer[], public readonly timePassed: number, public readonly moveDirection: Side | null) { }

}

class Adventurer implements Crosser {
    constructor(public readonly name: string, public readonly timeToCross: number, public side = Side.Left, public hasTorch: boolean = false) { }
}

export const GhoulStatus = {
    SuccessStatus: new Status('Success - Everyone crossed the bridge.', SeverityLevel.NoError)
}


export const crossBridge = function (...adventurers: Adventurer[]) {

    if (puzzle.outOfTime) {
        return
    }

    let preCrossingStatus = preCrossingErrors(adventurers)
    if (preCrossingStatus !== null) {
        puzzle.addState(preCrossingStatus)
        return
    }

    switchSides(adventurers)

    puzzle.currentSide = adventurers[0].side

    puzzle.timePassed += Math.max(...adventurers.map(adventurer => adventurer.timeToCross))

    if (puzzle.outOfTime) {
        puzzle.addState(new Status('Time limit exceeded', SeverityLevel.FatalError))
    } else if (checkSuccess(puzzle.adventurers)) {
        puzzle.addState(GhoulStatus.SuccessStatus)
    } else {
        puzzle.addState(GenericStatus.NoError)
    }
}

export const giveTorch = function (adventurer: Adventurer) {

    if (puzzle.outOfTime) {
        return
    }

    if (adventurer.hasTorch === true) {
        puzzle.addState(new Status(adventurer.name + ' already has the torch', SeverityLevel.NonFatalError))
    } else {
        let [curTorchSide] = puzzle.adventurers.filter(adventurer => adventurer.hasTorch === true).map(adventurer => adventurer.side)
        let proposedTorchSide = adventurer.side

        if (curTorchSide !== proposedTorchSide) {
            puzzle.addState(new Status('The torch can only be transferred to adventurers on the same side', SeverityLevel.NonFatalError))
            return
        }

        puzzle.adventurers.map(adventurer => adventurer.hasTorch = false)
        adventurer.hasTorch = true
        puzzle.addState(GenericStatus.NoError)
    }
}

function preCrossingErrors(adventurers: Adventurer[]): Status | null {
    let misplacedCharacter = crossersOnCorrectSide(adventurers, puzzle.currentSide)

    if (misplacedCharacter !== undefined) {
        return new Status(misplacedCharacter.name + ' not on correct side', SeverityLevel.NonFatalError)
    }

    if (adventurers.length > 2) {
        return new Status('only a max of 2 adventurers can cross the bridge at once', SeverityLevel.NonFatalError)
    }

    if (adventurers.length === 0) {
        return new Status('an adventurer is needed to cross the bridge', SeverityLevel.NonFatalError)
    }

    if (!adventurers.find(adventurer => adventurer.hasTorch)) {
        return new Status('at least 1 adventurer must have a torch to cross the bridge', SeverityLevel.NonFatalError)
    }

    return null
}

export const initGhoulPuzzle = function (): Adventurer[] {


    let Alice = new Adventurer('Alice', 1, Side.Left, true)
    let Bob = new Adventurer('Bob', 2)
    let Charlie = new Adventurer('Charlie', 5)
    let Doris = new Adventurer('Doris', 10)

    let adventurers = [Alice, Bob, Charlie, Doris]

    puzzle = new GhoulPuzzle(adventurers)
    states = puzzle.states

    return adventurers
}

let puzzle: GhoulPuzzle;
export var states: GhoulState[]


