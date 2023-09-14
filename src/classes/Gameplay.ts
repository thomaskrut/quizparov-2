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
  private movesToAdd: Move[] = []

  private selectedMove = ref<Move | null>(null);
  private movesData = ref<MovesData | null>(null)
  private submitButtonDisabled = ref<boolean>(true);
  private userFeedback = ref<UserFeedback>(new UserFeedback());

  submitButtonCallback = this.submitMove;

  constructor(orientation: BoardConfig["orientation"], language: string) {
    this.userFeedback.value.setLanguage(language);
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

  addAnotherMove() {
    this.userFeedback.value.setState(State.CounterMove);
    this.submitButtonCallback = this.saveVariation;
    this.undoLastMove()
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

    this.selectedMove.value = null;
    fetchMovesData(this.tree.getMoveSequence()).then((movesData) => {
      this.movesData.value = movesData;
      if (this.turn.color == this.orientation) {
        this.determineState();
      } else {
        this.makeComputerMove();
      }
    });

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

  private saveMovesAndReset() {
    this.tree.addMoves(this.movesToAdd);
    this.movesToAdd = [];
    this.resetBoard();
  }

  private saveVariation() {
    this.userFeedback.value.setState(State.LineSaved);
    this.movesToAdd.push(this.selectedMove.value!)
    this.submitButtonCallback = this.saveMovesAndReset
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
      this.tree.getCurrentNode().children.forEach((child, index) => {
        setTimeout(() => {
          this.drawMove(child.move!)
        }, index * 500)
      })
      this.userFeedback.value.setState(State.WrongMove, this.tree.getCurrentNode().children.map(c => c.move?.san).join(', '));

      this.submitButtonCallback = this.resetBoard;
    }
  }
}
