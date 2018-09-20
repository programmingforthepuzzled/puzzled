import { codeErrorAlert } from '../ui/alerts'
//@ts-ignore - no module defs for JS file
import * as MessageDisplay from '../ui/message-view'

import { Animator } from './base-animator'


class TutorialData {

    //static riverCrossingBaseDir = "./assets/river-crossing/";

    constructor(public objective: string, public images: string[], public imageCaptions: string[], public rules: string[], public code: string[], public active = true) { }

}

abstract class PuzzleSetup {

    async endCode(runtimeError: Error) {

        let animator = this.createAnimator()
        await animator.animate()

        if (runtimeError !== undefined) {
            let lineNum: number

            let extractedlineNum = /<anonymous>:(\d+)/.exec(JSON.stringify(runtimeError, Object.getOwnPropertyNames(runtimeError)));

            //@ts-ignore Error has no property lineNumber (lineNumber is a non standard FF field)
            if (runtimeError.lineNumber !== undefined) {
                //@ts-ignore Same as previous line
                lineNum = runtimeError.lineNumber - 2
            } else if (extractedlineNum !== null) {
                lineNum = parseInt(extractedlineNum[1]) - 2
            } else {
                codeErrorAlert()
            }

            //@ts-ignore - ignore lineNum used before initialized (already know that)
            if (lineNum !== undefined) {
                MessageDisplay.addMessage("Exception at line " + lineNum + ": " + '"' + runtimeError.message + '"')
            }
        }

    }

    setupCode: () => void

    public readonly abstract __environment__: Object

    abstract createAnimator(): Animator

    protected constructor(specificSetupCode: Function, public readonly tutorialData: TutorialData, public readonly initialCode: string) {

        this.setupCode = () => {
            MessageDisplay.clearMessages()
            specificSetupCode()
        }
    }
}

abstract class StandardSetup extends PuzzleSetup {

    abstract animatorConstructor: new (addMessage: (message: string, type?: string) => void, assetsDir: string) => Animator

    createAnimator() {
        return new this.animatorConstructor(MessageDisplay.addMessage, this.assetsDir)
    }

    constructor(public readonly assetsDir: string, specificSetupCode: Function, tutorialData: TutorialData, initialCode: string) {
        super(specificSetupCode, tutorialData, initialCode)
    }

}

import { giveTorch, crossBridge, initGhoulPuzzle } from './crossing-puzzles/bridge-setup'
import { BridgeAnimator } from './crossing-puzzles/bridge-animator'

class BridgeSetup extends StandardSetup {
    __environment__ = { giveTorch: giveTorch, crossBridge: crossBridge }

    animatorConstructor = BridgeAnimator

    constructor(specificSetupCode: Function, assetsDir: string, tutorialData: TutorialData, initialCode: string) {
        super(assetsDir, specificSetupCode, tutorialData, initialCode)
        this.tutorialData.images = this.tutorialData.images.map(image => this.assetsDir + image)
    }

}

import { initGoatPuzzle, initActorPuzzle, initSoldierPuzzle, initVampirePuzzle, moveBoat } from './crossing-puzzles/river-setup'
import { RiverAnimator } from './crossing-puzzles/river-animator';

class RiverSetup extends StandardSetup {

    __environment__ = { moveBoat: moveBoat }

    animatorConstructor = RiverAnimator

    constructor(specificSetupCode: Function, assetsDir: string, tutorialData: TutorialData, initialCode: string) {
        super(assetsDir, specificSetupCode, tutorialData, initialCode)
        this.tutorialData.images = this.tutorialData.images.map(image => './assets/river-crossing/' + this.assetsDir + image)
    }
}

let goatCabbageWolfDir = "goat-apple-wolf/";



export const goatCabbageWolf = new RiverSetup(
    () => {
        let [goat, apple, wolf, farmer] = initGoatPuzzle();
        Object.assign(goatCabbageWolf.__environment__, { goat, apple, wolf, farmer })
    },
    goatCabbageWolfDir,
    new TutorialData("Get the wolf, goat, farmer, and apple to the right side of the river using the boat.",
        ["wolf.svg", "goat.svg", "farmer.svg", "apple.svg"],
        ["wolf", "goat", "farmer", "apple"],
        ["The wolf cannot be left alone with the goat.",
            "The goat cannot be left alone with the apple.",
            "Only the farmer can row the boat.",
            "The boat can hold up to 2 objects."],
        ["<strong>Function:</strong> <code>moveBoat</code><br>\n<strong>Inputs:</strong> <code>goat</code>, <code>wolf</code>, <code>farmer</code>, <code>apple</code><br>\n<strong>Number of Inputs:</strong> 1 to 2<br>\n<strong>Description</strong>: Moves objects across the river on the boat."]),
    "//Moves the farmer and apple across the river\nmoveBoat(farmer, apple)");

let vampirePriestDir = "vampire-priest/";

export const vampirePriest = new RiverSetup(
    () => {
        let [vampires, priests] = initVampirePuzzle();
        Object.assign(vampirePriest.__environment__, { vampires, priests })
    },
    vampirePriestDir,
    new TutorialData("Get three priests and three vampires to the other side of the river using the boat.", ["priest.svg", "vampire.svg"], ["priest", "vampire"], ["The boat can hold a maximum of 2 people.", "The number of vampires cannot exceed the number of priests on either side of the river.", "Anyone can row the boat."],
        ["<strong>Function:</strong> <code>moveBoat</code><br>\n<strong>Inputs:</strong> Objects within the arrays <code>vampires</code>, <code>priests</code><br>\n<strong>Number of Inputs:</strong> 1 to 2<br>\n<strong>Description:</strong> Moves vampires and priests across the river."]),
    "//Moves the first vampire and second priest across the river\nmoveBoat(vampires[0], priests[1])");

let soldierBoyDir = "soldier-boy/";

export const soldierBoy = new RiverSetup(
    () => {
        let [soldiers, boys] = initSoldierPuzzle()
        Object.assign(soldierBoy.__environment__, { soldiers, boys })
    },
    soldierBoyDir,
    new TutorialData("Get six soldiers and two boys to the other side of the river using the boat.", ["soldier.svg", "boy.svg"], ["soldier", "boy"], ["The boat can carry 2 boys, a soldier and a boy, but not 2 soldiers."],
        ["<strong>Function:</strong> <code>moveBoat</code><br>\n<strong>Inputs:</strong> Objects within the arrays <code>soldiers</code>, <code>boys</code><br>\n<strong>Number of Inputs:</strong>  1 to 2<br>\n<strong>Description:</strong> Moves soldiers and boys across the river."]),
    "//Move the first soldier and second boy across the river\nmoveBoat(soldiers[0], boys[1])\n\n//This is a for loop - it is used for repeating an action\n//Move the first soldier across the river 3 times\nfor(var i = 0; i < 3; i++) {\n    moveBoat(soldiers[0])\n}"
);

let agentActorDir = "agent-actor/";

export const agentActor = new RiverSetup(
    () => {
        let [Anne, Anne_Agent, Bob, Bob_Agent] = initActorPuzzle()
        Object.assign(agentActor.__environment__, { Bob, Bob_Agent, Anne, Anne_Agent })
    },
    agentActorDir,
    new TutorialData("Get the actors and their paranoid agents to the other side of the river using the boat.",
        ["Anne.svg", "Anne_Agent.svg", "Bob.svg", "Bob_Agent.svg"],
        ["Anne", "Anne_Agent", "Bob", "Bob_Agent"],
        ["The boat can hold up to 2 people.",
            "No actor can be in the presence of another actor's agent unless their own agent is also present, because each agent is worried their rival will poach their client",
            "Anyone can row the boat."],
        ["<strong>Function:</strong> <code>moveBoat</code><br>\n<strong>Inputs:</strong> <code>Anne</code>,<code>Anne_Agent</code>,<code>Bob</code>,<code>Bob_Agent</code><br>\n<strong>Number of Inputs:</strong>  1 to 2<br>\n<strong>Description:</strong> Moves agents and actors across the river."]),
    "//Moves Anne and her agent across the river\nmoveBoat(Anne, Anne_Agent)")

let ghoulDir = "./assets/bridge-crossing/ghoul-adventurer/";

export const ghoul = new BridgeSetup(
    () => {
        let [Alice, Bob, Charlie, Doris] = initGhoulPuzzle()
        Object.assign(ghoul.__environment__, { Alice, Bob, Charlie, Doris })
    },
    ghoulDir,
    new TutorialData("Get all four adventurers to the other side of the bridge.",
        ["Alice.svg", "Bob.svg", "Charlie.svg", "Doris.svg"],
        ["Alice", "Bob", "Charlie", "Doris"],
        ["Alice, Bob, Charlie, and Doris can cross the bridge in 1, 2, 5, and 10 minutes respectively", "All 4 adventurers must cross the bridge in 17 minutes or less, otherwise a ghoul appears", "The bridge can only bear the weight of 2 people at a time", "Crossing the bridge is impossible without the torch"],
        ["<strong>Function:</strong> <code>crossBridge</code><br>\n<strong>Inputs:</strong> <code>Alice</code>, <code>Bob</code>, <code>Charlie</code>, <code>Doris</code><br>\n<strong>Number of Inputs:</strong> 1 to 2<br>\n<strong>Description</strong>: Moves adventurers across the bridge.", "<strong>Function:</strong> <code>giveTorch</code><br>\n<strong>Inputs:</strong> <code>Alice</code>, <code>Bob</code>, <code>Charlie</code>, <code>Doris</code><br>\n<strong>Number of Inputs:</strong> 1<br>\n<strong>Description</strong>: Gives the torch to an adventurer."]),
    "//Moves Alice and Doris across the Bridge\ncrossBridge(Alice, Doris)\n//Gives torch to Doris\ngiveTorch(Doris)"
)

