let screenSize = 600
const squareSize = screenSize / 8

function setup()
{
    let canvas = createCanvas(screenSize, screenSize)
    canvas.parent("chess-board")
    canvas.class('game')

}

function draw()
{
    background(100)
    showGrid()
}


function showGrid(){
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i+j)%2 === 0) {
                fill("#F0D9B2")
            } else {
                fill("#B58860")
            }
            rect(i*squareSize, j*squareSize, squareSize, squareSize)
        }
    }
}