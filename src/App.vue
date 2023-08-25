<script setup lang="ts">
import { ref } from 'vue'
import { TheChessboard } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'

import type { BoardApi, BoardConfig } from 'vue3-chessboard'
import type { Move } from 'chess.js'

const orientation = ref<BoardConfig["orientation"]>('black')

let boardAPI: BoardApi;
const boardConfig: BoardConfig = {
  coordinates: true,
  orientation: orientation.value,
}

const pieceMoved = (move: Move) => {
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
