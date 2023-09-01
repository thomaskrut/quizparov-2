import type { Move } from "./Move";

export interface MoveNode {
    move: Move | null,
    children: Array<MoveNode>
}