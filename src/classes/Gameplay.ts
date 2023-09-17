import type { BoardApi, BoardConfig } from "vue3-chessboard";
import type { Move } from "../types/Move";
import { type MoveEvent } from "vue3-chessboard";
import { fetchMovesData } from "../fetch";
import { ref } from "vue";
import { Turn } from "./Turn"
import { getRandomMove, getEmptyMoveObject } from "../utils/utils";
import { State } from "../types/State";

import type { Square } from "chess.js";
import { Tree } from "./Tree";
import { UserFeedback } from "./UserFeedback";
import type { MovesData } from "../types/MovesData";

export class GameplayApi {

  private turn = new Turn("white");
  private tree: Tree = new Tree();
  private board: BoardApi | null = null;
  private orientation: BoardConfig["orientation"];
  
  private interval: number = 0
  private treeDepth: number = 0
  private movesToConsider: number = 0

  private movesToAdd = ref<Move[]>([]);
  private selectedMove = ref<Move | null>(null);
  private movesData = ref<MovesData | null>(null)
  private submitButtonDisabled = ref<boolean>(true);
  private userFeedback = ref<UserFeedback>(new UserFeedback());

  submitButtonCallback = this.submitMove;

  constructor(language: string) {
    this.userFeedback.value.setLanguage(language);
  }

  start(orientation: BoardConfig["orientation"], depth: number, movesToConsider: number) {
    this.tree = new Tree();
    this.resetBoard();
    this.orientation = orientation;
    this.treeDepth = depth;
    this.movesToConsider = movesToConsider;
    this.playNextTurn();
  }

  useGameplayData() {
    return { movesData: this.movesData, userFeedback: this.userFeedback, submitButtonStatus: this.submitButtonDisabled, selectedMove: this.selectedMove, currentLine: this.tree.moveSequence, movesToAdd: this.movesToAdd };
  }

  setBoard(board: BoardApi) {
    this.board = board;
  }

  drawMove(move: Move) {
    const from = move.uci.slice(0, 2) as Square;
    const to = move.uci.slice(2, 4) as Square;
    this.board?.drawMove(from, to, "green");
  }

  hideMoves() {
    this.board?.hideMoves();
  }

  undoLastMove() {
    this.board?.undoLastMove();
    this.submitButtonDisabled.value = true;
    this.selectedMove.value = null;
    if (this.userFeedback.value.state == State.MoveNotInDb) this.userFeedback.value.setState(this.userFeedback.value.previousState);
  }

  addAnotherMove() {
    this.userFeedback.value.setState(State.CounterMove);
    this.submitButtonCallback = this.addMove;
    this.undoLastMove()
  }

  removeMove(move: Move) {
    this.movesToAdd.value.indexOf(move) > -1 && this.movesToAdd.value.splice(this.movesToAdd.value.indexOf(move), 1);
    if (this.movesToAdd.value.length == 0) this.submitButtonDisabled.value = true;
  }

  submitMove() {
    this.tree.addMove(this.selectedMove.value!);
    this.movesToAdd.value = [];
    this.turn.toggle();
    this.submitButtonDisabled.value = true;
    this.playNextTurn();
  }

  pieceMoved(move: MoveEvent) {
    this.selectedMove.value = this.movesData.value!.moves.filter((m) => m.san === move.san)[0] ?? null;
    if (this.selectedMove.value === null) {
      if (this.userFeedback.value.state == State.GuessMove) {
        this.selectedMove.value = getEmptyMoveObject();
        this.submitButtonDisabled.value = false;
      } else {
        this.userFeedback.value.setState(State.MoveNotInDb);
        this.submitButtonDisabled.value = true;
      }
    } else {
      this.submitButtonDisabled.value = this.movesToAdd.value.includes(this.selectedMove.value)
    }
  }

  previewMove(move: Move) {
    this.board?.move(move.san);
    this.selectedMove.value = move;
    this.submitButtonDisabled.value = this.movesToAdd.value.includes(this.selectedMove.value)
    this.hideMoves();
  }

  private playNextTurn() {

    this.selectedMove.value = null;
    fetchMovesData(this.tree.getMoveSequence()).then((movesData) => {
      this.movesData.value = movesData;
      if (this.turn.color == this.orientation) {
        this.determineState();
      } else {
        if (this.tree.getCurrentDepth() < this.treeDepth) {
        this.makeComputerMove();
        } else {
          this.userFeedback.value.setState(State.MaxDepthReached);
          this.submitButtonDisabled.value = false;
          this.submitButtonCallback = this.resetBoard;
        }
      }
    });

  }

  private makeComputerMove() {
    this.selectedMove.value = getRandomMove(this.movesData.value!.moves, this.movesToConsider);
    this.board!.move(this.selectedMove.value.san);
    this.submitMove();
  }

  private resetBoard() {
    clearInterval(this.interval)
    this.movesToAdd.value = [];
    this.board?.resetBoard();
    this.turn = new Turn("white");
    this.submitButtonCallback = this.submitMove;
    this.tree.resetMoveSequence();
    this.submitButtonDisabled.value = true;
    this.playNextTurn();
  }

  private saveMovesAndReset() {
    this.tree.addMoves(this.movesToAdd.value);
    this.resetBoard();
  }

  private addMove() {
    this.userFeedback.value.setState(State.MoveAdded);
    this.movesToAdd.value.push(this.selectedMove.value!)
    this.submitButtonCallback = this.saveMovesAndReset;
  }

  private determineState() {
    if (this.tree.getCurrentNode() == this.tree.root && this.orientation == "white") {
      this.userFeedback.value.setState(State.OpeningMove);
    } else if (this.tree.hasMoves()) {
      this.userFeedback.value.setState(State.GuessMove);
      this.submitButtonCallback = this.guessMove;
    } else {
      this.userFeedback.value.setState(State.CounterMove);
      this.submitButtonCallback = this.addMove;
    }
  }

  private guessMove() {
    this.movesToAdd.value.push(...this.tree.getCurrentNode().children.map(node => node.move!))
    if (this.tree.hasNextMove(this.selectedMove.value!)) {
      this.userFeedback.value.setState(State.CorrectMove);
      this.submitButtonCallback = this.submitMove;
    } else {
      const drawFunc = () => {
        this.tree.getCurrentNode().children.forEach((child, index) => {
          setTimeout(() => {
            this.drawMove(child.move!)
          }, index * 500)
        })
      }
      drawFunc()
      this.interval = setInterval(drawFunc, this.tree.getCurrentNode().children.length * 500)
      
      this.userFeedback.value.setState(State.WrongMove, this.tree.getCurrentNode().children.map(c => c.move?.san).join(', eller '));
      
      this.submitButtonCallback = this.resetBoard;
    }
  }
}
