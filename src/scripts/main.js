//Required for support of async/await on older browsers
import 'regenerator-runtime/runtime'
import { codeErrorAlert } from './ui/alerts'

//Setup Ace Editor
let editor = ace.edit('editor');
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.setShowPrintMargin(false);
editor.getSession().setUseWrapMode(true);
editor.setFontSize(20)

import { goatCabbageWolf, vampirePriest, soldierBoy, husbandWife, ghoul } from "./puzzles/puzzle-manager";

let puzzles = new Map();
puzzles.set("Animals and Vegetables", goatCabbageWolf);
puzzles.set("Priests and Vampires", vampirePriest);
puzzles.set("Soldiers and Boys", soldierBoy);
puzzles.set("Husbands and Wives", husbandWife);
puzzles.set("Ghouls and Adventurers", ghoul)

//set current puzzle
let currentPuzzle = puzzles.get(sessionStorage.getItem('puzzleID'));

//Setup Modal Controller
let modalController = require('./ui/modal-controller');
modalController.initModal(currentPuzzle.tutorialData);


let runButtonVueManager = new Vue({
    el: "#vue-run-button",
    data: {
        runningCode: false,
    },
    methods: {
        runUserCode: async function () {
            this.runningCode = true

            for (let annotation of editor.getSession().getAnnotations()) {
                if (annotation.type === 'warning' || annotation.type === 'error') {
                    codeErrorAlert()
                    this.runningCode = false
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

            this.runningCode = false
        }
    }
})

runButtonVueManager.runUserCode()





