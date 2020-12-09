const TEAM = {
    WHITE: 'white',
    BLACK: 'black',
}

class Piece {
    constructor(x, y, team, board) {
        this.matrixPosition = createVector(x, y);
        this.pixelPosition = createVector(x*tileSize + tileSize/2, y*tileSize + tileSize/2);
        
        this.firstMovement = true;
        this.taken = false;
        this.team = team;
        this.movingThisPiece = false;
        this.canJump = false;
        this.sprite = spriteMapper["white_pawn"]; // default
        this.spriteSize = 0.85;
        this.board = board
    }

    isMatrixPositionAt(x, y) {
        return this.matrixPosition.x == x && this.matrixPosition.y == y
    }

    show() {
        if (!this.taken) {
            imageMode(CENTER)
            if (this.movingThisPiece) {
                image(this.sprite, mouseX, mouseY, tileSize, tileSize);
            } else {
                image(this.sprite, this.pixelPosition.x, this.pixelPosition.y, tileSize * this.spriteSize, tileSize * this.spriteSize);
            }
        }
    }

    move(x, y, board) {
        if (this.canMove(x, y, board) && !this.isMatrixPositionAt(x, y)) {
            if (board.isPieceAt(x, y)) {
                let piece = board.getPieceAt(x, y);
                if (this.isEnemy(piece)) {
                    piece.die();
                    deathSound.setVolume(0.4)
                    deathSound.play()
                } else {
                    return;
                }
            }
            this.matrixPosition = createVector(x, y);
            this.pixelPosition = createVector(x * tileSize + tileSize / 2, y *tileSize + tileSize / 2);
            this.firstMovement = false;
            moveSound.play();
            board.pass();
            
        }
    }

    die() {
        this.taken = true
        this.matrixPosition = createVector(-1, -1)
        this.pixelPosition = createVector(-100, -100)
    }

    isInsideMatrix(x, y) {
        return (x < 8 && x >= 0 && y < 8 && y >= 0)
    }

    canMove(x, y, board) {
        if (this.isInsideMatrix(x, y)) {
            if (!this.moveThroughPieces(x, y, board)) {
                if (board.isPieceAt(x, y) == this.isEnemy(board.getPieceAt(x, y))) {
                    return true;
                }
            }
        }
        return false
    }

    moveThroughPieces(x, y, board) {
        if (this.canJump) return false

        var stepDirectionX = x - this.matrixPosition.x;
        if (stepDirectionX > 0) {
          stepDirectionX = 1;
        } else if (stepDirectionX < 0) {
          stepDirectionX = -1;
        }
        var stepDirectionY = y - this.matrixPosition.y;
        if (stepDirectionY > 0) {
          stepDirectionY = 1;
        } else if (stepDirectionY < 0) {
          stepDirectionY = -1;
        }
        var tempPos = createVector(this.matrixPosition.x, this.matrixPosition.y);
        tempPos.x += stepDirectionX;
        tempPos.y += stepDirectionY;
        while (tempPos.x != x || tempPos.y != y) {
    
          if (board.getPieceAt(tempPos.x, tempPos.y) != board.nullPiece) {
            return true;
          }
          tempPos.x += stepDirectionX;
          tempPos.y += stepDirectionY;
        }
    
        return false;
    }

    straightMovement(x, y) {
        let directionX = Math.abs(x - this.matrixPosition.x)
        let directionY = Math.abs(y - this.matrixPosition.y)
        if ((directionY > directionX && directionX === 0) || (directionX > directionY && directionY === 0)) {
            return true;
        } else {
            return false;
        }
    }

    diagonalMovement(x, y) {
        let directionX = Math.abs(x - this.matrixPosition.x)
        let directionY = Math.abs(y - this.matrixPosition.y)
        if (directionX === directionY) {
            return true;
        } else {
            return false;
        }
    }

    isEnemy(piece) {
        if(piece.team != null){
            return piece.team != this.team;
        }
        return false;
    }

    generateMoves(board){
        let moves = [];
        let fakePiece = this.clone();
        this.matrixPosition = createVector(9, 9);
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                var x = i;
                var y = j;
                if(x!==fakePiece.matrixPosition.x || y!==fakePiece.matrixPosition.y) {
                    // TODO: verificar check do rei
                    if(fakePiece.canMove(x, y, board)){
                        moves.push(createVector(x, y));
                    }
                }
            }
        }
        this.matrixPosition = fakePiece.matrixPosition;
        return moves;
    }

    clone() {
        let clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
        clone.firstMovement = this.firstMovement;
        clone.matrixPosition = this.matrixPosition;
        clone.team = this.team;
        clone.canJump = this.canJump;
        return clone;
    }

}

class King extends Piece {
    constructor(x, y, team, board) {
        super(x, y, team, board);
        this.isInCheck = false;
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

    show() {
        if(this.isInCheck){
            fill("#ff0000")
            circle(this.pixelPosition.x, this.pixelPosition.y, tileSize*0.9);
            
        }
        super.show();
    }

    move(x, y, board) {
        if(this.canMove(x, y, board)){
            super.move(x, y, board);
        } else if (Math.abs(x - this.matrixPosition.x) === 2 && this.matrixPosition.y === y && !this.moveThroughPieces(x, y, board)){
            let rookPosition;
            let newRookPosition;
            switch(x){
                case 2:
                    rookPosition = createVector(0, y);
                    newRookPosition = createVector(3, y);
                    break;
                case 6:
                    rookPosition = createVector(7, y);
                    newRookPosition = createVector(5, y);
                    break;
            }
            let rook = board.getPieceAt(rookPosition.x, rookPosition.y);
            if(board.canDoCastling(this, rook)){
                rook.move(newRookPosition.x, newRookPosition.y, board);
                this.matrixPosition = createVector(x, y);
                this.pixelPosition = createVector(x * tileSize + tileSize / 2, y *tileSize + tileSize / 2);
                this.firstMovement = false;
                moveSound.play();
            }
        }
    }

    canMove(x, y, board) {
        if (Math.abs(x - this. matrixPosition.x) <= 1 && Math.abs(y - this. matrixPosition.y) <= 1) {
            let kingPosition = this.matrixPosition;
            let fakeKing = new King(x, y, this.team)
            this.matrixPosition = createVector(9, 9);

            let attackedPiece = board.getPieceAt(x, y);
            let attackedPiecePos = attackedPiece.matrixPosition;
            attackedPiece.matrixPosition = createVector(10, 10);

            if (!board.isInCheck(fakeKing)) {
                this.matrixPosition = kingPosition;
                return super.canMove(x, y, board);
            }

            this.matrixPosition = kingPosition;
            attackedPiece.matrixPosition = attackedPiecePos;
        }
        return false
    }

    generateMoves(board){
        let moves = [];
        let kingPosition = this.matrixPosition;
        let fakeKing = this.clone()
        this.matrixPosition = createVector(9, 9);
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                var x = kingPosition.x + i;
                var y = kingPosition.y + j;
                if(fakeKing.canMove(x, y, board) && !(board.isInCheck(new King(kingPosition.x, kingPosition.y, this.team))) && !(i==j && j==0)){
                    moves.push(createVector(x, y))

                }
            }
        }
        this.matrixPosition = kingPosition;
        return moves;

    }

}

class Queen extends Piece {
    constructor(x, y, team, board) {
        super(x, y, team, board);
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

    canMove(x, y, board) {
        if (this.straightMovement(x, y) || this.diagonalMovement(x, y)) {
            return super.canMove(x, y, board);
        } else {
            return false;
        }
    }



    showPath(can, x , y) {
        let tileSize = (screenSize ) / 8
        if(can){
            fill(255, 0, 0, 80);
        } else {
            fill(0, 255, 0, 80);
        }
        rect(x*tileSize, y*tileSize, tileSize, tileSize);
    }

}

class Rook extends Piece {
    constructor(x, y, team, board) {
        super(x, y, team, board);
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
    canMove(x, y, board) {
        if (this.straightMovement(x, y)) {
            return super.canMove(x, y, board);
        } else {
            return false;
        }
    }
}

class Bishop extends Piece {
    constructor(x, y, team, board) {
        super(x, y, team, board);
        switch(team) {
            case TEAM.WHITE:
                this.sprite = spriteMapper["white_bishop"];
                break;
            case TEAM.BLACK:
                this.sprite = spriteMapper["black_bishop"];
                break;
            default:
                break;
        }
    }

    canMove(x, y, board) {
        if (this.diagonalMovement(x, y)) {
            return super.canMove(x, y, board)
        } else {
            return false
        }
    }
}

class Knight extends Piece {
    constructor(x, y, team, board) {
        super(x, y, team, board);
        this.canJump = true;
        switch(team) {
            case TEAM.WHITE:
                this.sprite = spriteMapper["white_knight"];
                break;
            case TEAM.BLACK:
                this.sprite = spriteMapper["black_knight"];
                break;
            default:
                break;
        }
    }
    canMove(x, y, board) {
        if ((abs(x - this.matrixPosition.x) == 2 && abs(y - this.matrixPosition
            .y) == 1) || (abs(x - this.matrixPosition.x) == 1 && abs(y - this.matrixPosition
            .y) == 2)) {
          return super.canMove(x, y, board);
        }
        return false;
    }
}

class Pawn extends Piece {
    constructor(x, y, team, board) {
        super(x, y, team, board);
        
        this.enPassant = false;
        this.countMovements = 0;
        this.spriteSize = 0.70
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

    move(x, y, board) {
        if (this.canMove(x, y, board) && !this.isMatrixPositionAt(x, y)) {
            if (board.isPieceAt(x, y)) {
                let piece = board.getPieceAt(x, y);
                if (piece.team !== this.team) {
                    piece.die();
                    deathSound.setVolume(0.4)
                    deathSound.play()
                } else {
                    return;
                }
            }
            this.matrixPosition = createVector(x, y);
            this.pixelPosition = createVector(x * tileSize + tileSize / 2, y *tileSize + tileSize / 2);
            moveSound.play();
            board.pass();
            if (this.countMovements >= 6) {
                board.promotion(this, Queen);
            }
        }
    }
    
    canMove(x, y, board) {
        let pawnDirection;

        switch(this.team) {
            case TEAM.WHITE:
                pawnDirection = -1;
                break;
            case TEAM.BLACK:
                pawnDirection = 1;
                break;
            default:
                window.alert("Ocorreu um erro grave");
        }

        let attacking = board.isEnemyPieceAt(x, y, this);
        let enPassantAttacking = board.isEnemyPieceAt(x, y-pawnDirection, this);
        if (attacking) {
            if (this.diagonalMovement(x, y) && (y - this.matrixPosition.y) == pawnDirection) {
                this.countMovements += 1;
                return super.canMove(x, y, board);
            }
            return false;
        }

        if (enPassantAttacking) {
            let enPassantPiece = board.getPieceAt(x, y-pawnDirection)
            if (enPassantAttacking && enPassantPiece.enPassant) {
                enPassantPiece.die();
                deathSound.setVolume(0.4)
                deathSound.play()
                this.countMovements += 1;
                return super.canMove(x, y, board);
            }
        }

        if (x === this.matrixPosition.x) {
            if (y - this.matrixPosition.y == pawnDirection) {
                this.countMovements += 1;
                return super.canMove(x, y, board);
            }
            if (this.firstMovement && y - this.matrixPosition.y == pawnDirection*2) {
                this.enPassant = true;
                this.countMovements += 2;
                return super.canMove(x, y, board)
            }
        }
        return false;
    }

    clone() {
        let clone = super.clone();
        clone.enPassant = this.enPassant;
        clone.countMovements = this.countMovements;
        return clone;
    }
}