<script setup lang="ts">

import { getTotalNumberOfGames } from '@/utils/utils';
import { ref } from 'vue'

const { move } = defineProps(['move'])

const whiteWins = ref((move.white / getTotalNumberOfGames(move) * 100).toFixed(0) + '%')
const draws = ref((move.draws / getTotalNumberOfGames(move) * 100).toFixed(0) + '%')
const blackWins = ref((move.black / getTotalNumberOfGames(move) * 100).toFixed(0) + '%')


</script>

<template>

<div class="bar">
    <div class="white" :style="{ width: whiteWins }">
   
    </div>
    <div class="draws" :style="{ width: draws }">
   
    </div>
    <div class="black" :style="{ width: blackWins }">
     
    </div>
</div>

</template>

<style scoped>

.bar {
    width: 100%;
    height: 4px;
    display: flex;
    background-color: black;
    border: 1px black solid;
}

.white {
    height: 100%;
    width: 0%;
    background-color: white;
    font-size: xx-small;
    justify-content: center;
}

.draws {
    height: 100%;
    width: 0%;
    background-color: gray;
    font-size: xx-small;
    text-align: center;
}

.black {
    height: 100%;
    width: 0%;
    background-color: black;
    font-size: xx-small;
    text-align: right;
}

</style>