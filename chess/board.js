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
}