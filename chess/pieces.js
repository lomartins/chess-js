const TEAM = {
    WHITE: 'white',
    BLACK: 'black',
}

class Piece {
    constructor(x, y, team) {
        this.matrixPosition = createVector(x, y)
        this.pixelPosition = createVector(x*tileSize + tileSize/2, y*tileSize + tileSize/2)

        this.taken = false
        this.team = team
        this.movingThisPiece = false
        this.moved = false
        this.canJump = false
        this.sprite = spriteMapper["white_pawn"] // default
        this.spriteSize = 0.85
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
            this.moved = true;
        }
    }

    die() {
        this.taken = true
        this.matrixPosition = createVector(-1, -1)
        this.pixelPosition = createVector(-100, -100)
    }

    canMove(x, y, board) {
        if ((x < 8 && x >= 0 && y < 8 && y >= 0) && (this.directionMovement(x, y) || this.canJump)) {
            if (!this.moveThroughPieces(x, y, board)) {
                return true
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

    directionMovement(x, y) {
        if (this.diagonalMovement(x, y) || this.straightMovement(x, y)) {
            return true
        }
        return false
    }

    isEnemy(piece) {
        return piece.team !== this.team;
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

    canMove(x, y, board) {
        if (Math.abs(x - this. matrixPosition.x) <= 1 && Math.abs(y - this. matrixPosition.y) <= 1) {
            return super.canMove(x, y, board)
        }
        return false
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

    canMove(x, y, board) {
        if (this.straightMovement(x, y) || this.diagonalMovement(x, y)) {
            return super.canMove(x, y, board);
        } else {
            return false;
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
    canMove(x, y, board) {
        if (this.straightMovement(x, y)) {
            return super.canMove(x, y, board);
        } else {
            return false;
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

    canMove(x, y, board) {
        if (this.diagonalMovement(x, y)) {
            return super.canMove(x, y, board)
        } else {
            return false
        }
    }
}

class Knight extends Piece {
    constructor(x, y, team) {
        super(x, y, team);
        this.canJump = true
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
    constructor(x, y, team) {
        super(x, y, team);
        this.firstMovement = true;
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
            this.moved = true;
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
                this.firstMovement = false;
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
                this.firstMovement = false;
                this.enPassant = true;
                this.countMovements += 2;
                return super.canMove(x, y, board)
            }
        }
        return false;
    }
}