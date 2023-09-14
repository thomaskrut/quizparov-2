<script setup lang="ts">
import { computed, ref } from 'vue'
import { TheChessboard } from 'vue3-chessboard'
import MoveButtons from './components/MoveButtons.vue'
import 'vue3-chessboard/style.css'
import { type BoardConfig } from 'vue3-chessboard'
import { GameplayApi } from './classes/Gameplay'
import { State } from './types/State'
import WinGraph from './components/WinGraph.vue'
import LineViewer from './components/LineViewer.vue'
import { getTotalNumberOfGames, getPositionOfMove } from './utils/utils'

const orientation = ref<BoardConfig['orientation']>('white')
const language = ref<string>('sv')

const showMoveButtons = ref<boolean>(true)

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

    <!--
    <v-app-bar title="Quizparov 2" color="primary" density="compact" flat>

      <template v-slot:prepend>
       
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

      <template v-slot:append>
  
      <v-switch :label="userFeedback.moveButtonsToggleText" v-model="showMoveButtons" hide-details inset></v-switch>
     
    </template>
    
    </v-app-bar>
    -->

    <v-main>
      <v-row justify="center">
        <v-spacer></v-spacer>
        <v-col align="center" lg="4" md="5" sm="6">

          <v-alert class="ma-1" :color="userFeedback.color" :icon="userFeedback.icon"
            :title="userFeedback.feedback.message">
          </v-alert>

          <TheChessboard :board-config="boardConfig" @board-created="(boardApi) => gameplay.setBoard(boardApi)"
            @move="(move) => gameplay.pieceMoved(move)" class="w-auto" />

          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="5">
              <v-btn class="ma-2" block @click="gameplay.submitButtonCallback()" :disabled="submitButtonStatus"><v-icon
                  start icon="mdi-checkbox-marked-circle"></v-icon>{{
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

            <MoveButtons
              v-if="showMoveButtons && (userFeedback.state != State.GuessMove) && (userFeedback.previousState != State.GuessMove)"
              :selectedMove="selectedMove" :movesData="movesData" @previewMove="(move) => gameplay.previewMove(move)"
              @drawMove="(move) => gameplay.drawMove(move)" @hideMoves="gameplay.hideMoves()" />

          </span>
        </v-col>

        <v-col>
          <v-card class="mt-4" elevation="2" v-if="selectedMove != null" max-width="320" variant="outlined">
            <v-card-item>
              <div>
                <div class="text-overline mb-1">
                  Ditt drag
                  <v-divider></v-divider>
                </div>
                <div class="text-h3 ma-4">
                  {{ selectedMove?.san }}
                </div>
                <v-divider></v-divider>
                <div class="text-caption">
                  Antal partier: {{ getTotalNumberOfGames(selectedMove) }}
                  ({{ getPositionOfMove(movesData!.moves, selectedMove) + 1 }}/{{ movesData?.moves.length }})
                  <v-divider></v-divider>
                  Vinst vit: {{ (selectedMove.white / getTotalNumberOfGames(selectedMove) * 100).toFixed(1) }}%
                  <v-divider></v-divider>
                  Vinst svart: {{ (selectedMove.black / getTotalNumberOfGames(selectedMove) * 100).toFixed(1) }}%
                  <v-divider></v-divider>
                  Remi: {{ (selectedMove.draws / getTotalNumberOfGames(selectedMove) * 100).toFixed(1) }}%
                  <v-divider></v-divider>
                  <WinGraph :move="selectedMove" />
                </div>
                
              </div>
            </v-card-item>
            <v-card-actions>
              <v-btn class="ma-2" variant="outlined" @click="gameplay.submitButtonCallback()" :disabled="submitButtonStatus"><v-icon
                start icon="mdi-checkbox-marked-circle"></v-icon>{{
                  userFeedback.feedback.buttonText }}</v-btn>
                  <v-btn class="ma-2" variant="outlined" @click="gameplay.undoLastMove()" :disabled="undoButtonDisabled"><v-icon start
                    icon="mdi-undo"></v-icon>{{ userFeedback.undoButtonText
                    }}</v-btn>
            </v-card-actions>
          
          </v-card>
        </v-col>

       

      </v-row>

    </v-main>
  </v-app>
</template>

<style scoped></style>
