<script setup lang="ts">
import { computed, ref, type StyleValue } from 'vue'
import { TheChessboard } from 'vue3-chessboard'
import WinGraph from './components/WinGraph.vue'
import MoveButtons from './components/MoveButtons.vue'
import 'vue3-chessboard/style.css'
import { type BoardConfig } from 'vue3-chessboard'
import { GameplayApi } from './types/Gameplay'

import { getTotalNumberOfGames } from './utils/utils'
import { State } from './types/State'

const orientation = ref<BoardConfig['orientation']>('black')

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

const undoButtonDisabled = computed(() => {
  return (selectedMove.value == null && userFeedback.value.state != State.MoveNotInDb) || (userFeedback.value.state == State.CorrectMove || userFeedback.value.state == State.WrongMove || userFeedback.value.state == State.LineSaved)
})

</script>

<template>
  <v-app>

    <v-main>

      <v-row no-gutters justify="center" align="center">
        <v-col cols="4" class="pa-6">

          <v-alert density="comfortable" :color="userFeedback.color" :icon="userFeedback.icon"
            :title="userFeedback.message">
          </v-alert>

        </v-col>

      </v-row>

      <v-row no-gutters justify="center" align="center">

        <v-col cols="2">

        </v-col>

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

      <v-row no-gutters justify="center" align="center">

        <v-col cols="4">
          <v-row no-gutters>
            <v-col cols="6" align="center">
              <v-btn style="width: 80%" size="large" @click="gameplay.submitButtonCallback()" :disabled="submitButtonStatus"><v-icon start
                  icon="mdi-checkbox-marked-circle"></v-icon>{{ userFeedback.buttonText }}</v-btn>
            </v-col>
            <v-col cols="6" align="center">
              <v-btn style="width: 80%" size="large" @click="gameplay.undoLastMove()"
                :disabled="undoButtonDisabled"><v-icon start
                icon="mdi-undo"></v-icon>Ångra drag</v-btn>
            </v-col>
          </v-row>
        </v-col>

      </v-row>

    </v-main>
  </v-app>
</template>

<style scoped></style>
