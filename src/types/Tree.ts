import type { Move } from "./Move"
import type { MoveNode } from "./MoveNode"

export class Tree {

    root: MoveNode = { move: null, children: [] }
    moveSequence: Array<Move> = []

    addMove(move: Move) {
        const currentNode = this.getCurrentNode()
        if (currentNode.children.find(node => node.move?.san === move.san) === undefined) {
            currentNode.children.push({ move: move, children: [] })
        }
        this.moveSequence.push(move)
    }

    getCurrentNode(): MoveNode {
        let currentNode = this.root
        this.moveSequence.forEach(move => {
            if (currentNode.children.length > 0) {
                currentNode = currentNode.children.filter(node => node.move?.san === move.san)[0] as MoveNode ?? currentNode
            }
        })
        return currentNode
    }

    hasMoves(): boolean {
        return this.getCurrentNode().children.length > 0
    }

    hasNextMove(move: Move): boolean {
        return this.getCurrentNode().children.find(node => node.move?.san === move.san) !== undefined
    }

    resetMoveSequence() {
        this.moveSequence = []
    }

    getMoveSequence(): string {
        return this.moveSequence.map(move => move.uci).join(",");
    }


}