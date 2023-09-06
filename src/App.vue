<script setup lang="ts">
import { ref } from 'vue'
import { TheChessboard } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'
import { BoardApi, type BoardConfig } from 'vue3-chessboard'
import { GameplayApi } from './types/Gameplay'

import { getTotalNumberOfGames } from './utils/utils'
import type { MovesData } from './types/MovesData'

const orientation = ref<BoardConfig['orientation']>('white')

let board: BoardApi

let gameplay: GameplayApi = new GameplayApi(orientation.value)

const { movesData, userFeedback, submitButtonStatus } = gameplay.useGameplayData()

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

function initGame(newBoard: BoardApi) {
  gameplay.setBoard(newBoard)
  board = newBoard
  
}

</script>

<template>
  {{ userFeedback.message }}
  <TheChessboard :board-config="boardConfig" @board-created="(boardApi) => initGame(boardApi)"
    @move="(move) => gameplay.pieceMoved(move)" />

  <div v-if="movesData/* && turn.color == orientation*/">
    <div v-if="userFeedback.message != 'Vilket drag spelar du nu?'">
    <v-btn v-for="move in movesData.moves" :key="move.san" @click="gameplay.previewMove(move)"
      @mouseover="gameplay.drawMove(move)" @mouseout="gameplay.hideMoves()">{{
        move.san }} {{ getTotalNumberOfGames(move) }}
    </v-btn>
  </div>
    <v-btn @click="gameplay.submitButtonCallback()" :disabled="submitButtonStatus">{{ userFeedback.buttonText }}</v-btn>
    <v-btn @click="gameplay.undoLastMove()">Ångra drag</v-btn>
  </div>
</template>

<style scoped></style>
