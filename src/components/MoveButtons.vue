<script setup lang="ts">
import type { MovesData } from '@/types/MovesData';
import type { Move } from '@/types/Move';
import WinGraph from './WinGraph.vue';

const props = defineProps<{
    movesData: MovesData,
}>()

const emit = defineEmits(['previewMove', 'drawMove', 'hideMoves'])

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
    <v-btn block v-for="move in movesData.moves" :key="move.san" @click="previewMove(move)"
    @mouseover="drawMove(move)" @mouseout="hideMoves()">{{
      move.san }}
    <WinGraph :move="move" style="width: 100px" />
  </v-btn>
</template>

<style scoped>
</style>
