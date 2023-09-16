<script setup lang="ts">
import { getPieceIcon } from '@/utils/utils';
import { type Move } from '@/types/Move';
import WinGraph from './WinGraph.vue';
import { onMounted, ref } from 'vue';
defineProps<{
    move: Move;
}>();

defineEmits(['removeMove']);

const highlighted = ref<boolean>(false);

onMounted(() => {
    setTimeout(() => {
        highlighted.value = false;
    }, 300);
});


</script>

<template>
    <v-card class="mt-4" elevation="2" max-width="340" :class="{'bg-info': highlighted}">
        <template v-slot:prepend>
          <v-icon size="x-large">
            {{ getPieceIcon(move) }}
          </v-icon>
        </template>
          <template v-slot:title>
            {{ move.san }}
          </template>
          <template v-slot:append>
            <v-icon @click="$emit('removeMove')">
              mdi-minus-circle-outline
            </v-icon>
        </template>
        <v-card-text>
          <WinGraph :move="move" />
        </v-card-text>
      </v-card>

</template>
