//Required for support of async/await on older browsers
import 'regenerator-runtime/runtime'
import { codeErrorAlert } from './ui/alerts'

/*
//Setup Ace Editor
let editor = ace.edit('editor');
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.setShowPrintMargin(false);
editor.getSession().setUseWrapMode(true);
editor.setFontSize(20)
*/

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

            for (let annotation of editor.getSession().getAnnotations()) {
                if (annotation.type === 'warning' || annotation.type === 'error') {
                    codeErrorAlert()
                    this.stopRunning()
                    return;
                }
            }

            currentPuzzle.setupCode();

            try {
                (new Function(...Object.keys(currentPuzzle.__environment__), editor.getValue())(...Object.values(currentPuzzle.__environment__)));

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

import { goatCabbageWolf, vampirePriest, soldierBoy, agentActor, ghoul } from "./puzzles/puzzle-manager";

let puzzles = new Map();
puzzles.set("Wolves and Goats", goatCabbageWolf);
puzzles.set("Priests and Vampires", vampirePriest);
puzzles.set("Soldiers and Boys", soldierBoy);
puzzles.set("Actors and Agents", agentActor);
puzzles.set("Ghouls and Adventurers", ghoul)

//set current puzzle
let currentPuzzle = puzzles.get(sessionStorage.getItem('puzzleID'));

//Setup Modal Controller
let modalController = require('./ui/modal-controller');
modalController.initModal(currentPuzzle.tutorialData);

runButtonVueManager.runUserCode()
//Freeze button's height so it doesn't shrink when code is running
const runButton = document.getElementById(runButtonID)
runButton.style.height = (runButton.clientHeight + 4) + "px"
//console.log(document.getElementById('vue-run-button').clientHeight)
editor.setValue(currentPuzzle.initialCode)




