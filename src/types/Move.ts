export interface Move {
    uci: string
    san: string
    averateRating: number
    white: number
    draws: number
    black: number
    game: any //not used in application
}