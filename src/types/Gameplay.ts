import type { BoardApi, BoardConfig } from "vue3-chessboard";
import type { Move } from "./Move";
import { type MoveEvent } from "vue3-chessboard";
import { useFetchMovesData } from "@/fetch";
import { computed, ref, watchEffect } from "vue";
import { Turn } from "./Turn";
import { getRandomMove } from "@/utils/utils";

import type { Square } from "chess.js";
import { Tree } from "./Tree";
import type { UserFeedback } from "./UserFeedback";

export class GameplayApi {
  private turn = ref<Turn>(new Turn("white"));
  private tree: Tree = new Tree();
  private board: BoardApi | null = null;
  private orientation: BoardConfig["orientation"];
  private selectedMove: Move | null = null;
  private moveSequence = ref<string>("");
  private movesData = useFetchMovesData(this.moveSequence);
  private submitButtonDisabled = ref<boolean>(true);
  private userFeedback = ref<UserFeedback>({
    message: "Välj öppningsdrag",
    color: "primary",
    icon: "mdi-information",
    buttonText: "Välj drag",
  });

  submitButtonCallback = this.submitMove;

  constructor(orientation: BoardConfig["orientation"]) {
    this.orientation = orientation;
    watchEffect(() => {
      if (this.turn.value.color != this.orientation && this.movesData.value != undefined) {
        this.selectedMove = getRandomMove(this.movesData.value.moves, 2);
        this.board?.move(this.selectedMove.san);
        this.submitMove();
      }
    });
  }

  useGameplayData() {
    return { movesData: this.movesData, userFeedback: this.userFeedback, submitButtonStatus: this.submitButtonDisabled };
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
  }

  submitMove() {
    this.tree.addMove(this.selectedMove!);
    this.moveSequence.value = this.tree.getMoveSequence();
    this.turn.value.toggle();
    this.submitButtonDisabled.value = true;
    if (this.turn.value.color == this.orientation) this.determineState();
  }

  pieceMoved(move: MoveEvent) {
    this.selectedMove = this.movesData.value!.moves.filter((m) => m.san === move.san)[0] ?? null;
    if (this.selectedMove === null) {
      this.userFeedback.value = {
        message: "Draget finns ej i databasen! Välj ett annat drag",
        color: "error",
        icon: "mdi-alert",
        buttonText: "Välj drag",
      };
      this.submitButtonDisabled.value = true;
    } else {
      this.submitButtonDisabled.value = false;
    }
  }

  previewMove(move: Move) {
    this.board?.move(move.san);
    this.selectedMove = move;
    this.submitButtonDisabled.value = false;
  }

  private resetBoard() {
    this.board?.resetBoard();
    this.turn.value = new Turn("white");
    this.moveSequence.value = "";
    this.submitButtonCallback = this.submitMove;
    this.userFeedback.value = {
      message: "Välj öppningsdrag",
      color: "primary",
      icon: "mdi-information",
      buttonText: "Välj drag",
    };
    this.tree.resetMoveSequence();
    this.submitButtonDisabled.value = true;
  }

  private confirmVariationSaved() {
    this.userFeedback.value = {
      message: "Variant sparad",
      color: "info",
      icon: "mdi-check",
      buttonText: "OK",
    };
    this.submitButtonCallback = this.submitAndReset;
  }

  private submitAndReset() {
    this.tree.addMove(this.selectedMove!);
    this.resetBoard();
  }

  private determineState() {
    if (this.tree.hasMoves()) {
      this.userFeedback.value = {
        message: "Vilket drag spelar du nu?",
        color: "info",
        icon: "mdi-head-question",
        buttonText: "Välj drag",
      };
      this.submitButtonCallback = this.guessMove;
    } else {
      this.userFeedback.value = {
        message: "Välj motdrag",
        color: "primary",
        icon: "mdi-information",
        buttonText: "Välj drag",
      };
      this.submitButtonCallback = this.confirmVariationSaved;
    }
  }

  private guessMove() {
    console.log(this.selectedMove);
    if (this.tree.hasNextMove(this.selectedMove!)) {
      this.userFeedback.value = {
        message: "Rätt!",
        color: "success",
        icon: "mdi-star-face",
        buttonText: "Fortsätt",
      };
      this.submitButtonCallback = this.submitMove;
    } else {
      this.userFeedback.value = {
        message: "Fel! Rätt drag var...",
        color: "error",
        icon: "mdi-alert",
        buttonText: "Fortsätt",
      };
      this.submitButtonCallback = this.resetBoard;
    }
  }
}
