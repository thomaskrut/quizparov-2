import type { MovesData } from "./types/MovesData";

const moveCache = new Map<string, MovesData>(null)

export async function fetchMovesData(pathVar: string): Promise<MovesData | null> {

  if (moveCache.has(pathVar)) {
    console.log('cached response')

    return moveCache.get(pathVar) ?? null
  }
  console.log('API call')
  
  const response = await fetch('https://explorer.lichess.ovh/masters?moves=20&topGames=0&play=' + pathVar)
  const json = await response.json()
  const movesData: MovesData = {
    opening: json.opening?.name,
    moves: json.moves
  }
  moveCache.set(pathVar, movesData)
  return movesData
}



