//The code in this file isn't great because it was my first attempt at creating an animator - look to the "bridge-animator.ts"
//for an example of better code
import { SeverityLevel } from '../base-puzzle-setup'
import { Animator, createDraw } from '../base-animator'
import { states, RiverState, RiverStatuses, Passenger, RiverErrorData } from './river-setup'
import { sortIntoLeftAndRightSides, getMovingCrossers, getBaseDimensions, getCenterY } from './common-animator';
import sleep from '../../utils'
import { Side } from './common-setup';

//let states: State[]

/*
//TODO - avoid having to repeat directory for assets
let baseDir = './assets/river-crossing/';
let commonDir = 'common/';
let specificDir: string
*/


let grassColor = "#80FF72";
let waterColor = "#7EE8FA";

//File extension for images
const extension = '.svg';

const drawings = new Map<number, svgjs.Image>();

//"animation-container" is the id of the div that contains svg
//SVG() is a method supplied by svg.js
//Normally SVG is undefined - but in reality, it isn't because it's supplied by an external script tag
//@ts-ignore
//let draw: svgjs.Doc = SVG('animation-container')

let boat: svgjs.Image
let boatSideLength: number
let boatYCoord: number

let maxCharactersInColumn = 4;
let maxColumns = 2;
const gap = 10;
let characterSideLength: number
let baseHeight: number
let baseWidth: number
let riverBankWidth: number

let leftBankXCoord: number
let rightBankXCoord: number

let animationTime = 1200;


//let addMessage: (message: string, type?: string) => void

export class RiverAnimator implements Animator {

	private readonly baseDir = './assets/river-crossing/';
	private readonly commonDir = 'common/';
	private textPool: svgjs.Text[] = []
	//private readonly draw: svgjs.Doc = createDraw()

	constructor(private readonly addMessage: (message: string, type?: string) => void, private readonly specificDir: string, private readonly draw: svgjs.Doc = createDraw()) {
		//Reset SVG - removes all child elements
		this.draw.clear();

		//Reset the drawing pool
		drawings.clear();
	}

	public async animate(): Promise<void> {

		this.calculateDimensions();

		this.initBackground();

		this.initBoat();

		/*
		TODO - There's probably a better way to write this
		Use the passengers from the first state (states[0]) to initialize the drawings.
		Each passenger has a type. The type determines the filename of the drawing for the passenger.
		E.g - if passenger type is "goat", then the filename is "goat.svg" (if extension equals 'svg')

		Normally passengers don't have an unique ID.
		If 2 passengers are on the same side and have the same type then they are indistinguishable
		This code assigns each passenger a unique ID equal to its index in states[0].passengers and a drawing based on the type name
		The ID and drawing are stored in a map.
		*/

		//states[0].data.passengers

		for (let i = 0; i < states[0].data.passengers.length; i++) {
			let currentPassenger = states[0].data.passengers[i];
			drawings.set(i, this.draw.image(this.baseDir + this.specificDir + currentPassenger.type + extension).size(characterSideLength, characterSideLength))
		}

		for (let state of states) {
			await this.drawFrame(state);

			//0.5 second delay before each frame
			await sleep(500)
		}
	}

	initBoat() {
		const boatSideLengthInCharacters = 2;
		boatSideLength = (characterSideLength * boatSideLengthInCharacters) + gap;
		boatYCoord = getCenterY(boatSideLength, baseHeight);

		//The boat's filename is hardcoded
		//Move the boat to the end of the left river bank
		boat = this.draw.image(this.baseDir + this.commonDir + 'raft.svg').size(boatSideLength, boatSideLength).move(leftBankXCoord + riverBankWidth, boatYCoord)
	}

	async drawFrame(state: RiverState): Promise<void> {

		//the index of the current state
		let i = states.indexOf(state);

		const [leftBankIDs, rightBankIDs] = sortIntoLeftAndRightSides(state.data.passengers)

		let showSuccess = false;
		let throwFatalError = false;

		if (state.status === RiverStatuses.SuccessStatus) {
			showSuccess = true
		} else if (state.status.severityLevel === SeverityLevel.FatalError) {
			throwFatalError = true
		} else if (state.status.severityLevel === SeverityLevel.NonFatalError) {
			this.addMessage('Warning: ' + state.status.event, 'warning')
		}

		let moveDirection = state.data.boat.side;

		//Redraw the canvas in the direction of the movement - if the movement was from right to left ('left')
		//then redraw the right side first
		if (moveDirection === 'left') {
			this.drawRiverBank(rightBankXCoord, rightBankIDs)
		} else {
			this.drawRiverBank(leftBankXCoord, leftBankIDs)
		}

		//this.numberPuzzle()

		if (i !== 0) {
			//Get list of passengers that have moved by checking a passenger's side
			//in the previous state equals their side in the current state
			let prevState = states[i - 1]

			let movingPassengerIDs = getMovingCrossers(state.data.passengers, prevState.data.passengers)

			await this.animateCrossing(movingPassengerIDs, moveDirection);

		}

		if (moveDirection === Side.Left) {
			this.drawRiverBank(leftBankXCoord, leftBankIDs)
		} else {
			this.drawRiverBank(rightBankXCoord, rightBankIDs)
		}

		this.numberPuzzle([], undefined)

		if (throwFatalError) {
			this.displayFatalError(state.status.event, state.status.errorData!, state.data.passengers)
		} else if (showSuccess) {
			this.addMessage(state.status.event, 'success')
		}

		//Put numbers on faces - if necessary
		//Only draw numbers on soldier/priest puzzles
		//this.numberPuzzle()
	}

	numberPuzzle(movingIDs: ReadonlyArray<number>, movingObjects: svgjs.G | undefined) {

		this.textPool.map(text => text.remove())
		this.textPool.splice(0, this.textPool.length)


		let initState = states[0]
		if (initState.data.passengers.some(passenger => passenger.type === 'soldier')) {
			this.numberPassengers('soldier', 'boy', movingIDs, movingObjects)
		} else if (initState.data.passengers.some(passenger => passenger.type === 'priest')) {
			this.numberPassengers('vampire', 'priest', movingIDs, movingObjects)
		}
	}

	numberPassengers(type1: string, type2: string, movingIDs: ReadonlyArray<number>, movingObjects: svgjs.G | undefined) {

		let type1s = states[0].data.passengers.filter(passenger => passenger.type === type1)
		let type2s = states[0].data.passengers.filter(passenger => passenger.type === type2)


		const createText = (displayNum: number, drawingID: number) => {

			const text = this.draw.text(displayNum.toString()).move(drawings.get(drawingID)!.x(), drawings.get(drawingID)!.y()).font({
				weight: '700'
			})
			this.textPool.push(text)

			if (movingIDs.includes(drawingID)) {
				movingObjects!.add(text)
			}
		}

		for (let i = 0; i < type1s.length; i++) {
			createText(i, i)
		}

		for (let i = 0; i < type2s.length; i++) {
			createText(i, type1s.length + i)
		}
	}

	displayFatalError(message: string, errorData: RiverErrorData, passengers: ReadonlyArray<Passenger>) {

		//Don't want skull in wife puzzle
		if (!states[0].data.passengers.find(passenger => ["Bob_Wife", "Charlie_Wife", "Bob", "Charlie"].includes(passenger.type))) {
			this.replaceImage(errorData.oldType, errorData.newType, errorData.side, passengers)
		}
		this.addMessage("Error: " + message)
	}

	replaceImage(oldtype: string, newtype: string, targetSide: Side, passengers: ReadonlyArray<Passenger>) {

		drawings.forEach((drawing, key) => {
			//@ts-ignore drawing.src undefined
			let src: string = drawing.src
			if (src) {
				if (passengers[key].side === targetSide) {
					if (src.split('/').pop()!.slice(0, -extension.length) === oldtype) {
						let oldX = drawing.x()
						let oldY = drawing.y()
						drawing.remove()
						if (oldtype === 'apple') {
							//@ts-ignore drawing.src undefined
							drawing = this.draw.image(drawing.src.replace(oldtype + extension, newtype + extension)).size(characterSideLength, characterSideLength).move(oldX, oldY)
						} else {
							//@ts-ignore drawing.src undefined
							drawing = this.draw.image(drawing.src.replace(drawing.src.split('/').slice(-2).join('/'), 'common/' + newtype + extension)).size(characterSideLength, characterSideLength).move(oldX, oldY)
						}
					}
				}
			}
		})
	}

	async animateCrossing(IDs: ReadonlyArray<number>, direction: string): Promise<void> {

		//draw.group() allows animation of multiple images at once
		let movingObjects = this.draw.group();

		//Don't redraw the boat at the end if no passengers moved
		let refreshBoat = false;
		if (IDs.length > 0) {
			movingObjects.add(boat);
			refreshBoat = true
		}

		const yCoord = getCenterY(characterSideLength, baseHeight);

		if (direction === Side.Right) {

			//startXCoord is the endpoint of the left river bank
			const startXCoord = leftBankXCoord + riverBankWidth;
			let xCoord = startXCoord;

			//Add the drawings one by one
			//Each time a drawing is added, shift to the right by 1 character length + padding before adding another drawing
			for (let id of IDs) {
				let currentDrawing = drawings.get(id);
				currentDrawing!.move(xCoord, yCoord);
				movingObjects.add(currentDrawing!);
				xCoord += (characterSideLength + gap)
			}

			const targetXCoord = rightBankXCoord - boatSideLength;
			const xShift = targetXCoord - startXCoord;

			this.numberPuzzle(IDs, movingObjects)

			movingObjects.animate(animationTime, '-', 0).move(xShift, 0);
			await sleep(animationTime);

			movingObjects.remove();

			if (refreshBoat) {
				boat = this.draw.image(this.baseDir + this.commonDir + 'raft.svg').size(boatSideLength, boatSideLength).y(boatYCoord).x(targetXCoord)
			}
		} else {

			let xCoord = rightBankXCoord - characterSideLength;

			//Add the drawings one by one
			//Each time a drawing is added, shift to the left before adding another drawing
			for (let id of IDs) {
				let currentDrawing = drawings.get(id);
				currentDrawing!.move(xCoord, yCoord);
				movingObjects.add(currentDrawing!);
				xCoord -= (characterSideLength + gap)
			}

			//The end point of the animation - in absolute terms.
			//Equals the end point of the left river bank + the length of the boat
			const targetXCoord = leftBankXCoord + riverBankWidth + boatSideLength;

			//Distance between end point of animation and start point of animation
			//Is negative because groups only accept relative coordinates
			const xShift = -(rightBankXCoord - targetXCoord);

			//Animate objects and wait until the animation is finished

			this.numberPuzzle(IDs, movingObjects)

			movingObjects.animate(animationTime, '-', 0).move(xShift, 0);
			await sleep(animationTime);

			//remove the group and all images inside of it.
			//Without this it is impossible to move the images individually
			movingObjects.remove();

			//Redraw the boat, if necessary.
			if (refreshBoat) {
				boat = this.draw.image(this.baseDir + this.commonDir + 'raft.svg').size(boatSideLength, boatSideLength).y(boatYCoord).x(leftBankXCoord + boatSideLength)
			}
		}

		//Redraw all the images inside the group.
		for (let id of IDs) {
			drawings.set(id, this.draw.image(this.baseDir + this.specificDir + states[0].data.passengers[id].type + extension).size(characterSideLength, characterSideLength))
		}

	}


	calculateDimensions() {

		//Each character has a vertical and horizontal gap between every other character
		const combinedVerticalGapLength = (gap * (maxCharactersInColumn - 1));


		//draw.native() returns the SVG element.
		//The simpler draw.node.clientHeight breaks on Firefox
		///draw.n
		[baseWidth, baseHeight] = getBaseDimensions(this.draw)

		//characterSideLength is the width and height of every character
		//because it is calculated based on the height of the SVG, the animation
		//will break if the SVG has a large height and a small width
		characterSideLength = Math.round((baseHeight - combinedVerticalGapLength) / maxCharactersInColumn);


		leftBankXCoord = 0;

		/*
		Here's an explanatory drawing for the left river bank. The right river bank is the same, except you reflect the drawing across the y-axis.
		Character1 gap Character3 gap (... repeat horizontally until maxColumns is reached)
		Character2 gap Character4 gap
		-----------------------------  = total width of a river bank
		(repeat vertically until maxCharactersInColumn is reached)
		*/
		rightBankXCoord = baseWidth - (maxColumns * characterSideLength) - gap
	}


	initBackground() {

		riverBankWidth = (characterSideLength * maxColumns) + gap;

		let leftbank = this.draw.rect(riverBankWidth, baseHeight).move(0, 0).fill(grassColor);

		leftbank.clone().x(rightBankXCoord);

		//draws the river
		this.draw.rect(baseWidth - riverBankWidth * 2, baseHeight).move(riverBankWidth, 0).fill(waterColor);

		//The parent element has padding - as such a gradient on the parent element
		// is needed to give the illustion that the SVG takes up the entire space of the parent element
		let gradientGreenLeft = riverBankWidth + parseInt(window.getComputedStyle(this.draw.node.parentElement!, null).getPropertyValue('padding-left').replace(/px/g, ''));
		let gradientGreenRight = this.draw.node.parentElement!.offsetWidth - gradientGreenLeft;

		this.draw.node.parentElement!.style.background = "linear-gradient(to right, "
			+ grassColor + " 0%, " + grassColor + " " + gradientGreenLeft + "px, "
			+ waterColor + " " + gradientGreenLeft + "px, "
			+ waterColor + " " + gradientGreenRight + "px, "
			+ grassColor + " " + gradientGreenRight + "px, " + grassColor + " 100%)"

	}

	drawRiverBank(xCoord: number, IDs: ReadonlyArray<number>) {


		let totalCharactersDrawn = 0;
		let currentXCoord = xCoord;

		columnLoop: for (let currentColumn = 0; currentColumn < maxColumns; currentColumn++) {

			let currentYCoord = 0;

			for (let currentRow = 0; currentRow < maxCharactersInColumn; currentRow++) {
				if (totalCharactersDrawn === IDs.length) {
					break columnLoop;
				}

				drawings.get(IDs[totalCharactersDrawn])!.move(currentXCoord, currentYCoord);

				currentYCoord += (characterSideLength + gap);
				totalCharactersDrawn++;
			}
			currentXCoord += characterSideLength;
		}

	}


}






