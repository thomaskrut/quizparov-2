import { ref } from "vue"
import type { Move } from "../types/Move"
import type { MoveNode } from "../types/MoveNode"

export class Tree {

    root: MoveNode = { move: null, children: [] }
    moveSequence = ref<Move[]>([])

    addMove(move: Move) {
        const currentNode = this.getCurrentNode()
        if (currentNode.children.find(node => node.move?.san === move.san) === undefined) {
            currentNode.children.push({ move: move, children: [] })
        }
        this.moveSequence.value.push(move)
    }

    addMoves(moves: Move[]) {
        const currentNode = this.getCurrentNode()
        moves.forEach(move => {
            currentNode.children.push({move: move, children: []})
        })
    }

    getCurrentNode(): MoveNode {
        let currentNode = this.root
        this.moveSequence.value.forEach(move => {
            if (currentNode.children.length > 0) {
                currentNode = currentNode.children.find(node => node.move?.san === move.san) ?? currentNode
            }
        })
        return currentNode
    }

    getCurrentDepth(): number {
        return this.moveSequence.value.length
    }

    hasMoves(): boolean {
        return this.getCurrentNode().children.length > 0
    }

    hasNextMove(move: Move): boolean {
        return this.getCurrentNode().children.find(node => node.move?.san === move.san) !== undefined
    }

    resetMoveSequence() {
        this.moveSequence.value = []
    }

    getMoveSequence(): string {
        return this.moveSequence.value.map(move => move.uci).join(",");
    }

    isEmpty(): boolean {
        return this.root.children.length === 0
    }


}