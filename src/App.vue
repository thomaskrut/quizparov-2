<script setup lang="ts">
import { computed, ref } from 'vue'
import { TheChessboard } from 'vue3-chessboard'
import MoveButtons from './components/MoveButtons.vue'
import MoveDetails from './components/MoveDetails.vue'
import 'vue3-chessboard/style.css'
import { type BoardConfig } from 'vue3-chessboard'
import { GameplayApi } from './classes/Gameplay'
import { State } from './types/State'
import MoveCard from './components/MoveCard.vue'
import SettingsCard from './components/SettingsCard.vue'
import type { Settings } from './types/Settings'

const started = ref<boolean>(false)

const language = ref<string>('sv')

const moveButtonsToggle = ref<boolean>(true)

let gameplay: GameplayApi = new GameplayApi(language.value)

const { movesData, userFeedback, submitButtonStatus, selectedMove, currentLine, movesToAdd } = gameplay.useGameplayData()

const boardConfig = ref<BoardConfig>({
  coordinates: true,
  animation: {
    enabled: true,
    duration: 500,
  },
  draggable: {
    enabled: false
  }
})

function start(settings: Settings) {
  gameplay.start(settings.orientation, settings.treeDepth, settings.movesToConsier)
  boardConfig.value.orientation = settings.orientation
  started.value = true
}

function stop() {
  started.value = false
}

const undoButtonDisabled = computed(() => {
  return selectedMove.value?.uci == '' || (selectedMove.value == null && userFeedback.value.state != State.MoveNotInDb) || (userFeedback.value.state == State.CorrectMove || userFeedback.value.state == State.WrongMove || userFeedback.value.state == State.MoveAdded)
})

const showMoveDetails = computed(() => {
  return userFeedback.value.state == State.OpeningMove || userFeedback.value.state == State.CounterMove
})

const showRemoveIcon = computed(() => {
  return userFeedback.value.state == State.MoveAdded || userFeedback.value.state == State.CounterMove
})

const showMoveButtons = computed(() => {
  return (userFeedback.value.state != State.GuessMove) && (userFeedback.value.previousState != State.GuessMove) && (userFeedback.value.state != State.MaxDepthReached)
})

</script>

<template>
  <v-app>

   
    <v-app-bar title="Quizparov 2" color="lime" elevation="4" density="compact" flat>

      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

      <template v-slot:append>
  
      <v-switch :label="userFeedback.moveButtonsToggleText" v-model="moveButtonsToggle" hide-details inset></v-switch>
     
    </template>
    
    </v-app-bar>
  

    <v-main>
      <v-row justify="center">
        
        <v-col>
          <SettingsCard @start="(settings) => start(settings)" @stop="stop()"/>
        </v-col>

        <v-col align="center" lg="4" md="5" sm="8" xs="12">

          <v-card v-if="started" class="mt-5" elevation="4">
          <v-card-item>
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
              <v-btn variant="outlined" v-if="userFeedback.state != State.MoveAdded" class="ma-2" block
                @click="gameplay.undoLastMove()" :disabled="undoButtonDisabled"><v-icon start icon="mdi-undo"></v-icon>{{
                  userFeedback.undoButtonText }}</v-btn>

              <v-btn v-else variant="outlined" class="ma-2" block @click="gameplay.addAnotherMove()"><v-icon start
                  icon="mdi-plus"></v-icon>{{ userFeedback.addMoveButtonText }} </v-btn>


            </v-col>
            <v-spacer></v-spacer>
          </v-row>

          <span v-if="movesData">

            <MoveButtons
              v-if="moveButtonsToggle && showMoveButtons"
              :selectedMove="selectedMove" :movesData="movesData" @previewMove="(move) => gameplay.previewMove(move)"
              @drawMove="(move) => gameplay.drawMove(move)" @hideMoves="gameplay.hideMoves()" />

          </span>
        </v-card-item>
        </v-card>
        </v-col>

      

        <v-col lg="4" md="5" sm="8" xs="12">

          <transition-group name="move-cards" v-if="started">
            <MoveCard v-for="move in movesToAdd" :key="move.uci" :move="move" :remove-icon="showRemoveIcon"
              @removeMove="gameplay.removeMove(move)" @mouseover="gameplay.drawMove(move)"
              @mouseout="gameplay.hideMoves()" />
          </transition-group>

          <MoveDetails v-if="started && selectedMove != null && showMoveDetails" :selected-move="selectedMove"
            :moves-data="movesData" />


          <!--Buttons right panel-->
          <v-card class="mt-5" elevation="4" max-width="340" v-if="started && selectedMove != null && showMoveDetails">
            <v-card-actions>
              <v-btn class="ma-2" variant="outlined" @click="gameplay.submitButtonCallback()"
                :disabled="submitButtonStatus"><v-icon start icon="mdi-checkbox-marked-circle"></v-icon>{{
                  userFeedback.feedback.buttonText }}</v-btn>
              <v-btn class="ma-2" variant="outlined" @click="gameplay.undoLastMove()"
                :disabled="undoButtonDisabled"><v-icon start icon="mdi-undo"></v-icon>{{
                  userFeedback.undoButtonText
                }}</v-btn>
            </v-card-actions>
          </v-card>

        </v-col>

        <v-spacer> </v-spacer>
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
