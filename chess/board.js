class Board {
    constructor() {
        this.pieces = {
            [TEAM.WHITE]: [],
            [TEAM.BLACK]: [],
        };
        this.setupPieces();
        this.turn = TEAM.WHITE;
        this.nullPiece = new Piece(null, null, null);
    }

    setupPieces() {
        this.pieces[TEAM.BLACK].push(new King(4, 0, TEAM.BLACK));
        this.pieces[TEAM.BLACK].push(new Queen(3, 0, TEAM.BLACK));
        this.pieces[TEAM.BLACK].push(new Rook(0, 0, TEAM.BLACK));
        this.pieces[TEAM.BLACK].push(new Rook(7, 0, TEAM.BLACK));
        this.pieces[TEAM.BLACK].push(new Knight(6, 0, TEAM.BLACK));
        this.pieces[TEAM.BLACK].push(new Knight(1, 0, TEAM.BLACK));
        this.pieces[TEAM.BLACK].push(new Bishop(2, 0, TEAM.BLACK));
        this.pieces[TEAM.BLACK].push(new Bishop(5, 0, TEAM.BLACK));
        for (var i = 0; i < 8; i++) {
            this.pieces[TEAM.BLACK].push(new Pawn(i, 1, TEAM.BLACK));
        }

        this.pieces[TEAM.WHITE].push(new King(4, 7, TEAM.WHITE));
        this.pieces[TEAM.WHITE].push(new Queen(3, 7, TEAM.WHITE));
        this.pieces[TEAM.WHITE].push(new Rook(0, 7, TEAM.WHITE));
        this.pieces[TEAM.WHITE].push(new Rook(7, 7, TEAM.WHITE));
        this.pieces[TEAM.WHITE].push(new Knight(6, 7, TEAM.WHITE));
        this.pieces[TEAM.WHITE].push(new Knight(1, 7, TEAM.WHITE));
        this.pieces[TEAM.WHITE].push(new Bishop(2, 7, TEAM.WHITE));
        this.pieces[TEAM.WHITE].push(new Bishop(5, 7, TEAM.WHITE));
        for (var i = 0; i < 8; i++) {
            this.pieces[TEAM.WHITE].push(new Pawn(i, 6, TEAM.WHITE));
        }
    }

    show() {
        this.pieces[TEAM.WHITE].map(piece => piece.show());
        this.pieces[TEAM.BLACK].map(piece => piece.show());
    }

    pass() {
        this.turn = this.getEnemyTeam(this.turn);
        this.pieces[this.turn].forEach(piece => {
            if (piece instanceof Pawn) {
                piece.enPassant = false;
            }
        });
        this.isInCheck(this.pieces[TEAM.WHITE][0]);
        this.isInCheck(this.pieces[TEAM.BLACK][0]);
    }

    getEnemyTeam(team) {
        switch(team) {
            case TEAM.WHITE:
                return TEAM.BLACK;

            case TEAM.BLACK:
                return TEAM.WHITE;

        }
    }

    isInCheck(king) {
        let result = false
        this.pieces[this.getEnemyTeam(king.team)].forEach((piece) => {
            if (piece.canMove(king.matrixPosition.x, king.matrixPosition.y, board)) {
                result = true;
                checkSound.play();
                return;
            }
        })
        king.isInCheck = result;
        return result;
    }

    isPieceAt(x, y) {
        let pieceFound = false
        this.pieces[TEAM.WHITE].map(piece => {
            if(piece.matrixPosition.x === x && piece.matrixPosition.y === y){pieceFound = true}
        })
        this.pieces[TEAM.BLACK].map(piece => {
            if(piece.matrixPosition.x === x && piece.matrixPosition.y === y){pieceFound = true}
        })
        return pieceFound
    }

    isEnemyPieceAt(x, y, piece) {
        return this.getPieceAt(x, y).team !== piece.team && this.getPieceAt(x, y).team !== null
    }

    getPieceAt(x, y) {
        for (var i = 0; i < this.pieces[TEAM.WHITE].length; i++) {
            if (!this.pieces[TEAM.WHITE][i].taken && this.pieces[TEAM.WHITE][i].isMatrixPositionAt(x, y)) {
                return this.pieces[TEAM.WHITE][i];
            }
        }
        for (var i = 0; i < this.pieces[TEAM.BLACK].length; i++) {
            if (!this.pieces[TEAM.BLACK][i].taken && this.pieces[TEAM.BLACK][i].isMatrixPositionAt(x, y)) {
                return this.pieces[TEAM.BLACK][i];
            }
        }
        return this.nullPiece;
    }

    promotion(pawn, clazz) {
        if (pawn instanceof Pawn) {
            this.pieces[pawn.team].push(new clazz(pawn.matrixPosition.x, pawn.matrixPosition.y, pawn.team));
            pawn.die()   
        }
    }
}