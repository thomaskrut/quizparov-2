<script setup lang="ts">
import { ref } from 'vue'
import { TheChessboard, type MoveEvent } from 'vue3-chessboard'
import type { Square } from 'chess.js'
import 'vue3-chessboard/style.css'

import type { BoardApi, BoardConfig } from 'vue3-chessboard'
import type { Move } from './types/Move'
import { Turn } from './types/Turn'
import { getTotalNumberOfGames } from './utils/utils'

import { useFetchMovesData } from './useFetchMovesData'

const orientation = ref<BoardConfig['orientation']>('white')
const currentTurn = ref<Turn>(new Turn(orientation.value))
const moveSequence = ref<string>('')
const movesData = useFetchMovesData(moveSequence)
const selectedMove = ref<Move>()

let boardAPI: BoardApi;
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
  if (movesData.value != undefined) selectedMove.value = movesData.value.moves.find(m => m.san === move.san)
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

function submitMove() {
  if (selectedMove.value != undefined) moveSequence.value != '' ? moveSequence.value += "," + selectedMove.value?.uci : moveSequence.value = selectedMove.value.uci
}

const undoMove = () => {
  boardAPI.undoLastMove()
}

</script>

<template>
  <TheChessboard :board-config="boardConfig" @board-created="(api) => (boardAPI = api)"
    @move="(move) => pieceMoved(move)" />

  <div v-if="movesData">
    <v-btn v-for="move in movesData.moves" :key="move.san" @click="previewMove(move)" @mouseover="drawArrow(move)" @mouseout="removeArrows()">{{ move.san }} {{ getTotalNumberOfGames(move) }} </v-btn>
    <v-btn @click="submitMove">Välj drag</v-btn>
  <v-btn @click="undoMove">Ångra drag</v-btn>
  </div>

  

</template>

<style scoped></style>
