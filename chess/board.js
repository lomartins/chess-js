class Board {
    constructor() {
        this.whitePieces = []
        this.blackPieces = []
        this.setupPieces()
    }

    setupPieces() {
        this.whitePieces.push(new King(0, 0, TEAM.BLACK))
    }

    show() {
        this.whitePieces.map(piece => piece.show())
        this.blackPieces.map(piece => piece.show())
    }

    pieceAt(x, y) {
        let pieceFound = false
        this.whitePieces.map(piece => {
            if(piece.matrixPosition.x === x && piece.matrixPosition.y === y){pieceFound = true}
        })
        this.blackPieces.map(piece => {
            if(piece.matrixPosition.x === x && piece.matrixPosition.y === y){pieceFound = true}
        })
        return pieceFound
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
        return null;
    }
}