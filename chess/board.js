class Board {
    constructor() {
        this.whitePieces = [];
        this.blackPieces = [];
        this.setupPieces();
        this.turn = TEAM.WHITE;
        this.nullPiece = new Piece(null, null, null);
    }

    setupPieces() {
        this.blackPieces.push(new King(4, 0, TEAM.BLACK));
        this.blackPieces.push(new Queen(3, 0, TEAM.BLACK));
        this.blackPieces.push(new Rook(0, 0, TEAM.BLACK));
        this.blackPieces.push(new Rook(7, 0, TEAM.BLACK));
        this.blackPieces.push(new Knight(6, 0, TEAM.BLACK));
        this.blackPieces.push(new Knight(1, 0, TEAM.BLACK));
        this.blackPieces.push(new Bishop(2, 0, TEAM.BLACK));
        this.blackPieces.push(new Bishop(5, 0, TEAM.BLACK));
        for (var i = 0; i < 8; i++) {
            this.blackPieces.push(new Pawn(i, 1, TEAM.BLACK));
        }

        this.whitePieces.push(new King(4, 7, TEAM.WHITE));
        this.whitePieces.push(new Queen(3, 7, TEAM.WHITE));
        this.whitePieces.push(new Rook(0, 7, TEAM.WHITE));
        this.whitePieces.push(new Rook(7, 7, TEAM.WHITE));
        this.whitePieces.push(new Knight(6, 7, TEAM.WHITE));
        this.whitePieces.push(new Knight(1, 7, TEAM.WHITE));
        this.whitePieces.push(new Bishop(2, 7, TEAM.WHITE));
        this.whitePieces.push(new Bishop(5, 7, TEAM.WHITE));
        for (var i = 0; i < 8; i++) {
            this.whitePieces.push(new Pawn(i, 6, TEAM.WHITE));
        }
    }

    show() {
        this.whitePieces.map(piece => piece.show());
        this.blackPieces.map(piece => piece.show());
    }

    pass() {
        switch(this.turn) {
            case TEAM.WHITE:
                this.turn = TEAM.BLACK;
                this.blackPieces.map(piece => {
                    if (piece instanceof Pawn) {
                        piece.enPassant = false;
                    }
                });
                break;
            case TEAM.BLACK:
                this.turn = TEAM.WHITE;
                this.whitePieces.map(piece => {
                    if (piece instanceof Pawn) {
                        piece.enPassant = false;
                    }
                });
                break;
            default:
                this.turn = TEAM.WHITE;
                break;
        }
    }

    isPieceAt(x, y) {
        let pieceFound = false
        this.whitePieces.map(piece => {
            if(piece.matrixPosition.x === x && piece.matrixPosition.y === y){pieceFound = true}
        })
        this.blackPieces.map(piece => {
            if(piece.matrixPosition.x === x && piece.matrixPosition.y === y){pieceFound = true}
        })
        return pieceFound
    }

    isEnemyPieceAt(x, y, piece) {
        return this.getPieceAt(x, y).team !== piece.team && this.getPieceAt(x, y).team !== null
    }

    getPieceAt(x, y) {
        for (var i = 0; i < this.whitePieces.length; i++) {
            if (!this.whitePieces[i].taken && this.whitePieces[i].isMatrixPositionAt(x, y)) {
                return this.whitePieces[i];
            }
        }
        for (var i = 0; i < this.blackPieces.length; i++) {
            if (!this.blackPieces[i].taken && this.blackPieces[i].isMatrixPositionAt(x, y)) {
                return this.blackPieces[i];
            }
        }
        return this.nullPiece;
    }
}