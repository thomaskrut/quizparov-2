<script setup lang="ts">
import { ref } from 'vue'
import type { BoardConfig } from 'vue3-chessboard';
import type { Settings } from '../types/Settings'
const started = ref<boolean>(false)

const treeDepth = ref<number>(4)
const movesToConsider = ref<number>(3)
const orientation = ref<BoardConfig['orientation']>('white')
69
const emit = defineEmits(['start', 'stop'])

function start() {
  started.value = true
  const settings = { treeDepth: treeDepth.value, movesToConsier: movesToConsider.value, orientation: orientation.value } as Settings
  emit('start', settings)
}

function stop() {
  started.value = false
  emit('stop')
}
</script>

<template>
    <v-card class="mt-5 ml-5" elevation="4" max-width="340">
        <v-card-item>
          <v-card-title>
            <div class="text-overline mb-1">
              Inställningar
          </div>
            <v-divider></v-divider>
          </v-card-title>
        </v-card-item>
        <v-card-text>
          <br>
          <p class="text-subtitle">Maxdjup</p>
            <v-slider :disabled="started" v-model="treeDepth" max="10" min="2" step="2"><template v-slot:append>{{ treeDepth }} </template></v-slider>
            
            <p class="text-subtitle">Alternativa drag motståndare</p>
            <v-slider :disabled="started" v-model="movesToConsider" max="10" min="1" step="1"><template v-slot:append>{{ movesToConsider }} </template></v-slider>
          
          
            <v-radio-group v-model="orientation" :disabled="started">
              <v-radio label="Träna som vit" value="white"></v-radio>
              <v-radio label="Träna som svart" value="black"></v-radio>
            </v-radio-group>
        </v-card-text>

        <v-card-actions>
          <v-btn block v-if="!started" variant="outlined" @click="start()">Starta</v-btn>
          <v-btn block v-if="started" variant="outlined" @click="stop()">Avbryt</v-btn>
        </v-card-actions>
      </v-card>
</template>