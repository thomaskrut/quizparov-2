import type { Move } from "@/types/Move"

export function getTotalNumberOfGames(move: Move) {
    return move.white + move.draws + move.black
}

export function getRandomMove(moves: Move[], number: number) {
    const randomNumber = Math.floor(Math.random() * number)
    return moves[randomNumber]
}

export function getPositionOfMove(moves: Move[], move: Move) {
    return moves.indexOf(move)
}

export function getPieceIcon(move: Move): string {
    switch (move.san[0]) {
        case "N":
            return "mdi-chess-knight"
        case "B":
            return "mdi-chess-bishop"
        case "R":
            return "mdi-chess-rook"
        case "Q":
            return "mdi-chess-queen"
        case "K":
            return "mdi-chess-king"
        default:
            return "mdi-chess-pawn"
    }
}

export function getEmptyMoveObject(): Move {
    return { san: '', uci: '', averateRating: 0, white: 0, draws: 0, black: 0, game: null };
}