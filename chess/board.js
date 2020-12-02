const squareSize = 75
let screenSize = [600, 600]

function setup()
{
    let canvas = createCanvas(...screenSize)
    canvas.parent("chess-board")

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
                fill(255)
            } else {
                fill(0)
            }
            rect(i*squareSize, j*squareSize, squareSize, squareSize)
        }
    }
}