import { Animator, createDraw } from "../base-animator";
import { getBaseDimensions, sortIntoLeftAndRightSides, getMovingCrossers, finalizeMessages } from "./common-animator";
import sleep from '../../utils'
import { Side } from './common-setup'
import { SeverityLevel } from '../base-puzzle-setup'
import { states, GhoulState, GhoulStatus } from './bridge-setup'

export class BridgeAnimator implements Animator {

	private readonly characterSideLength: number
	private readonly drawings = new Map<number, svgjs.Image>();
	private readonly fileExtension = '.svg'

	private readonly baseWidth: number;
	private readonly baseHeight: number;

	private readonly charsOnSide = 4;
	private readonly sideWidth: number;

	private readonly bridgeHeightToWidthRatio = 140 / 512;
	private readonly bridgeHeight: number;
	private readonly bridgeYCoord: number;
	private timePassedText: svgjs.Text;

	private torch: svgjs.Image;
	private readonly torchHeight: number;


	constructor(private readonly addMessage: (message: string, type?: string) => void, private readonly specificDir: string, private readonly draw: svgjs.Doc = createDraw()) {
		this.draw.clear();

		[this.baseWidth, this.baseHeight] = getBaseDimensions(this.draw)
		console.log(this.baseHeight)
		this.characterSideLength = this.baseWidth / 16
		this.sideWidth = this.characterSideLength * this.charsOnSide;
		this.bridgeHeight = (this.baseWidth - (2 * this.sideWidth)) * this.bridgeHeightToWidthRatio
		this.bridgeYCoord = this.baseHeight - this.bridgeHeight
		console.log(this.bridgeHeight)
		console.log(this.bridgeYCoord)
		this.timePassedText = this.draw.text("Time passed: " + 0)
		this.timePassedText.font({
			family: 'Helvetica',
			size: 30
		});
		this.torchHeight = this.characterSideLength
		this.torch = this.createTorch()
	}

	private createTorch(): svgjs.Image {
		return this.draw.image(this.specificDir + 'torch' + this.fileExtension).size(this.characterSideLength / 2, this.characterSideLength)
	}

	async animate(): Promise<void> {

		this.setupBackground()

		for (let i = 0; i < states[0].data.adventurers.length; i++) {
			let currentAdventurer = states[0].data.adventurers[i];
			this.drawings.set(i, this.draw.image(this.specificDir + currentAdventurer.name + this.fileExtension).size(this.characterSideLength, this.characterSideLength))
		}

		for (let state of states) {
			await this.drawFrame(state);

			//0.5 second delay before each frame
			await sleep(500)
		}
	}

	private async drawFrame(state: GhoulState): Promise<void> {

		//the index of the current state
		let i = states.indexOf(state);


		let [leftBankIDs, rightBankIDs] = sortIntoLeftAndRightSides(state.data.adventurers)

		if (i === 0) {
			this.drawBridgeSide(Side.Left, leftBankIDs);
			this.drawBridgeSide(Side.Right, rightBankIDs)
		} else {

			let showSuccess = false;
			let throwFatalError = false;

			if (state.status === GhoulStatus.SuccessStatus) {
				showSuccess = true
			} else if (state.status.severityLevel === SeverityLevel.FatalError) {
				throwFatalError = true
			} else if (state.status.severityLevel === SeverityLevel.NonFatalError) {
				this.addMessage('Warning: ' + state.status.event, 'warning')
			}

			//Get move direction
			let moveDirection = state.data.moveDirection

			if (moveDirection === Side.Left) {
				this.drawBridgeSide(Side.Right, rightBankIDs)
			} else {
				this.drawBridgeSide(Side.Left, leftBankIDs)
			}

			let prevState = states[i - 1]

			let movingPassengerIDs: ReadonlyArray<number> = getMovingCrossers(state.data.adventurers, prevState.data.adventurers)

			await this.animateCrossing(movingPassengerIDs, moveDirection, state);

			if (moveDirection === Side.Left) {
				this.drawBridgeSide(Side.Left, leftBankIDs)
			} else {
				this.drawBridgeSide(Side.Right, rightBankIDs)
			}

			if (throwFatalError) {
				this.displayFatalError(state.status.event)
			} else if (showSuccess) {
				this.addMessage(state.status.event, 'success')
			}
		}

		this.updateTimePassed(state.data.timePassed)
		this.updateTorch(state)

		if (sessionStorage.getItem('accessibility') === 'yes') {
			if (i === states.length - 1) {
				let description: string[] = []

				state.data.adventurers.forEach(val => {
					description.push(`${val.name} is on the ${val.side} side.`)
				})

				this.addMessage(finalizeMessages(description, "Final state:", `${this.getAdventurerWithTorch(state)} has the torch`), 'success')
			}
		}

	}

	private displayFatalError(message: string) {

		let ghostSideLen = this.characterSideLength * 3;
		this.draw.image(this.specificDir + 'ghost' + this.fileExtension).size(ghostSideLen, ghostSideLen).move(this.baseWidth / 2 - ghostSideLen / 2, this.bridgeYCoord - ghostSideLen - ghostSideLen / 2);

		this.addMessage("Error: " + message)
	}

	private updateTimePassed(timePassed: number) {
		this.timePassedText.text("Time Passed: " + timePassed)
	}

	private getAdventurerWithTorch(state: GhoulState): string {
		let [adventurerName] = state.data.adventurers.filter(adventurer => adventurer.hasTorch).map(adventurer => adventurer.name)
		return adventurerName
	}

	private updateTorch(state: GhoulState) {

		//let [adventurerName] = state.data.adventurers.filter(adventurer => adventurer.hasTorch).map(adventurer => adventurer.name)
		let adventurerName = this.getAdventurerWithTorch(state)
		let [adventurerID] = state.data.adventurers.filter(adventurer => adventurer.name === adventurerName).map(adventurer => state.data.adventurers.indexOf(adventurer))

		let image = this.drawings.get(adventurerID)
		this.moveTorch(image!)
	}

	private moveTorch(image: svgjs.Image) {
		this.torch.move(image.x() + this.characterSideLength / 4, this.bridgeYCoord - this.characterSideLength - this.torchHeight)
	}

	private async animateCrossing(IDs: ReadonlyArray<number>, moveDirection: Side | null, state: GhoulState) {
		const animationTime = 1200;

		if (moveDirection === null) {
			throw "Internal Error - moveDirection cannot be null. Report this to the developer."
		}

		if (IDs.length === 0) {
			return
		}

		let movingChars = this.draw.group()

		let increment = this.characterSideLength
		let startXCoord = this.sideWidth
		let endXCoord = this.baseWidth - this.sideWidth

		if (moveDirection === Side.Left) {
			increment *= -1
			startXCoord = this.baseWidth - this.sideWidth
			endXCoord = this.sideWidth
		}

		let xCoord = startXCoord
		let xShift = endXCoord - startXCoord

		for (const id of IDs) {
			let currentDrawing = this.drawings.get(id);
			currentDrawing!.move(xCoord, this.bridgeYCoord - this.characterSideLength);
			movingChars.add(currentDrawing!);
			if (state.data.adventurers[id].hasTorch) {
				this.moveTorch(currentDrawing!)
				movingChars.add(this.torch)
			}
			xCoord += increment
		}

		movingChars.animate(animationTime, '-', 0).move(xShift, 0);
		await sleep(animationTime);
		movingChars.remove();

		for (const id of IDs) {
			this.drawings.set(id, this.draw.image(this.specificDir + states[0].data.adventurers[id].name + this.fileExtension).size(this.characterSideLength, this.characterSideLength))
		}

		this.torch = this.createTorch()
	}

	private drawBridgeSide(side: Side, IDs: ReadonlyArray<number>) {

		let currentCoord: number;
		let increment = this.characterSideLength;

		if (side === Side.Left) {
			currentCoord = 0;
		} else {
			currentCoord = this.baseWidth;
			increment *= -1
			currentCoord += increment
		}

		for (let id of IDs) {
			this.drawings.get(id)!.move(currentCoord, this.bridgeYCoord - this.characterSideLength)
			currentCoord += increment;
		}
	}

	private setupBackground() {
		let bridgeWidth = this.baseWidth - (2 * this.sideWidth)
		this.draw.image(this.specificDir + 'bridge' + this.fileExtension).size(bridgeWidth, this.bridgeHeight).move(this.sideWidth, this.bridgeYCoord)

		let leftSide = this.draw.rect().size(this.sideWidth, this.bridgeHeight).move(0, this.bridgeYCoord).fill("#A9A9A9")
		leftSide.clone().move(this.baseWidth - this.sideWidth, this.bridgeYCoord)
	}
}