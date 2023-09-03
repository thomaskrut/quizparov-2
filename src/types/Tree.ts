import type { Move } from "./Move"
import type { MoveNode } from "./MoveNode"

export class Tree {

    root: MoveNode = {move: null, children: []}
    moveSequence: Array<Move> = []

    addMove(move: Move) {
        this.moveSequence.push(move)
        this.getCurrentNode().children.push({move: move, children: []})
    }

    getCurrentNode(): MoveNode {
        let currentNode = this.root
        this.moveSequence.forEach(move => {
           if (currentNode.children.length > 0) {
               currentNode = currentNode.children.find(node => node.move?.uci === move.uci) as MoveNode ?? currentNode
           }
        })
        return currentNode
    }

    hasMoves(): boolean {
        return this.getCurrentNode().children.length > 0
    }

    resetMoveSequence() {
        this.moveSequence = []
    }

    getMoveSequence(): string {
        let result: string = ""
        this.moveSequence.forEach(move => {
            result += move.uci + ","
        })
        return result.substring(0, result.length - 1)
    }

}