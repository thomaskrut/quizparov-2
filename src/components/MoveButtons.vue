<script setup lang="ts">
import type { MovesData } from '@/types/MovesData';
import type { Move } from '@/types/Move';
import WinGraph from './WinGraph.vue';
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

    

        <v-virtual-scroll :items="movesData.moves" max-height="60vh">

            <template v-slot:default="{ item }">

                <v-item-group selected-class="bg-primary" v-model="selectedButtonUci">
                    <v-item v-slot="{ selectedClass, toggle }" :value="item.uci">
                        <v-card :disabled="selectedMove != null" :class="['ma-2', selectedClass]" elevation="6" @click="{ toggle; previewMove(item) }" @mouseover="drawMove(item)" @mouseout="hideMoves()">

                            <v-card-item>
                                <v-card-title>{{ item.san }}</v-card-title>
                                <v-card-subtitle>
                                    <WinGraph :move="item" />
                                </v-card-subtitle>

                            </v-card-item>

                        </v-card>
                    </v-item>
                </v-item-group>
            </template>

        </v-virtual-scroll>

  

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
