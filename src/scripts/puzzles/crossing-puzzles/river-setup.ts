import { Puzzle, State, Status, GenericStatus, SeverityLevel, GenericEvent } from '../base-puzzle-setup'
import { Side, Crosser, checkSuccess, switchSides, crossersOnCorrectSide } from './common-setup'

class RiverPuzzle extends Puzzle {

    get stateData(): RiverStateData {
        return new RiverStateData(this.passengers, this.boat)
    }

    constructor(public readonly passengers: ReadonlyArray<Passenger>, public readonly boat: Boat, public readonly rules: RiverCrossingRule[], public fatalErrorRaised = false, public states: RiverState[] = []) {
        super(states, new RiverStateData(passengers, boat))
    }

}

export class RiverState extends State {

    constructor(public readonly data: RiverStateData, public readonly status: RiverStatus) {
        super(data, status)
    }
}

class RiverStateData {

    constructor(public readonly passengers: ReadonlyArray<Passenger>, public readonly boat: Boat) { }

}

export class RiverErrorData {
    constructor(public readonly oldType: string, public readonly newType: string, public readonly side: Side) { }
}

export class RiverStatus extends Status {
    constructor(public readonly event: GenericEvent | string, public readonly severityLevel: SeverityLevel, public readonly errorData?: RiverErrorData) {
        super(event, severityLevel)
    }
}

export const RiverStatuses = {
    SuccessStatus: new Status('Success - Everyone crossed the river.', SeverityLevel.NoError)
}

class Boat {
    constructor(public readonly rowerTypes: ReadonlyArray<String>, public readonly weightLimit: number, public side = Side.Left) { }
}

export class Passenger implements Crosser {
    constructor(public readonly type: string, public readonly weight: number, public side = Side.Left) { }
}

abstract class RiverCrossingRule {
    abstract check(puzzle: RiverPuzzle): Status
}

class SameSideRule extends RiverCrossingRule {

    constructor(private readonly type1: string, private readonly type2: string, private readonly type3: string) {
        super();
    }

    check(puzzle: RiverPuzzle): Status {

        for (let side of Object.values(Side)) {

            const isTypeOnSide = function (passenger: Passenger, side: Side, type: string): boolean {
                return passenger.side === side && passenger.type === type;
            };

            const type1_on_side = puzzle.passengers.some(passenger => {
                return isTypeOnSide(passenger, side, this.type1)
            });

            const type_2_on_side = puzzle.passengers.some(passenger => {
                return isTypeOnSide(passenger, side, this.type2)
            });

            const type_3_on_side = puzzle.passengers.some(passenger => {
                return isTypeOnSide(passenger, side, this.type3)
            });

            if (type1_on_side && type_2_on_side && !type_3_on_side) {
                let message = this.type1 + ' and ' + this.type2 + ' are both on ' + side + ' side without ' + this.type3;

                if (this.type2 === 'apple') {
                    return new RiverStatus(message, SeverityLevel.FatalError, new RiverErrorData(this.type2, 'apple_eaten', side))
                } else {
                    return new RiverStatus(message, SeverityLevel.FatalError, new RiverErrorData(this.type2, 'skull', side))
                }

                /*
                if(this.type1 == 'goat') {
                    return new Status(message, herbivoreCode)
                } else if (this.type1 === 'wolf') {
                    return new Status(message, violenceCode)
                } else {
                    return new Status(message, unsortedCode)
                }
                */
            }
        }
        return GenericStatus.NoError
    }
}


class RelativeAmountRule extends RiverCrossingRule {

    constructor(private readonly type1: string, private readonly type2: string) {
        super();
    }


    check(puzzle: RiverPuzzle): Status {
        for (let side of Object.values(Side)) {
            let amount_of_type1_on_side = 0;
            let amount_of_type2_on_side = 0;

            for (let passenger of puzzle.passengers) {
                if (passenger.type === this.type1 && passenger.side === side) {
                    amount_of_type1_on_side++
                } else if (passenger.type === this.type2 && passenger.side === side) {
                    amount_of_type2_on_side++
                }
            }

            if (amount_of_type1_on_side > amount_of_type2_on_side && amount_of_type2_on_side > 0) {
                let message = this.type1 + "s outnumber " + this.type2 + "s on the " + side + " side";

                return new RiverStatus(message, SeverityLevel.FatalError, new RiverErrorData(this.type2, 'skull', side))

                /*
                if(this.type1 === 'vampire') {
                    return new Status(message, violenceCode)
                } else {
                    return new Status(message, unsortedCode)
                }
                */
            }
        }
        return GenericStatus.NoError
    }
}

export const moveBoat = function (...passengers: Array<Passenger>) {

    if (puzzle.fatalErrorRaised) {
        return
    }

    let preCrossingStatus = preCrossingErrors(passengers)
    if (preCrossingStatus !== null) {
        puzzle.addState(preCrossingStatus)
        return
    }

    switchSides(passengers)

    puzzle.boat.side = passengers[0].side;

    for (let rule of puzzle.rules) {
        const postCrossingStatus = rule.check(puzzle);
        if (postCrossingStatus !== GenericStatus.NoError) {
            puzzle.fatalErrorRaised = true
            puzzle.addState(postCrossingStatus)
            return
        }
    }

    if (checkSuccess(puzzle.passengers)) {
        puzzle.addState(RiverStatuses.SuccessStatus)
    } else {
        puzzle.addState(GenericStatus.NoError)
    }
}

function preCrossingErrors(passengers: Passenger[]): Status | null {

    let rowerOnBoat = false;
    let totalPassengerWeight = 0;

    for (let passenger of passengers) {
        totalPassengerWeight += passenger.weight;
        if (puzzle.boat.rowerTypes.indexOf(passenger.type) > -1) {
            rowerOnBoat = true
        }
        if (passenger.side != puzzle.boat.side) {
            //addState(puzzle, new Status(passenger.type + ' not on correct side', nonFatalCode));
            return new Status(passenger.type + ' not on correct side', SeverityLevel.NonFatalError)
        }
    }

    let misplacedPassenger = crossersOnCorrectSide(passengers, puzzle.boat.side)
    if (misplacedPassenger !== undefined) {
        return new Status(misplacedPassenger.type + ' not on correct side', SeverityLevel.NonFatalError)
    }

    if (totalPassengerWeight > puzzle.boat.weightLimit) {
        //addState(puzzle, new Status('boat weight limit exceeded', nonFatalCode));
        return new Status('boat weight limit exceeded', SeverityLevel.NonFatalError)
    }

    if (!rowerOnBoat) {
        //addState(puzzle, new Status('no rower on boat', nonFatalCode));
        return new Status('no rower on boat', SeverityLevel.NonFatalError)
    }

    return null
}

export const initGoatPuzzle = function (): ReadonlyArray<Passenger> {

    const boat = new Boat(['farmer'], 2);
    const passengers = [new Passenger("goat", 1), new Passenger("apple", 1), new Passenger("wolf", 1), new Passenger("farmer", 1)];
    const rules = [new SameSideRule('wolf', 'goat', 'farmer'), new SameSideRule('goat', 'apple', 'farmer')];
    puzzle = new RiverPuzzle(passengers, boat, rules)
    states = puzzle.states

    return puzzle.passengers
};

export const initVampirePuzzle = function (): ReadonlyArray<ReadonlyArray<Passenger>> {

    const boat = new Boat(["vampire", "priest"], 2);

    const passengers = [];
    const vampires = [];
    const priests = [];

    for (let i = 0; i < 3; i++) {
        vampires.push(new Passenger("vampire", 1))
    }

    passengers.push(...vampires);

    for (let i = 0; i < 3; i++) {
        priests.push(new Passenger("priest", 1))
    }

    passengers.push(...priests);

    const rules = [new RelativeAmountRule("vampire", "priest")];
    puzzle = new RiverPuzzle(passengers, boat, rules);
    states = puzzle.states

    return [vampires, priests]
};


export const initSoldierPuzzle = function (): ReadonlyArray<ReadonlyArray<Passenger>> {

    const boat = new Boat(["soldier", "boy"], 3);

    const passengers = [];
    const soldiers = [];
    const boys = [];

    for (let i = 0; i < 6; i++) {
        soldiers.push(new Passenger("soldier", 2))
    }

    passengers.push(...soldiers);

    for (let i = 0; i < 2; i++) {
        boys.push(new Passenger("boy", 1))
    }

    passengers.push(...boys);

    const rules: RiverCrossingRule[] = [];
    puzzle = new RiverPuzzle(passengers, boat, rules);
    states = puzzle.states


    return [soldiers, boys]

};

export const initActorPuzzle = function (): ReadonlyArray<Passenger> {

    const boat = new Boat(["Anne", "Anne_Agent", "Bob", "Bob_Agent"], 2);
    const passengers = [new Passenger("Anne", 1), new Passenger("Anne_Agent", 1), new Passenger("Bob", 1), new Passenger("Bob_Agent", 1)];
    const rules = [new SameSideRule('Anne', 'Bob_Agent', 'Anne_Agent'), new SameSideRule('Bob', 'Anne_Agent', 'Bob_Agent')];
    puzzle = new RiverPuzzle(passengers, boat, rules);
    states = puzzle.states

    return puzzle.passengers

};

let puzzle: RiverPuzzle;
export var states: RiverState[]
//export var states = puzzle.states
