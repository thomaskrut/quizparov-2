<script setup lang="ts">
import { computed, ref } from 'vue'
import { TheChessboard } from 'vue3-chessboard'
import MoveButtons from './components/MoveButtons.vue'
import MoveDetails from './components/MoveDetails.vue'
import 'vue3-chessboard/style.css'
import { type BoardConfig } from 'vue3-chessboard'
import { GameplayApi } from './classes/Gameplay'
import { State } from './types/State'
import WinGraph from './components/WinGraph.vue'
import LineViewer from './components/LineViewer.vue'
import { getTotalNumberOfGames, getPositionOfMove, getPieceIcon } from './utils/utils'
import MoveCard from './components/MoveCard.vue'

const orientation = ref<BoardConfig['orientation']>('white')
const language = ref<string>('sv')

const showMoveButtons = ref<boolean>(true)

let gameplay: GameplayApi = new GameplayApi(orientation.value, language.value)

const { movesData, userFeedback, submitButtonStatus, selectedMove, currentLine, movesToAdd } = gameplay.useGameplayData()

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
  return selectedMove.value?.uci == '' || (selectedMove.value == null && userFeedback.value.state != State.MoveNotInDb) || (userFeedback.value.state == State.CorrectMove || userFeedback.value.state == State.WrongMove || userFeedback.value.state == State.MoveAdded)
})

const showMoveDetails = computed(() => {
  return userFeedback.value.state == State.OpeningMove || userFeedback.value.state == State.CounterMove
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
              <v-btn variant="outlined" class="ma-2" block @click="gameplay.submitButtonCallback()"
                :disabled="submitButtonStatus"><v-icon start icon="mdi-checkbox-marked-circle"></v-icon>{{
                  userFeedback.feedback.buttonText }}</v-btn>
            </v-col>
            <v-col cols="5">
              <v-btn v-if="userFeedback.state != State.MoveAdded" variant="outlined" class="ma-2" block
                @click="gameplay.undoLastMove()" :disabled="undoButtonDisabled"><v-icon start icon="mdi-undo"></v-icon>{{
                  userFeedback.undoButtonText }}</v-btn>

              <v-btn v-else variant="outlined" class="ma-2" block @click="gameplay.addAnotherMove()"><v-icon start
                  icon="mdi-plus"></v-icon>{{ userFeedback.addMoveButtonText }} </v-btn>


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

          <transition-group name="move-cards">
          <MoveCard v-for="move in movesToAdd" :key="move.uci" :move="move" @removeMove="gameplay.removeMove(move)" @mouseover="gameplay.drawMove(move)" @mouseout="gameplay.hideMoves()"/>
        </transition-group>
          
          <MoveDetails v-if="selectedMove != null && showMoveDetails" :selected-move="selectedMove" :moves-data="movesData"/>

          
          <!--Buttons right panel-->
          <v-card class="mt-4" elevation="2" max-width="340" v-if="selectedMove != null && showMoveDetails">
            <v-card-actions>
              <v-btn class="ma-2" variant="outlined" @click="gameplay.submitButtonCallback()"
                :disabled="submitButtonStatus"><v-icon start icon="mdi-checkbox-marked-circle"></v-icon>{{
                  userFeedback.feedback.buttonText }}</v-btn>
              <v-btn v-if="userFeedback.state != State.MoveAdded" class="ma-2" variant="outlined"
                @click="gameplay.undoLastMove()" :disabled="undoButtonDisabled"><v-icon start icon="mdi-undo"></v-icon>{{
                  userFeedback.undoButtonText
                }}</v-btn>
              <v-btn v-else variant="outlined" class="ma-2" @click="gameplay.addAnotherMove()"><v-icon start
                  icon="mdi-plus"></v-icon>{{ userFeedback.addMoveButtonText }} </v-btn>
            </v-card-actions>
          </v-card>

        </v-col>



      </v-row>

    </v-main>
  </v-app>
</template>

<style scoped>

.move-cards-enter-active {
  transition: all 0.3s ease-out;
}

.move-cards-enter-from {
  transform: translateY(20px);
  opacity: 0;

}

</style>
