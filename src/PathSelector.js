import { getCoordinateHeuristic } from './HeuristicFunctions';
import { PENALIZATION } from './HeuristicFunctions';

/**
 *
 * @param pacman {PacMan}
 * @param pellet {Pellet}
 * @param map {PacMap}
 */
export const getNextStepInBestPathToPellet = (pacman, pellet, map) => {
  const pelletPosition = pellet.getPosition();
  const nextPos = [[pelletPosition, 0]];
  const visited = new Map();
  let [pos, accumValue] = nextPos.shift();
  let posibleNextSteps = [];
  let finished = false;
  const getMapKey = (p) => `${p.x}-${p.y}`
  while (!finished) {
    const key = getMapKey(pos);
    if (!visited.has(key)) {
      visited.set(key, 1); // just mark it as visited
      const adjacent = map.getAdjacentListOf(pos.x, pos.y).filter((adj) => !visited.has(getMapKey(adj)));
      const samePacmanPosition = adjacent.filter((adj) => pacman.samePosition(adj))[0]; //only one adjacent can be
      const adjacentPacman = adjacent.some((coord) => map.isOtherPlayer(coord.x, coord.y));
      if (adjacentPacman) {
        accumValue += PENALIZATION.player; // set a penalization to this cell because of the surroundings
      }
      if (samePacmanPosition) {
        posibleNextSteps.push([pos, accumValue]);
      } else {
        adjacent.forEach((adj) => {
          const heuristicValue = getCoordinateHeuristic(map, adj);
          nextPos.push([adj, heuristicValue + accumValue + 1]);
        })
      }
    }
    if (nextPos.length > 0) {
      [pos, accumValue] = nextPos.shift();
    } else {
      finished = true;
    }
  }
  posibleNextSteps.sort((a, b) => b.value - a.value);
  return posibleNextSteps[0][0];
}
