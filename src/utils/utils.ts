import type { MovesData } from "@/types/MovesData"
import type { Move } from "@/types/Move"

export function getTotalNumberOfGames(move: Move) {
    return move.white + move.draws + move.black
}

export function getRandomMove(moves: Move[], number: number) {
    const randomNumber = Math.floor(Math.random() * number)
    return moves[randomNumber]
}