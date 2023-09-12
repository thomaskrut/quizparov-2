<script setup lang="ts">
import type { MovesData } from '@/types/MovesData';
import type { Move } from '@/types/Move';
import { ref, watch } from 'vue';

const props = defineProps<{
    movesData: MovesData,
    selectedMove: Move | null
}>()

const selectedButtonUci = ref<string | undefined>(undefined)

const emit = defineEmits(['previewMove', 'drawMove', 'hideMoves'])

watch(() => props.selectedMove, () => selectedButtonUci.value = props.selectedMove?.uci)

function previewMove(move: Move) {
    emit('previewMove', move)
}

function drawMove(move: Move) {
    emit('drawMove', move)
}

function hideMoves() {
    emit('hideMoves')
}
</script>

<template>

                <v-slide-group v-model="selectedButtonUci" selected-class="bg-success">
                    <v-slide-group-item v-for="move in movesData.moves" :key="move.uci" :value="move.uci" v-slot="{ toggle, selectedClass }">
                        <v-btn :disabled="selectedMove != null" :class="['ma-1', selectedClass]" @click="previewMove(move)" @mouseover="drawMove(move)" @mouseout="hideMoves()">

                      {{ move.san }}
                           

                        </v-btn>
                    </v-slide-group-item>
          
                </v-slide-group>
{{ selectedButtonUci }}
            

  

<!--
    <v-btn block v-for="move in movesData.moves" :key="move.san" @click="previewMove(move)"
    @mouseover="drawMove(move)" @mouseout="hideMoves()">{{
      move.san }}
    <WinGraph :move="move" style="width: 100px" />
  </v-btn>

-->
</template>

<style scoped>
</style>
