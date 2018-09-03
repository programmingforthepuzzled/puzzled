//This may get changed to an abstract class if the the draw object is common amongst all animators
export interface Animator {

    animate(): Promise<void>

}

export const createDraw = function (): svgjs.Doc {
    let id = 'animation-container'
    let animationContainer = document.getElementById(id)
    animationContainer!.style.background = ""
    while (animationContainer!.firstChild) {
        animationContainer!.removeChild(animationContainer!.firstChild!)
    }
    //@ts-ignore
    return SVG(id)
}