
import { codeErrorAlert } from './ui/alerts'
import sleep from "./utils";

//Load puzzles
import { goatCabbageWolf, vampirePriest, soldierBoy, agentActor, ghoul } from "./puzzles/puzzle-manager";

let puzzles = new Map();
puzzles.set("Wolves and Goats", goatCabbageWolf);
puzzles.set("Priests and Vampires", vampirePriest);
puzzles.set("Soldiers and Boys", soldierBoy);
puzzles.set("Actors and Agents", agentActor);
puzzles.set("Ghouls and Adventurers", ghoul)

//set current puzzle
let currentPuzzle = puzzles.get(sessionStorage.getItem('puzzleID'));


const runButtonID = "vue-run-button"
let runButtonVueManager = new Vue({
    el: "#" + runButtonID,
    data: {
        runningCode: false,
        text: "Run"
    },
    methods: {
        runUserCode: async function () {
            this.startRunning()
            this.runningCode = true


            if (window.getMarkers) {
                if (window.getMarkers().some(marker => marker.severity == 8 || marker.severity == 4)) {
                    codeErrorAlert()
                    this.stopRunning()
                    return;
                }
            }

            currentPuzzle.setupCode();

            try {
                let codeToExecute = window.puzzledEditor ? window.puzzledEditor.getValue() : '';
                (new Function(...Object.keys(currentPuzzle.__environment__), codeToExecute)(...Object.values(currentPuzzle.__environment__)));
                await currentPuzzle.endCode()
            } catch (error) {
                await currentPuzzle.endCode(error)
            }
            this.stopRunning()
        },
        startRunning: function () {
            this.text = " "
            this.runningCode = true
        },
        stopRunning: function () {
            this.runningCode = false
            this.text = "Run"
        }
    }
})

//Setup Modal Controller
let modalController = require('./ui/modal-controller');
modalController.initModal(currentPuzzle.tutorialData);

async function postSVGInitialization() {

    runButtonVueManager.runUserCode()

    let title = document.createElement('title')
    title.textContent = 'Animation'
    title.id = 'title'
    let description = document.createElement('desc')
    description.textContent = 'Displays the animation'
    description.id = 'desc'

    const svgElement = document.getElementById('animation-container').querySelector('svg')

    svgElement.insertBefore(description, svgElement.childNodes[0])
    svgElement.insertBefore(title, svgElement.childNodes[0])

    svgElement.setAttribute('role', 'img')
    svgElement.setAttribute('aria-labelledby', 'title')
    svgElement.setAttribute('aria-describedby', 'desc')
}

postSVGInitialization()

//Freeze button's height so it doesn't shrink when code is running
const runButton = document.getElementById(runButtonID)
runButton.style.height = (runButton.clientHeight + 4) + "px"


//Wait until monaco editor is loaded, then add puzzle type defs and initial code
async function initializeEditor() {

    while (!window.puzzledEditor || !window.addPuzzleLib) {
        await sleep(10)
    }

    window.addPuzzleLib(currentPuzzle.typeDefs)
    window.puzzledEditor.setValue(currentPuzzle.initialCode)
}

initializeEditor()



