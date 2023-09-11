import type { BoardConfig } from 'vue3-chessboard'

export class Turn {
    color: BoardConfig['orientation']
    
    constructor(color: BoardConfig['orientation']) {
        this.color = color
    }

    toggle() {
        this.color = this.color === 'white' ? 'black' : 'white'
    }   
}
