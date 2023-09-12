<script setup lang="ts">

import { computed } from 'vue'
import { type Move } from '@/types/Move'

const props = defineProps<{
    line: Array<Move>,
    selectedMove?: Move | null,
}>()
    
const lineWithMoveCount = computed(() => {
    
        let count = 0
        return props.line.map((m: Move, index: number) => {  
            if ((index) % 2 == 0) {
                count++
                return { san: m.san, moveCount: count + ':' }
            } else {
                return { san: m.san, moveCount: '' }
            }
        })
})

</script>

<template>
    <div id="container">

        <span v-for="move in lineWithMoveCount" :key="move.san">
            <b class="text-caption">{{ move.moveCount }}</b> {{ move.san }} {{ ' ' }}
        </span>
        <!--<span v-if="selectedMove"><b class="text-disabled font-weight-thin">{{ nextMoveCount }}</b> {{ selectedMove.san }}?</span>-->
   
</div>
</template>

<style scoped>

</style>