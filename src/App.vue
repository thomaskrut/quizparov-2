<script setup lang="ts">
import { ref } from 'vue'
import { TheChessboard } from 'vue3-chessboard'
import WinGraph from './components/WinGraph.vue' 
import 'vue3-chessboard/style.css'
import { type BoardConfig } from 'vue3-chessboard'
import { GameplayApi } from './types/Gameplay'

import { getTotalNumberOfGames } from './utils/utils'
import { State } from './types/State'

const orientation = ref<BoardConfig['orientation']>('white')

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

</script>

<template>
  <v-icon :icon=userFeedback.icon></v-icon>
  {{ userFeedback.message }}
  <TheChessboard :board-config="boardConfig" @board-created="(boardApi) => gameplay.setBoard(boardApi)"
    @move="(move) => gameplay.pieceMoved(move)" />

  <div v-if="movesData">
    <span v-if="(userFeedback.state != State.GuessMove) && (userFeedback.previousState != State.GuessMove)">
    <v-btn v-for="move in movesData.moves" :key="move.san" @click="gameplay.previewMove(move)"
      @mouseover="gameplay.drawMove(move)" @mouseout="gameplay.hideMoves()">{{
        move.san }} {{ getTotalNumberOfGames(move) }}
        <WinGraph :move="move" />
    </v-btn>

  </span>
    <v-btn @click="gameplay.submitButtonCallback()" :disabled="submitButtonStatus"><v-icon start icon="mdi-checkbox-marked-circle"></v-icon>{{ userFeedback.buttonText }}</v-btn>
    <v-btn @click="gameplay.undoLastMove()">Ångra drag</v-btn>
  </div>
</template>

<style scoped></style>
