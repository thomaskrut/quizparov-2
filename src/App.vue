<script setup lang="ts">
import { ref, watch } from 'vue'
import { TheChessboard, type MoveEvent } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'

import type { BoardApi, BoardConfig } from 'vue3-chessboard'
import type { Move } from './types/Move'
import { Turn } from './types/Turn'

import { useFetchMovesData } from './useFetchMovesData'

const orientation = ref<BoardConfig['orientation']>('black')
const currentTurn = ref<Turn>(new Turn(orientation.value))
const currentMoveSequence = ref<string>('')
//const currentMovesData = useFetchMovesData(currentMoveSequence)

let boardAPI: BoardApi;
const boardConfig: BoardConfig = {
  coordinates: true,
  orientation: orientation.value,
}

const pieceMoved = (move: MoveEvent) => {
  console.log('Piece moved', move);
}


</script>

<template>
  <TheChessboard
      :board-config="boardConfig"
      @board-created="(api) => (boardAPI = api)"
      @move="(move) => pieceMoved(move)"
    />
</template>

<style scoped>

</style>
