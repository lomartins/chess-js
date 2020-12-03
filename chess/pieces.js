const TEAM = {
    WHITE: 'white',
    BLACK: 'black'
}

class Piece {
    constructor(x, y, team) {
        this.matrixPosition = createVector(x, y)
        this.pixelPosition = createVector(x*tileSize + tileSize/2, y*tileSize + tileSize/2)

        this.taken = false;
        this.team = team;
    }

    show() {}
    move() {}
}

class King extends Piece {
    constructor(x, y, team) {
        super(x, y, team);
    }

    show() {
        
        switch(this.team) {
            case TEAM.WHITE:
                fill(255, 255, 255)
                break
            case TEAM.BLACK:
                fill(0, 0, 0)
                break
            default:
                fill("#f00")
        }
        textSize(30)
        textAlign(CENTER, CENTER)
        text("K", this.pixelPosition.x, this.pixelPosition.y)
    }
    move(x, y) {
        this.matrixPosition = createVector(x, y)
        this.pixelPosition = createVector(x*tileSize + tileSize/2, y*tileSize + tileSize/2)
    }
}