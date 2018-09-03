import { codeErrorAlert } from '../ui/alerts'
//@ts-ignore - no module defs for JS file
import * as MessageDisplay from '../ui/message-view'

import { Animator } from './base-animator'


class TutorialData {

    //static riverCrossingBaseDir = "./assets/river-crossing/";

    constructor(public objective: string, public images: string[], public rules: string[], public code: string[], public active = true) { }

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

    protected constructor(specificSetupCode: Function, public readonly tutorialData: TutorialData) {

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

    constructor(public readonly assetsDir: string, specificSetupCode: Function, tutorialData: TutorialData) {
        super(specificSetupCode, tutorialData)
    }

}

import { giveTorch, crossBridge, initGhoulPuzzle } from './crossing-puzzles/bridge-setup'
import { BridgeAnimator } from './crossing-puzzles/bridge-animator'

class BridgeSetup extends StandardSetup {
    __environment__ = { giveTorch: giveTorch, crossBridge: crossBridge }

    animatorConstructor = BridgeAnimator

    constructor(specificSetupCode: Function, assetsDir: string, tutorialData: TutorialData) {
        super(assetsDir, specificSetupCode, tutorialData)
        this.tutorialData.images = this.tutorialData.images.map(image => this.assetsDir + image)
    }

}
``

import { initGoatPuzzle, initHusbandPuzzle, initSoldierPuzzle, initVampirePuzzle, moveBoat } from './crossing-puzzles/river-setup'
import { RiverAnimator } from './crossing-puzzles/river-animator';

class RiverSetup extends StandardSetup {

    __environment__ = { moveBoat: moveBoat }

    animatorConstructor = RiverAnimator

    constructor(specificSetupCode: Function, assetsDir: string, tutorialData: TutorialData) {
        super(assetsDir, specificSetupCode, tutorialData)
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
    new TutorialData("Get the wolf, goat, farmer, and apple to the right side of the river using the boat.", ["wolf.svg", "goat.svg", "farmer.svg", "apple.svg"], ["The wolf cannot be left alone with the goat.",
        "The goat cannot be left alone with the apple.",
        "Only the farmer can row the boat.",
        "The boat can hold up to 2 objects."],
        ["<p><code>moveBoat</code> is a function that moves the boat to the opposite side of the river. It accepts any number of the following objects: <code>wolf</code>, <code>goat</code>,<code>apple</code>, or <code>farmer</code>." +
            " An example use would be <code>moveBoat(farmer, goat)</code>.</p>"]));

let vampirePriestDir = "vampire-priest/";

export const vampirePriest = new RiverSetup(
    () => {
        let [vampires, priests] = initVampirePuzzle();
        Object.assign(vampirePriest.__environment__, { vampires, priests })
    },
    vampirePriestDir,
    new TutorialData("Get the priests and vampires to the other side of the river using the boat.", ["priest.svg", "vampire.svg"], ["The boat can hold a maximum of 2 people.", "The number of vampires cannot exceed the number of priests on either side of the river."],
        ["<p><code>priests</code> and <code>vampires</code> are arrays that contain 3 vampire and priest objects each. <code>priests[0]</code> and <code>vampires[0]</code> are the first priest and vampire respectively. <code>priests[1]</code> and <code>vampires[1]</code> are the second priest and vampire respectively. Repeat for all priests and vampires.</p>",
            "<p><code>moveBoat</code> is a function that accepts any number of priest and vampire objects. An example usage would be <code>moveBoat(priests[0], vampires[0])</code> or <code>moveBoat(vampires[0], vampires[1])</code>.</p>"]));

let soldierBoyDir = "soldier-boy/";

export const soldierBoy = new RiverSetup(
    () => {
        let [soldiers, boys] = initSoldierPuzzle()
        Object.assign(soldierBoy.__environment__, { soldiers, boys })
    },
    soldierBoyDir,
    new TutorialData("Get the soldiers and boys to the other side of the river using the boat.", ["soldier.svg", "boy.svg"], ["The boat can carry 2 boys, a solder and a boy, but not 2 soldiers."],
        ["<p><code>soldiers</code> and <code>boys</code> are arrays that contain 6 soldiers and 2 boys respectively. <code>soldiers[0]</code> and <code>boys[0]</code> are the first soldier and boy respectively. <code>soldiers[1]</code> and <code>boys[1]</code> are the second soldier and boy respectively. Repeat for all remaining soldiers.</p>",
            "<p><code>moveBoat</code> is a function that accepts any number of soldier and boy objects. An example usage would be <code>moveBoat(soldiers[0], boys[0])</code> or <code>moveBoat(soldiers[0], soldiers[1])</code>.</p>"])
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
        ["Charlie cannot be left alone with Bob's wife.",
            "Bob cannot be left alone with Charlie's Wife.",
            "The boat can hold up to 2 people."],
        ["<p><code>moveBoat</code> is a function that moves the boat to the opposite side of the river. It accepts any number of the following objects: <code>Bob</code>, <code>Bob_Wife</code>,<code>Charlie</code>, or <code>Charlie_Wife</code>." +
            " An example use would be <code>moveBoat(Bob, Charlie_Wife)</code>.</p>"]))

let ghoulDir = "./assets/bridge-crossing/ghoul-adventurer/";

export const ghoul = new BridgeSetup(
    () => {
        let [Alice, Bob, Charlie, Doris] = initGhoulPuzzle()
        Object.assign(ghoul.__environment__, { Alice, Bob, Charlie, Doris })
    },
    ghoulDir,
    new TutorialData("Get all four adventurers to the other side of the bridge.",
        ["Alice.svg", "Bob.svg", "Charlie.svg", "Doris.svg"],
        [""],
        [])
)

