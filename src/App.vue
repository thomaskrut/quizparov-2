<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import { TheChessboard, type MoveEvent } from 'vue3-chessboard'
import type { Square } from 'chess.js'
import 'vue3-chessboard/style.css'

import type { BoardApi, BoardConfig } from 'vue3-chessboard'
import type { Move } from './types/Move'
import { Turn } from './types/Turn'
import type { UserFeedback } from './types/UserFeedback'
import { getTotalNumberOfGames, getRandomMove } from './utils/utils'

import { useFetchMovesData } from './useFetchMovesData'
import { Tree } from './types/Tree'

const orientation = ref<BoardConfig['orientation']>('white')
const turn = ref<Turn>(new Turn(orientation.value))
const moveSequence = ref<string>('')
const movesData = useFetchMovesData(moveSequence)
const selectedMove = ref<Move | null>(null)
const movesToConsider = 2
const userFeedback = ref<UserFeedback>({ message: 'Välj öppningsdrag', color: 'primary', icon: "mdi-information", buttonText: "Välj drag"})

const tree: Tree = new Tree()

let boardAPI: BoardApi;

let submitButtonCallback = submitMove

const boardConfig: BoardConfig = {
  coordinates: true,
  orientation: orientation.value,
  animation: {
    enabled: true,
    duration: 500,
  },
  draggable: {
    enabled: false
  },
}

function pieceMoved(move: MoveEvent) {
  selectedMove.value = movesData.value!.moves.filter(m => m.san === move.san)[0]
}

function drawArrow(move: Move) {
  const from = move.uci.slice(0, 2) as Square
  const to = move.uci.slice(2, 4) as Square
  boardAPI.drawMove(from, to, 'green')
}

function removeArrows() {
  boardAPI.hideMoves()
}

function previewMove(move: Move) {
  boardAPI.move(move.san)
  selectedMove.value = move
}

function resetBoard() {
  boardAPI.resetBoard()
  moveSequence.value = ''
  submitButtonCallback = submitMove
  userFeedback.value = { message: 'Välj öppningsdrag', color: 'primary', icon: "mdi-information", buttonText: "Välj drag"}
  tree.resetMoveSequence()
}

function submitMove() {
  tree.addMove(selectedMove.value!)
  moveSequence.value = tree.getMoveSequence()
  turn.value.toggle()
  if (playersTurn.value) determineState()
  console.log(tree)
}

function submitAndReset() {
  tree.addMove(selectedMove.value!)
  resetBoard()
}

function confirmVariationSaved() {
  userFeedback.value = { message: 'Variant sparad', color: 'info', icon: "mdi-check", buttonText: "OK"}
  submitButtonCallback = submitAndReset
}

function guessMove() {
  if (tree.hasNextMove(selectedMove.value!)) {
    userFeedback.value = { message: 'Rätt!', color: 'success', icon: 'mdi-star-face', buttonText: "Fortsätt"}
    submitButtonCallback = submitMove
  } else {
    userFeedback.value = { message: 'Fel! Rätt drag var...', color: 'error', icon: 'mdi-alert', buttonText: "Fortsätt"}
    submitButtonCallback = resetBoard
  }
}

function determineState() {
  if (tree.hasMoves()) {
    userFeedback.value = { message: 'Vilket drag spelar du nu?', color: 'info', icon: 'mdi-head-question', buttonText: "Välj drag"}
    submitButtonCallback = guessMove
  } else {
    userFeedback.value = { message: 'Välj motdrag', color: 'primary', icon: "mdi-information", buttonText: "Välj drag"}
    submitButtonCallback = confirmVariationSaved
  }
}

const playersTurn = computed(() => {
  return turn.value.color == orientation.value
})

watchEffect(() => {
  if (!playersTurn.value && movesData.value != undefined) {
    selectedMove.value = getRandomMove(movesData.value.moves, movesToConsider)
    boardAPI.move(selectedMove.value.san)
    submitMove()
  }
})

const undoMove = () => {
  boardAPI.undoLastMove()
}

</script>

<template>
  {{ userFeedback }}
  <TheChessboard :board-config="boardConfig" @board-created="(api) => (boardAPI = api)"
    @move="(move) => pieceMoved(move)" />

  <div v-if="movesData/* && turn.color == orientation*/">
    <v-btn v-for="move in movesData.moves" :key="move.san" @click="previewMove(move)" @mouseover="drawArrow(move)"
      @mouseout="removeArrows()">{{ move.san }} {{ getTotalNumberOfGames(move) }}
    </v-btn>
    <v-btn @click="submitButtonCallback">{{ userFeedback.buttonText }}</v-btn>
    <v-btn @click="undoMove">Ångra drag</v-btn>
  </div>
</template>

<style scoped></style>
