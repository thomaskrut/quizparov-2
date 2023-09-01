<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import { TheChessboard, type MoveEvent } from 'vue3-chessboard'
import type { Square } from 'chess.js'
import 'vue3-chessboard/style.css'

import type { BoardApi, BoardConfig } from 'vue3-chessboard'
import type { Move } from './types/Move'
import { Turn } from './types/Turn'
import { getTotalNumberOfGames, getRandomMove } from './utils/utils'

import { useFetchMovesData } from './useFetchMovesData'
import { Tree } from './types/Tree'

const orientation = ref<BoardConfig['orientation']>('white')
const turn = ref<Turn>(new Turn(orientation.value))
const moveSequence = ref<string>('')
const movesData = useFetchMovesData(moveSequence)
const selectedMove = ref<Move | null>(null)
const movesToConsider = 2
const message = ref<string>('Välj öppningsdrag')

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
  if (movesData.value != null) selectedMove.value = movesData.value.moves.filter(m => m.san === move.san)[0]
  console.log('Piece moved', move)
  console.log(selectedMove.value)
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
  message.value = 'Välj öppningsdrag'
  tree.resetPosition()
}

function submitMove() {

  tree.goto(selectedMove.value)

  if (!playersTurn.value) {
    // Set state to either select new move or guess move
  }

  moveSequence.value = tree.moveSequence ?? ''
  turn.value.toggle()
  console.log(tree)
}

const playersTurn = computed(() => {
  return turn.value.color == orientation.value
})

watchEffect(() => {
  console.log('Turn changed', turn.value.color)
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
  {{ message }}
  <TheChessboard :board-config="boardConfig" @board-created="(api) => (boardAPI = api)"
    @move="(move) => pieceMoved(move)" />

  <div v-if="movesData/* && turn.color == orientation*/">
    <v-btn v-for="move in movesData.moves" :key="move.san" @click="previewMove(move)" @mouseover="drawArrow(move)"
      @mouseout="removeArrows()">{{ move.san }} {{ getTotalNumberOfGames(move) }}
    </v-btn>
    <v-btn @click="submitButtonCallback">Välj drag</v-btn>
    <v-btn @click="undoMove">Ångra drag</v-btn>
  </div>
</template>

<style scoped></style>
