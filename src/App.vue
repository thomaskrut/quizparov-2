<script setup lang="ts">
import { computed, ref } from 'vue'
import { TheChessboard } from 'vue3-chessboard'
import MoveButtons from './components/MoveButtons.vue'
import 'vue3-chessboard/style.css'
import { type BoardConfig } from 'vue3-chessboard'
import { GameplayApi } from './classes/Gameplay'
import { State } from './types/State'
import LineViewer from './components/LineViewer.vue'

const orientation = ref<BoardConfig['orientation']>('white')
const language = ref<string>('sv')

let gameplay: GameplayApi = new GameplayApi(orientation.value, language.value)

const { movesData, userFeedback, submitButtonStatus, selectedMove, currentLine } = gameplay.useGameplayData()

const boardConfig: BoardConfig = {
  coordinates: true,
  orientation: orientation.value,
  animation: {
    enabled: true,
    duration: 500,
  },
  draggable: {
    enabled: false
  }
}

const undoButtonDisabled = computed(() => {
  return selectedMove.value?.uci == '' || (selectedMove.value == null && userFeedback.value.state != State.MoveNotInDb) || (userFeedback.value.state == State.CorrectMove || userFeedback.value.state == State.WrongMove || userFeedback.value.state == State.LineSaved)
})

</script>

<template>
  <v-app>

    <v-main>


      <v-row>

        <v-col cols="auto">

          <v-alert class="ma-3" density="compact" :color="userFeedback.color" :icon="userFeedback.icon"
            :title="userFeedback.feedback.message" style="width: 60vh">
          </v-alert>

          <TheChessboard :board-config="boardConfig" @board-created="(boardApi) => gameplay.setBoard(boardApi)"
            @move="(move) => gameplay.pieceMoved(move)" style="width: 60vh" />

          <LineViewer :line="currentLine" class="ml-4" />

          <v-btn block class="ma-2" style="width: 60vh" size="large" @click="gameplay.submitButtonCallback()"
            :disabled="submitButtonStatus"><v-icon start icon="mdi-checkbox-marked-circle"></v-icon>{{
              userFeedback.feedback.buttonText }}</v-btn>

          <v-btn block class="ma-2" style="width: 60vh" size="large" @click="gameplay.undoLastMove()"
            :disabled="undoButtonDisabled"><v-icon start icon="mdi-undo"></v-icon>{{ userFeedback.undoButtonText
            }}</v-btn>

        </v-col>

        <v-col cols="auto">
          
          <span v-if="movesData">

            <MoveButtons v-if="(userFeedback.state != State.GuessMove) && (userFeedback.previousState != State.GuessMove)"
              :selectedMove="selectedMove" :movesData="movesData" @previewMove="(move) => gameplay.previewMove(move)"
              @drawMove="(move) => gameplay.drawMove(move)" @hideMoves="gameplay.hideMoves()" />

          </span>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>

      <v-row style="height: 26px">
        <v-col>

        </v-col>
      </v-row>

      <v-row>

        <v-col cols="auto">



        </v-col>

      </v-row>

    </v-main>
  </v-app>
</template>

<style scoped></style>
