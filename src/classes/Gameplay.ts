import type { BoardApi, BoardConfig } from "vue3-chessboard";
import type { Move } from "../types/Move";
import { type MoveEvent } from "vue3-chessboard";
import { fetchMovesData } from "../fetch";
import { ref } from "vue";
import { Turn } from "./Turn"
import { getRandomMove } from "../utils/utils";
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

  private selectedMove = ref<Move | null>(null);
  private movesData = ref<MovesData | null>(null)
  private submitButtonDisabled = ref<boolean>(true);
  private userFeedback = ref<UserFeedback>(new UserFeedback('sv'));

  submitButtonCallback = this.submitMove;

  constructor(orientation: BoardConfig["orientation"], language: string) {
    this.userFeedback.value.language = language
    this.orientation = orientation;
    this.playNextTurn();
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
    this.tree.addMove(this.selectedMove.value!);
    this.turn.toggle();
    this.submitButtonDisabled.value = true;
    this.playNextTurn();
  }

  pieceMoved(move: MoveEvent) {
    this.selectedMove.value = this.movesData.value!.moves.filter((m) => m.san === move.san)[0] ?? null;
    if (this.selectedMove.value === null) {
      if (this.userFeedback.value.state == State.GuessMove) {
        this.selectedMove.value = this.getEmptyMoveObject();
        this.submitButtonDisabled.value = false;
      } else {
        this.userFeedback.value.setState(State.MoveNotInDb);
        this.submitButtonDisabled.value = true;
      }
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

  getEmptyMoveObject(): Move {
    return { san: '', uci: '', averateRating: 0, white: 0, draws: 0, black: 0, game: null };
  }

  private playNextTurn() {
    setTimeout(() => {
      this.selectedMove.value = null;
      fetchMovesData(this.tree.getMoveSequence()).then((movesData) => {
        this.movesData.value = movesData;
        if (this.turn.color == this.orientation) {
          this.determineState();
        } else {
          this.makeComputerMove();
        }
      });
    }, 500);
  }

  private makeComputerMove() {
    this.selectedMove.value = getRandomMove(this.movesData.value!.moves, 2);
    this.board!.move(this.selectedMove.value.san);
    this.submitMove();
  }

  private resetBoard() {
    this.board?.resetBoard();
    this.turn = new Turn("white");
    this.submitButtonCallback = this.submitMove;
    this.tree.resetMoveSequence();
    this.submitButtonDisabled.value = true;
    this.playNextTurn();
  }

  private saveVariation() {
    this.userFeedback.value.setState(State.LineSaved);
    this.tree.addMove(this.selectedMove.value!);
    this.submitButtonCallback = this.resetBoard;
  }

  private determineState() {
    if (this.tree.getCurrentNode() == this.tree.root && this.orientation == "white") {
      this.userFeedback.value.setState(State.OpeningMove);
    } else if (this.tree.hasMoves()) {
      this.userFeedback.value.setState(State.GuessMove);
      this.submitButtonCallback = this.guessMove;
    } else {
      this.userFeedback.value.setState(State.CounterMove);
      this.submitButtonCallback = this.saveVariation;
    }
  }

  private guessMove() {
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
