import type { Move } from "./Move"
import type { MoveNode } from "./MoveNode"

export class Tree {

    root: MoveNode | null = null
    position: MoveNode | null = null
    moveSequence: string = ''

    goto(move: Move | null) {

        if (move === null) return
        let newMoveNode = this.position?.children.find((child) => child.move?.san === move.san) ?? null
        if (newMoveNode === null) {
            newMoveNode = { move: move, children: [] }
            this.position?.children.push(newMoveNode)
        }
        this.position = newMoveNode
        this.moveSequence == '' ? this.moveSequence = move.uci : this.moveSequence += "," + move.uci

    }

    resetPosition() {
        this.position = this.root
        this.moveSequence = ''
    }

    isNewVariation() {
        return this.position?.children.length === 0
    }

}