/**
 * Grab the pellets as fast as you can!
 **/

/**
 * @typedef {object} Coordinate
 * @property {number} x
 * @property {number} y
 */

const WALL='#';
const EMPTY=' ';

class PacMap {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.map = [];
  }

  print() {
    this.map.forEach((r, i) => {
      console.error(i%10, ' ', r.map(c => {
        if (c === EMPTY) return EMPTY;
        if (c === WALL) return WALL;
        return 'P';
      }).join(''));
    });
  }

  addRow(i, row) {
    console.error(i, row);
    this.map.push(row.split(''));
  }

  setElement(i, j, element) {
    this.map[j][i] = element;
  }

  setPellet(i, j, pelletValue) {
    try {
      this.map[j][i] = pelletValue;
    } catch (e) {
      console.error("Setting pellet", i, j, this.width, this.height);
    }
  }

  setPlayer(i,j, id) {
    this.map[j][i] = id;
  }

  removePellet(i, j) {
    if (this.isPellet(i,j)) {
      this.map[j][i] = ' ';
    }
  }

  isWall(i, j) {
    return this.map[j][i] === WALL;
  }

  isPellet(i, j) {
    console.error("IS PELLET", i, j);
    return ![WALL, EMPTY].includes(this.map[j][i]) ? this.map[j][i] : false;
  }

  getValue(i, j) {
    return this.map[j][i];
  }

  isInLimits(i,j) {
    return i < this.width && i >= 0 && j >= 0 && this.height && this.map[j][i] !== WALL;
  }

  /**
   *
   * @param i {number}
   * @param j {number}
   * @returns {Coordinate[]}
   */
  getAdjacentListOf(i,j) {
    let adjacent = [
      [i+1, j],
      [i-1, j],
      [i, j + 1],
      [i, j - 1],
    ];
    return adjacent.filter(([x, y]) => this.isInLimits(x, y)).map(([x, y]) => ({ x, y }));
  }
}

class MapPositionedElement {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   *
   * @returns {Coordinate}
   */
  getPosition() {
    return { x: this.x, y: this.y };
  }

  /**
   *
   * @param elem {MapPositionedElement || Coordinate}
   */
  samePosition(elem) {
    return elem.x === this.x && elem.y === this.y;
  }
}

class PacMan extends MapPositionedElement {
  constructor(id, x, y, owner) {
    super(x, y);
    this.id = id;
    this.owner = owner;
  }

  isMine() {
    return this.owner !== '0';
  }
}

class Pellet extends MapPositionedElement {
  constructor(x, y, value) {
    super(x, y);
    this.value = value;
  }

  isSame(pellet) {
    return this.x === pellet.x
      && this.y === pellet.y
      && this.value === pellet.value;
  }
}

/**
 *
 * @param pacman {PacMan}
 * @param pellet {Pellet}
 * @param map {PacMap}
 */
const getNextStepInBestPathToPellet = (pacman, pellet, map) => {
  const initialPosition = pacman.getPosition();
  const pelletPosition = pellet.getPosition();
  const nextPos = [[pelletPosition, 0]];
  const visited = new Map();
  let [pos, value] = nextPos.shift();
  let posibleNextSteps = [];
  let finished = false;
  while (!finished) {
    if (!visited.has(`${pos.x}-${pos.y}`)) {
      visited.set(`${pos.x}-${pos.y}`, 1);
      const adjacent = map.getAdjacentListOf(pos.x, pos.y);
      const samePacmanPosition = adjacent.filter((adj) => pacman.samePosition(adj))[0]; //only one adjacent can be
      if (samePacmanPosition) {
        posibleNextSteps.push([pos, value]);
      } else {
        adjacent.forEach((adj) => {
          nextPos.push([adj, map.getValue(pos.x, pos.y)]);
        })
      }
    }
    if (nextPos.length > 0) {
      [pos, value] = nextPos.shift();
    } else {
      finished = true;
    }
  }
  posibleNextSteps.sort((a, b) => b.value - a.value);
  return posibleNextSteps[0];
}

const distanceToPoint = (from, to) => {
  return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
}

const pelletHeuristicValue = (pacman, pellet) => {
  const distance = distanceToPoint(pacman, pellet);
  const value = pellet.value;
  return distance - value;
}

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
let previousSelectedPellet = {
  pellet: null,
  value: Number.MAX_VALUE
};
// game loop
while (true) {
  var inputs = readline().split(' ');
  // const myScore = parseInt(inputs[0]);
  // const opponentScore = parseInt(inputs[1]);
  const visiblePacCount = parseInt(readline()); // all your pacs and enemy pacs in sight
  for (let i = 0; i < visiblePacCount; i++) {
    var inputs = readline().split(' ');
    const pacId = parseInt(inputs[0]); // pac number (unique within a team)
    const owner = inputs[1];
    const mine = owner !== '0'; // true if this pac is yours
    const x = parseInt(inputs[2]); // position in the grid
    const y = parseInt(inputs[3]); // position in the grid
    map.setPlayer(x, y, pacId);
    console.error('PACPOSITION', owner, x, y);
    const typeId = inputs[4]; // unused in wood leagues
    const speedTurnsLeft = parseInt(inputs[5]); // unused in wood leagues
    const abilityCooldown = parseInt(inputs[6]); // unused in wood leagues
    if (mine) {
      myPacs[pacId] = new PacMan(pacId, x, y, owner);
    } else {
      enemyPacs[pacId] = new PacMan(pacId, x, y, owner);
    }
  }

  const visiblePelletCount = parseInt(readline()); // all pellets in sight
  let bestPellet ={
    value: Number.MAX_VALUE,
  };
  for (let i = 0; i < visiblePelletCount; i++) {
    var inputs = readline().split(' ');
    const x = parseInt(inputs[0]);
    const y = parseInt(inputs[1]);
    const value = parseInt(inputs[2]); // amount of points this pellet is worth
    map.setPellet(x, y, value);
    const pellet = new Pellet(x, y, value);
    const pelletHeuristic = pelletHeuristicValue(Object.values(myPacs)[0], pellet);
    if (bestPellet.value > pelletHeuristic) {
      bestPellet = {
        pellet: pellet,
        value: pelletHeuristic,
      };
    }
  }

  const previousExists = previousSelectedPellet.pellet && map.isPellet(previousSelectedPellet.pellet.x, previousSelectedPellet.pellet.y);

  const pac = Object.values(myPacs)[0];
  //at this point we have the map created;
  if (bestPellet.value < previousSelectedPellet.value + 1 || !previousExists) {
    console.error('best is better', bestPellet, previousSelectedPellet);
    previousSelectedPellet = bestPellet;
  } else {
    console.error('previous is better', bestPellet, previousSelectedPellet);
    bestPellet = previousSelectedPellet;
  }

  const nextCoord = getNextStepInBestPathToPellet(pac, bestPellet.pellet, map);
  console.error(nextCoord);
  console.log(`MOVE ${pac.id} ${nextCoord[0].x} ${nextCoord[0].y}`)
  // console.log('MOVE 0 0', height - 1);
}
