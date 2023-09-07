<script setup lang="ts">
import { ref, type StyleValue } from 'vue'
import { TheChessboard } from 'vue3-chessboard'
import WinGraph from './components/WinGraph.vue'
import MoveButtons from './components/MoveButtons.vue'
import 'vue3-chessboard/style.css'
import { type BoardConfig } from 'vue3-chessboard'
import { GameplayApi } from './types/Gameplay'

import { getTotalNumberOfGames } from './utils/utils'
import { State } from './types/State'

const orientation = ref<BoardConfig['orientation']>('white')

let gameplay: GameplayApi = new GameplayApi(orientation.value)

const { movesData, userFeedback, submitButtonStatus, selectedMove } = gameplay.useGameplayData()

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
  <v-app>

    <v-main>

      <v-row no-gutters>
        <v-col cols="4" class="pa-7">
          
          <v-alert :color="userFeedback.color" :icon="userFeedback.icon" :title="userFeedback.message">
          </v-alert>
      
        </v-col>
        <v-col cols="2">
          
       
      
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="4">
          <TheChessboard :board-config="boardConfig" @board-created="(boardApi) => gameplay.setBoard(boardApi)"
            @move="(move) => gameplay.pieceMoved(move)" style="width: 70vh" />
        </v-col>
        <v-col cols="2">
          <div v-if="movesData">

            <MoveButtons v-if="(userFeedback.state != State.GuessMove) && (userFeedback.previousState != State.GuessMove)"
              :selectedMove="selectedMove" :movesData="movesData" @previewMove="(move) => gameplay.previewMove(move)"
              @drawMove="(move) => gameplay.drawMove(move)" @hideMoves="gameplay.hideMoves()" />

          </div>
        </v-col>
      </v-row>

      <v-row no-gutters>
        
        <v-col cols="4">
          <v-btn block @click="gameplay.submitButtonCallback()" :disabled="submitButtonStatus" class="ma-4"><v-icon start
            icon="mdi-checkbox-marked-circle"></v-icon>{{ userFeedback.buttonText }}</v-btn>
        <v-btn block @click="gameplay.undoLastMove()" class="ma-4"
          :disabled="submitButtonStatus && userFeedback.state != State.MoveNotInDb">Ångra drag</v-btn>
        </v-col>
  
        <v-col cols="2" class="pa-7">
        
        </v-col>
      </v-row>

    </v-main>
  </v-app>
</template>

<style scoped></style>
