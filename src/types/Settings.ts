import { type BoardConfig } from 'vue3-chessboard'
import { ref } from 'vue'

export interface Settings {
    orientation: BoardConfig['orientation']
    movesToConsider: number
    treeDepth: number
}