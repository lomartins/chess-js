const TEAM = {
    WHITE: 'white',
    BLACK: 'black'
}

class Piece {
    constructor(x, y, team) {
        this.matrixPosition = createVector(x, y)
        this.pixelPosition = createVector(x*tileSize + tileSize/2, y*tileSize + tileSize/2)

        this.taken = false
        this.team = team
        this.movingThisPiece = false
        this.letter = '?'
    }

    isMatrixPositionAt(x, y) {
        return this.matrixPosition.x == x && this.matrixPosition.y == y
    }

    show() {
        if (!this.taken) {
            imageMode(CENTER)
            if (this.movingThisPiece) {
                image(this.sprite, mouseX, mouseY, tileSize, tileSize)
            } else {
                image(this.sprite, this.pixelPosition.x, this.pixelPosition.y, tileSize * 0.85, tileSize * 0.85)
            }
        }
    }

    move(x, y) {
        if (board.pieceAt(x, y) && board.getPieceAt(x, y) != this) {
            board.getPieceAt(x, y).die()

        }
        if (x < 8 && x >= 0 && y < 8 && y >= 0) {
            this.matrixPosition = createVector(x, y);
            this.pixelPosition = createVector(x * tileSize + tileSize / 2, y *tileSize + tileSize / 2);
        }
    }

    die() {
        this.taken = true
        this.matrixPosition = createVector(-1, -1);
        this.pixelPosition = createVector(-1, -1);
        deathSound.play()
    }
}

class King extends Piece {
    constructor(x, y, team) {
        super(x, y, team);
        switch(team) {
            case TEAM.WHITE:
                this.sprite = spriteMapper["white_king"]
                break
            case TEAM.BLACK:
                this.sprite = spriteMapper["black_king"]
                break
            default:
                break;
        }
    }
}

class Queen extends Piece {
    constructor(x, y, team) {
        super(x, y, team);
        switch(team) {
            case TEAM.WHITE:
                this.sprite = spriteMapper["white_queen"]
                break
            case TEAM.BLACK:
                this.sprite = spriteMapper["black_queen"]
                break
            default:
                break;
        }
        
    }
}

class Rook extends Piece {
    constructor(x, y, team) {
        super(x, y, team);
        switch(team) {
            case TEAM.WHITE:
                this.sprite = spriteMapper["white_rook"]
                break
            case TEAM.BLACK:
                this.sprite = spriteMapper["black_rook"]
                break
            default:
                break;
        }
    }
}

class Bishop extends Piece {
    constructor(x, y, team) {
        super(x, y, team);
        switch(team) {
            case TEAM.WHITE:
                this.sprite = spriteMapper["white_bishop"]
                break
            case TEAM.BLACK:
                this.sprite = spriteMapper["black_bishop"]
                break
            default:
                break;
        }
    }
}

class Knight extends Piece {
    constructor(x, y, team) {
        super(x, y, team);
        switch(team) {
            case TEAM.WHITE:
                this.sprite = spriteMapper["white_knight"]
                break
            case TEAM.BLACK:
                this.sprite = spriteMapper["black_knight"]
                break
            default:
                break;
        }
    }
}

class Pawn extends Piece {
    constructor(x, y, team) {
        super(x, y, team);
        switch(team) {
            case TEAM.WHITE:
                this.sprite = spriteMapper["white_pawn"]
                break
            case TEAM.BLACK:
                this.sprite = spriteMapper["black_pawn"]
                break
            default:
                break;
        }
    }
}