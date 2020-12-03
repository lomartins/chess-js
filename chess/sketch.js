let screenSize = 600
const tileSize = screenSize / 8

let board
let moving = false
let movingPiece

function setup()
{
    let canvas = createCanvas(screenSize, screenSize)
    canvas.parent("chess-board")
    canvas.class('game')

    board = new Board()
}

function draw()
{
    background(100)
    showGrid()
    board.show()
}


function showGrid(){
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i+j)%2 === 0) {
                fill("#F0D9B2")
            } else {
                fill("#B58860")
            }
            rect(i*tileSize, j*tileSize, tileSize, tileSize)
        }
    }
}

function mousePressed() {
    var x = floor(mouseX/tileSize)
    var y = floor(mouseY/tileSize)
    if (!moving) {
        if (board.pieceAt(x, y)) {
            movingPiece = board.getPieceAt(x, y)
            movingPiece.movingThisPiece = true
            moving = true
        }
    } else {
        if (movingPiece != null) {
            movingPiece.move(x, y)
            movingPiece.movingThisPiece = false
            movingPiece = null
        }
        moving = !moving
    }
}