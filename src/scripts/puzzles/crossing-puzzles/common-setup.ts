export enum Side {
    Left = 'left',
    Right = 'right'
}

export interface Crosser {
    side: Side
}

//The syntax for calling this can be made better using an interface
export const checkSuccess = function (crossers: ReadonlyArray<Crosser>): boolean {

    //find returns undefined if there are no matches (no crossers on the left side)
    //! converts undefined to true
    return !crossers.find(crosser => crosser.side === Side.Left)
}

export const crossersOnCorrectSide = function <T extends Crosser>(crossers: T[], correctSide: Side): T | undefined {
    let result = crossers.find(crosser => { return crosser.side !== correctSide })

    if (result !== undefined) {
        return result
    }

    return undefined
}

export const switchSides = function (crossers: Crosser[]): void {

    let moveDirection: Side;

    /*
    This code has the implicit assumption that:
        1] There is at least 1 moving passenger
        2] All moving passengers are on the same side
    */

    if (crossers[0].side === Side.Left) {
        moveDirection = Side.Right
    } else {
        moveDirection = Side.Left
    }

    crossers.map(crosser => crosser.side = moveDirection)

}