<script setup lang="ts">
import { getTotalNumberOfGames, getPositionOfMove, getPieceIcon } from '@/utils/utils';
import { type Move } from '@/types/Move';
import { type MovesData } from '@/types/MovesData';
import WinGraph from './WinGraph.vue';

defineProps<{
    selectedMove: Move;
    movesData: MovesData | null;
}>();
</script>

<template>
    <v-card class="mt-4" elevation="2" max-width="340">
        <v-card-item>
            <div>
                <div class="text-overline mb-1">
                    Ditt drag
                    <v-divider></v-divider>
                </div>
                <div class="text-h3 ma-4">
                    <v-icon>
                        {{ getPieceIcon(selectedMove) }}
                    </v-icon>
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
    </v-card>
</template>