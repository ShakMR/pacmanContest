const distanceToPoint = (from, to) => {
  return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
}

/**
 *
 * @param {PacMan} pacman
 * @param {Pellet} pellet
 * @returns {number}
 */
export const pelletHeuristicValue = (pacman, pellet) => {
  const distance = distanceToPoint(pacman, pellet);
  const value = pellet.value;
  return distance - value;
}


export const PENALIZATION = {
  player: 1000,
  empty: 1,
}

/**
 *
 * @param {PacMap} map
 * @param {Coordinate} coord
 */
export const getCoordinateHeuristic = (map, coord) => {
  const isPacman = map.isOtherPlayer(coord.x, coord.y);
  const isPellet = map.isPellet(coord.x, coord.y);
  if (isPacman) {
    return PENALIZATION.player;
  }
  if (isPellet) {
    return - map.getValue(coord.x, coord.y).value; // we are penalizing so a pellet is the contrary
  }
  return PENALIZATION.empty;
}
