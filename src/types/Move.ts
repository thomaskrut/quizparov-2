export interface Move {
    uci: string
    san: string
    averateRating: number
    white: number
    draws: number
    black: number
    readonly game: any //lichess API data, not used in application
}