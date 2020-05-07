/**
 * Grab the pellets as fast as you can!
 **/

const WALL='#';
const EMPTY=' ';

class Map {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.map = new Array(width);
  }

  addRow(i, row) {
    this.map[i] = row.split('');
  }

  setElement(i, j, element) {
    this.map[i][j] = element;
  }

  setPellet(i, j, pelletValue) {
    this.map[i][j] = pelletValue;
  }

  removePellet(i, j) {
    this.map[i][j] = ' ';
  }

  isWall(i, j) {
    return this.map[i][j] === WALL;
  }

  isPellet(i, j) {
    return ![WALL, EMPTY].includes(this.map[i][j]) ? this.map[i][j] : false;
  }

  isInLimits(i,j) {
    return i < this.width && i >= 0 && j >= 0 && this.height;
  }

  getAdjacentListOf(i,j) {
    let adjacent = [
      [i+1, j],
      [i-1, j],
      [i, j + 1],
      [i, j - 1],
    ];
    return adjacent.filter(([x, y]) => this.isInLimits(x, y));
  }
}

class PacMan {
  constructor(id, x, y, owner) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.owner = owner;
  }

  isMine() {
    return this.owner !== '0';
  }

  getPosition() {
    return [this.x, this.y];
  }
}

class Pellet {
  constructor(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
  }

  getPosition() {
    return [this.x, this.y];
  }

  isSame(pellet) {
    return this.x === pellet.x
      && this.y === pellet.y
      && this.value === pellet.value;
  }
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

let map = new Map(width, height);
for (let i = 0; i < height; i++) {
  const row = readline(); // one line of the grid: space " " is floor, pound "#" is wall
  //map.addRow(i, row);
}

let myPacs = {};
let lastSelectedPoint = null;
// game loop
while (true) {
  var inputs = readline().split(' ');
  const myScore = parseInt(inputs[0]);
  const opponentScore = parseInt(inputs[1]);
  const visiblePacCount = parseInt(readline()); // all your pacs and enemy pacs in sight
  for (let i = 0; i < visiblePacCount; i++) {
    var inputs = readline().split(' ');
    const pacId = parseInt(inputs[0]); // pac number (unique within a team)
    const owner = inputs[1];
    const mine = owner !== '0'; // true if this pac is yours
    const x = parseInt(inputs[2]); // position in the grid
    const y = parseInt(inputs[3]); // position in the grid
    console.error('PACPOSITION', owner, x, y);
    const typeId = inputs[4]; // unused in wood leagues
    const speedTurnsLeft = parseInt(inputs[5]); // unused in wood leagues
    const abilityCooldown = parseInt(inputs[6]); // unused in wood leagues
    if (mine) {
      myPacs[pacId] = new PacMan(pacId, x, y, owner);
    }
  }
  const visiblePelletCount = parseInt(readline()); // all pellets in sight
  let pelletsArray = [];
  const lastStillPresent = false;
  for (let i = 0; i < visiblePelletCount; i++) {
    var inputs = readline().split(' ');
    const x = parseInt(inputs[0]);
    const y = parseInt(inputs[1]);
    const value = parseInt(inputs[2]); // amount of points this pellet is worth
    //map.setPellet(x, y, value);
    const pellet = new Pellet(x, y, value)
    if (lastSelectedPoint && pellet.isSame(lastSelectedPoint)) {
      pelletsArray = [pellet];
      break;
    }
    pelletsArray.push(pellet);
  }

  const firstPac = Object.values(myPacs)[0];
  pelletsArray.sort(
    (a, b) =>
      pelletHeuristicValue(firstPac, a)
      - pelletHeuristicValue(firstPac, b),
  );

  // Write an action using console.log()
  // To debug: console.error('Debug messages...');

  const destinationPellet = pelletsArray[0];
  lastSelectedPoint = destinationPellet;
  console.error('GOAL', visiblePelletCount, destinationPellet);
  console.log(`MOVE ${firstPac.id} ${destinationPellet.x} ${destinationPellet.y}`)
}
