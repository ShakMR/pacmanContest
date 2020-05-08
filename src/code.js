import PacMap from './PacMap';
import PacMan, { Objective } from './PacMan';
import Pellet from './Pellet';

import { prepareMovement, debug } from './Utils';
import { getNextStepInBestPathToPellet } from './PathSelector';
import { pelletHeuristicValue } from './HeuristicFunctions';
/**
 * Grab the pellets as fast as you can!
 **/

// this is generating the map
var inputs = readline().split(' ');
const width = parseInt(inputs[0]); // size of the grid
const height = parseInt(inputs[1]); // top left corner is (x=0, y=0)

let map = new PacMap(width, height);
for (let i = 0; i < height; i++) {
  const row = readline(); // one line of the grid: space " " is floor, pound "#" is wall
  map.addRow(i, row);
}

let myPacs = {};
let enemyPacs = {};
let move;
// game loop
while (true) {
  var inputs = readline().split(' ');
  // const myScore = parseInt(inputs[0]);
  // const opponentScore = parseInt(inputs[1]);
  const visiblePacCount = parseInt(readline()); // all your pacs and enemy pacs in sight
  let nMyPacs = 0;
  for (let i = 0; i < visiblePacCount; i++) {
    var inputs = readline().split(' ');
    const pacId = parseInt(inputs[0]); // pac number (unique within a team)
    const owner = inputs[1];
    const mine = owner !== '0'; // true if this pac is yours
    const x = parseInt(inputs[2]); // position in the grid
    const y = parseInt(inputs[3]); // position in the grid
    const typeId = inputs[4]; // unused in wood leagues
    const speedTurnsLeft = parseInt(inputs[5]); // unused in wood leagues
    const abilityCooldown = parseInt(inputs[6]); // unused in wood leagues
    const pac = new PacMan(pacId, x, y, owner);
    map.setPlayer(x, y, pac);
    if (mine) {
      nMyPacs++;
      myPacs[pacId] = pac;
    } else {
      enemyPacs[pacId] = pac;
    }
  }
  move = prepareMovement(nMyPacs);

  const visiblePelletCount = parseInt(readline()); // all pellets in sight
  let availableObjectives = [];
  const pacs = Object.values(myPacs);
  for (let i = 0; i < visiblePelletCount; i++) {
    var inputs = readline().split(' ');
    const x = parseInt(inputs[0]);
    const y = parseInt(inputs[1]);
    const value = parseInt(inputs[2]); // amount of points this pellet is worth
    const pellet = new Pellet(x, y, value);
    map.setPellet(x, y, pellet);
    pacs.forEach((pac) => {
      const pelletHeuristic = pelletHeuristicValue(pac, pellet);
      availableObjectives.push(new Objective(pellet, pelletHeuristic));
    })
  }

  const selectablePellets = availableObjectives.sort(Objective.cmp());

  pacs.forEach((pac, index) => {
    let bestPellet = selectablePellets[index];
    const objective = pac.objective || {};
    const previousExists = objective.pellet && map.isPellet(objective.pellet.x, objective.pellet.y);

    //at this point we have the map created;
    if (bestPellet.value < objective.value + 1 || !previousExists) {
      pac.setObjective(bestPellet);
    } else {
      bestPellet = objective;
    }

    const nextCoord = getNextStepInBestPathToPellet(pac, bestPellet.pellet, map);
    debug(nextCoord);
    move(pac.id, nextCoord.x, nextCoord.y);
  })
}
