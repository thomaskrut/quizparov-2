import type { BoardApi, BoardConfig } from "vue3-chessboard";
import type { Move } from "./Move";
import { type MoveEvent } from "vue3-chessboard";
import { useFetchMovesData } from "@/fetch";
import { ref, watchEffect } from "vue";
import { Turn } from "./Turn";
import { getRandomMove } from "@/utils/utils";
import { State } from "./State";

import type { Square } from "chess.js";
import { Tree } from "./Tree";
import { UserFeedback } from "./UserFeedback";

export class GameplayApi {
  private turn = ref<Turn>(new Turn("white"));
  private tree: Tree = new Tree();
  private board: BoardApi | null = null;
  private orientation: BoardConfig["orientation"];
  private selectedMove = ref<Move | null>(null);
  private moveSequence = ref<string>("");
  private movesData = useFetchMovesData(this.moveSequence);
  private submitButtonDisabled = ref<boolean>(true);
  private userFeedback = ref<UserFeedback>(new UserFeedback());

  submitButtonCallback = this.submitMove;

  constructor(orientation: BoardConfig["orientation"]) {
    this.orientation = orientation;
    watchEffect(() => {
      if (this.turn.value.color != this.orientation && this.movesData.value != undefined && this.board != null) {
        this.selectedMove.value = getRandomMove(this.movesData.value.moves, 2);
        this.board.move(this.selectedMove.value.san);
        this.submitMove();
        this.selectedMove.value = null;
      }
    });
  }

  useGameplayData() {
    return { movesData: this.movesData, userFeedback: this.userFeedback, submitButtonStatus: this.submitButtonDisabled, selectedMove: this.selectedMove };
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
    this.userFeedback.value.setState(this.userFeedback.value.previousState);
  }

  submitMove() {
    this.tree.addMove(this.selectedMove.value!);
    this.moveSequence.value = this.tree.getMoveSequence();
    this.turn.value.toggle();
    this.submitButtonDisabled.value = true;
    if (this.turn.value.color == this.orientation) this.determineState();
  }

  pieceMoved(move: MoveEvent) {
    this.selectedMove.value = this.movesData.value!.moves.filter((m) => m.san === move.san)[0] ?? null;
    if (this.selectedMove === null) {
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
  }

  private confirmVariationSaved() {
    this.userFeedback.value.setState(State.LineSaved);
    this.submitButtonCallback = this.submitAndReset;
  }

  private submitAndReset() {
    this.tree.addMove(this.selectedMove.value!);
    this.resetBoard();
  }

  private determineState() {
    if (this.tree.hasMoves()) {
      this.userFeedback.value.setState(State.GuessMove);
      this.submitButtonCallback = this.guessMove;
    } else {
      this.userFeedback.value.setState(State.CounterMove);
      this.submitButtonCallback = this.confirmVariationSaved;
    }
  }

  private guessMove() {
    console.log(this.selectedMove);
    if (this.tree.hasNextMove(this.selectedMove.value!)) {
      this.userFeedback.value.setState(State.CorrectMove);
      this.submitButtonCallback = this.submitMove;
    } else {
      this.userFeedback.value.setState(State.WrongMove);
      this.submitButtonCallback = this.resetBoard;
    }
  }
}
