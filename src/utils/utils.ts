import type { Move } from "../types/Move"

export function getTotalNumberOfGames(move: Move) {
    return move.white + move.draws + move.black
}