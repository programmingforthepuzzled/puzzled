import { Crosser, Side } from './common-setup'

export const sortIntoLeftAndRightSides = function (crossers: ReadonlyArray<Crosser>): ReadonlyArray<ReadonlyArray<number>> {

    function sortIntoSide(crossers: ReadonlyArray<Crosser>, side: Side): number[] {
        return crossers.filter(crosser => crosser.side == side).map(crosser => crossers.indexOf(crosser))
    }

    return [sortIntoSide(crossers, Side.Left), sortIntoSide(crossers, Side.Right)]

}

export const getMovingCrossers = function (currentCrossers: ReadonlyArray<Crosser>, prevCrossers: ReadonlyArray<Crosser>): ReadonlyArray<number> {

    return currentCrossers.filter(crosser => crosser.side !== prevCrossers[currentCrossers.indexOf(crosser)].side).map(crosser => currentCrossers.indexOf(crosser))

}

export const getBaseDimensions = function (draw: svgjs.Doc): number[] {
    let boundingRect = draw.native().getBoundingClientRect()
    return [boundingRect.width, boundingRect.height]
}

export const getCenterY = function (imageHeight: number, totalHeight: number) {
    return totalHeight / 2 - (imageHeight / 2)
}

export const finalizeMessages = function (messages: string[], ...prepends: string[]): string {
    let rightBank: string[] = []
    let leftBank: string[] = []

    messages.map(text => {
        if (text.includes('is on the right side')) {
            rightBank.push(text)
        } else {
            leftBank.push(text)
        }
    })

    messages = leftBank.concat(rightBank)

    messages = prepends.concat(messages)

    return messages.join('<br>')
}