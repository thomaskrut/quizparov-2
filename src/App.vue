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

const showMoveButtons = computed(() => {
  return userFeedback.value.state == State.OpeningMove || userFeedback.value.state == State.CounterMove
})


</script>

<template>
  <v-app>

    <v-main>

   
      <v-row>

        <v-spacer></v-spacer>
        
        <v-col align="center" lg="4" md="5" sm="6">

          <v-alert class="ma-1" :color="userFeedback.color" :icon="userFeedback.icon"
            :title="userFeedback.feedback.message">
          </v-alert>

          <TheChessboard :board-config="boardConfig" @board-created="(boardApi) => gameplay.setBoard(boardApi)"
            @move="(move) => gameplay.pieceMoved(move)" class="w-auto"/>

        

          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="5">
              <v-btn class="ma-2" block @click="gameplay.submitButtonCallback()" :disabled="submitButtonStatus"><v-icon start
                  icon="mdi-checkbox-marked-circle"></v-icon>{{
                    userFeedback.feedback.buttonText }}</v-btn>
            </v-col>
            <v-col cols="5">
              <v-btn class="ma-2" block @click="gameplay.undoLastMove()" :disabled="undoButtonDisabled"><v-icon start
                  icon="mdi-undo"></v-icon>{{ userFeedback.undoButtonText
                  }}</v-btn>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>

          <span v-if="movesData">

            <MoveButtons v-if="showMoveButtons"
              :selectedMove="selectedMove" :movesData="movesData" @previewMove="(move) => gameplay.previewMove(move)"
              @drawMove="(move) => gameplay.drawMove(move)" @hideMoves="gameplay.hideMoves()" />

          </span>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
 
    </v-main>
  </v-app>
</template>

<style scoped></style>
