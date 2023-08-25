import type { Move } from "./types/Move";
import { toValue, watch, ref } from 'vue'
import type { Ref } from 'vue'
import type { MovesData } from "./types/MovesData";

export function useFetchMovesData(pathVar: Ref<string>) {

    const movesData = ref<MovesData>()
    const moveCache = new Map<string, MovesData>()
  
    watch(pathVar, (newPathVar) => {
  
      movesData.value = undefined
      
      if (moveCache.has(toValue(newPathVar))) {
        console.log('cached response')
        movesData.value = moveCache.get(toValue(newPathVar))
        return { movesData }
      }
      console.log('API call')
      fetch('https://explorer.lichess.ovh/masters?moves=10&topGames=0&play=' + toValue(newPathVar))
        .then((res) => res.json())
        .then((json) => {
          movesData.value = {
            opening: json.opening?.name,
            moves: json.moves
          }
          moveCache.set(toValue(newPathVar), movesData.value)
        }).catch((err) => (console.log(err)))
    }, { immediate: true })
  
    return movesData
  }
        
