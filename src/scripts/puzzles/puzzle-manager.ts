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

import { initGoatPuzzle, initHusbandPuzzle, initSoldierPuzzle, initVampirePuzzle, moveBoat } from './crossing-puzzles/river-setup'
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
        ["<strong>Function:</strong> <code>moveBoat</code><br>\n<strong>Inputs:</strong> <code>Goat</code>, <code>Wolf</code>, <code>Farmer</code>, <code>Apple</code><br>\n<strong>Number of Inputs:</strong> 1 to 4<br>\n<strong>Description</strong>: Moves its inputs across the river on the boat."]),
    "//Moves the farmer and apple across the river\nmoveBoat(farmer, apple)");

let vampirePriestDir = "vampire-priest/";

export const vampirePriest = new RiverSetup(
    () => {
        let [vampires, priests] = initVampirePuzzle();
        Object.assign(vampirePriest.__environment__, { vampires, priests })
    },
    vampirePriestDir,
    new TutorialData("Get the priests and vampires to the other side of the river using the boat.", ["priest.svg", "vampire.svg"], ["priest", "vampire"], ["The boat can hold a maximum of 2 people.", "The number of vampires cannot exceed the number of priests on either side of the river."],
        ["<strong>Function:</strong> <code>moveBoat</code><br>\n<strong>Inputs:</strong> Objects within the arrays <code>Vampires</code>, <code>Priests</code><br>\n<strong>Number of Inputs:</strong>  0 to 6<br>\n<strong>Description:</strong> Moves vampires and priests across the river."]),
    "//Moves the first vampire and second priest across the river\nmoveBoat(vampires[0], priests[1])");

let soldierBoyDir = "soldier-boy/";

export const soldierBoy = new RiverSetup(
    () => {
        let [soldiers, boys] = initSoldierPuzzle()
        Object.assign(soldierBoy.__environment__, { soldiers, boys })
    },
    soldierBoyDir,
    new TutorialData("Get the soldiers and boys to the other side of the river using the boat.", ["soldier.svg", "boy.svg"], ["soldier", "boy"], ["The boat can carry 2 boys, a solder and a boy, but not 2 soldiers."],
        ["<strong>Function:</strong> <code>moveBoat</code><br>\n<strong>Inputs:</strong> Objects within the arrays <code>Soldiers</code>, <code>Boys</code><br>\n<strong>Number of Inputs:</strong>  0 to 8<br>\n<strong>Description:</strong> Moves soldiers and boys across the river."]),
    "//Moves the first soldier and second boy across the river\nmoveBoat(soldiers[0], boys[1])"
);

let husbandWifeDir = "husband-wife/";

export const husbandWife = new RiverSetup(
    () => {
        let [Bob, Bob_Wife, Charlie, Charlie_Wife] = initHusbandPuzzle()
        Object.assign(husbandWife.__environment__, { Bob, Bob_Wife, Charlie, Charlie_Wife })
    },
    husbandWifeDir,
    new TutorialData("Get the husbands and wives to the other side of the river using the boat.",
        ["Bob.svg", "Bob_Wife.svg", "Charlie.svg", "Charlie_Wife.svg"],
        ["Bob", "Bob_Wife", "Charlie", "Charlie_Wife"],
        ["Charlie cannot be left alone with Bob's wife.",
            "Bob cannot be left alone with Charlie's Wife.",
            "The boat can hold up to 2 people."],
        ["<strong>Function:</strong> <code>moveBoat</code><br>\n<strong>Inputs:</strong> <code>Bob</code>,<code>Bob_Wife</code>,<code>Charlie</code>,<code>Charlie_Wife</code><br>\n<strong>Number of Inputs:</strong>  0 to 4<br>\n<strong>Description:</strong> Moves husbands and wives across the river."]),
    "//Moves Bob and Charlie's Wife across the river\nmoveBoat(Bob, Charlie_Wife)")

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
        ["Alice, Bob, Charlie, and Doris can cross the bridge in 1, 2, 5, and 10 minutes respectively", "All 4 adventurers must cross the bridge in 17 minutes or less, otherwise a ghoul appears", "The bridge can only bear the weight of 2 people at a time", "Crossing the bridge is impossible without a torch"],
        ["<strong>Function:</strong> <code>crossBridge</code><br>\n<strong>Inputs:</strong> <code>Alice</code>, <code>Bob</code>, <code>Charlie</code>, <code>Doris</code><br>\n<strong>Number of Inputs:</strong> 0 to 4<br>\n<strong>Description</strong>: Moves its inputs across the bridge.", "<strong>Function:</strong> <code>giveTorch</code><br>\n<strong>Inputs:</strong> <code>Alice</code>, <code>Bob</code>, <code>Charlie</code>, <code>Doris</code><br>\n<strong>Number of Inputs:</strong> 1<br>\n<strong>Description</strong>: Moves its inputs across the bridge."]),
    "//Moves Alice and Doris across the Bridge\ncrossBridge(Alice, Doris)\n//Gives torch to Doris\ngiveTorch(Doris)"
)

