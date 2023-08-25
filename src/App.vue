<script setup lang="ts">
import { ref, watch } from 'vue'
import { TheChessboard, type MoveEvent } from 'vue3-chessboard'
import type { Square } from 'chess.js'
import 'vue3-chessboard/style.css'

import type { BoardApi, BoardConfig, BrushColor } from 'vue3-chessboard'
import type { Move } from './types/Move'
import { Turn } from './types/Turn'

import { useFetchMovesData } from './useFetchMovesData'

const orientation = ref<BoardConfig['orientation']>('white')
const currentTurn = ref<Turn>(new Turn(orientation.value))
const currentMoveSequence = ref<string>('')
const currentMovesData = useFetchMovesData(currentMoveSequence)

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

const pieceMoved = (move: MoveEvent) => {
  console.log('Piece moved', move);
}

const drawArrow = (move: Move) => {
  const from = move.uci.slice(0, 2) as Square
  const to = move.uci.slice(2, 4) as Square
  boardAPI.drawMove(from, to, 'green')
}

const previewMove = (move: Move) => {
  boardAPI.move(move.san)
}

const selectMove = () => {

}

const undoMove = () => {
  boardAPI.undoLastMove()
}

</script>

<template>
  <TheChessboard :board-config="boardConfig" @board-created="(api) => (boardAPI = api)"
    @move="(move) => pieceMoved(move)" />

  <div v-if="currentMovesData">
    <v-btn v-for="move in currentMovesData.moves" :key="move.san" @click="previewMove(move)" @mouseover="drawArrow(move)">{{ move.san }}</v-btn>
    <v-btn @click="selectMove">Välj drag</v-btn>
  <v-btn @click="undoMove">Ångra drag</v-btn>
  </div>

  

</template>

<style scoped></style>
