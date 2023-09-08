import type { BoardApi, BoardConfig } from "vue3-chessboard";
import type { Move } from "./Move";
import { type MoveEvent } from "vue3-chessboard";
import { fetchMovesData } from "@/fetch";
import { ref } from "vue";
import { Turn } from "./Turn";
import { getRandomMove } from "@/utils/utils";
import { State } from "./State";

import type { Square } from "chess.js";
import { Tree } from "./Tree";
import { UserFeedback } from "./UserFeedback";
import type { MovesData } from "./MovesData";

export class GameplayApi {
  private turn = ref<Turn>(new Turn("white"));
  private tree: Tree = new Tree();
  private board: BoardApi | null = null;
  private orientation: BoardConfig["orientation"];
  private selectedMove = ref<Move | null>(null);
  private moveSequence = ref<string>("");
  private movesData = ref<MovesData | null>(null)
  private submitButtonDisabled = ref<boolean>(true);
  private userFeedback = ref<UserFeedback>(new UserFeedback());

  submitButtonCallback = this.submitMove;

  constructor(orientation: BoardConfig["orientation"]) {
    this.orientation = orientation;
    fetchMovesData(this.moveSequence.value).then((movesData) => {
      this.movesData.value = movesData;
    });
  }

  useGameplayData() {
    return { movesData: this.movesData, userFeedback: this.userFeedback, submitButtonStatus: this.submitButtonDisabled, selectedMove: this.selectedMove, currentLine: this.tree.moveSequence };
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

  submitMove() {
    this.movesData.value = null;
    this.tree.addMove(this.selectedMove.value!);
    this.moveSequence.value = this.tree.getMoveSequence();
    this.turn.value.toggle();
    this.submitButtonDisabled.value = true;
    fetchMovesData(this.moveSequence.value).then((movesData) => {
      this.movesData.value = movesData;
      
    if (this.turn.value.color == this.orientation) {
      this.determineState();
     } else {
      this.selectedMove.value = getRandomMove(this.movesData.value!.moves, 2);
      this.board!.move(this.selectedMove.value.san);
      this.submitMove();
      this.selectedMove.value = null;
    }
    });
    
  }

  pieceMoved(move: MoveEvent) {
    this.selectedMove.value = this.movesData.value!.moves.filter((m) => m.san === move.san)[0] ?? null;
    if (this.selectedMove.value === null) {
      this.userFeedback.value.setState(State.MoveNotInDb);
      this.submitButtonDisabled.value = true;
    } else {
      this.submitButtonDisabled.value = false;
    }
  }

  previewMove(move: Move) {
    this.board?.move(move.san);
    this.selectedMove.value = move;
    this.submitButtonDisabled.value = false;
    this.hideMoves();
  }

  private resetBoard() {
    this.selectedMove.value = null;
    this.board?.resetBoard();
    this.turn.value = new Turn("white");
    this.moveSequence.value = "";
    this.submitButtonCallback = this.submitMove;
    this.userFeedback.value.setState(State.OpeningMove);
    this.tree.resetMoveSequence();
    this.submitButtonDisabled.value = true;
    fetchMovesData(this.moveSequence.value).then((movesData) => {
      this.movesData.value = movesData;
    });
  }

  private saveVariation() {
    this.userFeedback.value.setState(State.LineSaved);
    this.tree.addMove(this.selectedMove.value!);
    this.submitButtonCallback = this.resetBoard;
  }

  private determineState() {
    if (this.tree.hasMoves()) {
      this.userFeedback.value.setState(State.GuessMove);
      this.submitButtonCallback = this.guessMove;
    } else {
      this.userFeedback.value.setState(State.CounterMove);
      this.submitButtonCallback = this.saveVariation;
    }
  }

  private guessMove() {
    console.log(this.selectedMove);
    if (this.tree.hasNextMove(this.selectedMove.value!)) {
      this.userFeedback.value.setState(State.CorrectMove);
      this.submitButtonCallback = this.submitMove;
    } else {
      const correctMove = this.tree.getCurrentNode().children[0].move!;
      this.userFeedback.value.setState(State.WrongMove, correctMove.san);
      this.drawMove(correctMove)
      this.submitButtonCallback = this.resetBoard;
    }
  }
}
