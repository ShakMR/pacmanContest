import { debug } from '../Utils';
import PacMan from '../PacMan';
import Pellet from '../Pellet';

export const CELL_TYPES = {
  WALL: '#',
  EMPTY: ' ',
}

class PacMap {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.map = [];
  }

  print() {
    this.map.forEach((r, i) => {
      debug(i % 10, ' ', r.map((c, j) => {
        if (c === CELL_TYPES.EMPTY) return CELL_TYPES.EMPTY;
        if (c === CELL_TYPES.WALL) return CELL_TYPES.WALL;
        if (this.isOtherPlayer(i, j)) return 'P';
        if (this.isPellet(i, j)) return '*';
        return '.';
      }).join(''));
    });
  }

  addRow(i, row) {
    debug(i, row);
    this.map.push(row.split(''));
  }

  setElement(i, j, element) {
    this.map[j][i] = element;
  }

  setPellet(i, j, pellet) {
    this.map[j][i] = pellet;
  }

  setPlayer(i, j, pac) {
    this.map[j][i] = pac;
  }

  isOtherPlayer(i, j) {
    const val = this.map[j][i];
    return val instanceof PacMan;
  }

  removePellet(i, j) {
    if (this.isPellet(i, j)) {
      this.map[j][i] = ' ';
    }
  }

  isWall(i, j) {
    return this.map[j][i] === CELL_TYPES.WALL;
  }

  isPellet(i, j) {
    const val = this.map[j][i];
    return val instanceof Pellet;
  }

  /**
   *
   * @param i
   * @param j
   * @returns {PacMan | Pellet | string}
   */
  getValue(i, j) {
    return this.map[j][i];
  }

  isInLimits(i, j) {
    return i < this.width && i >= 0 && j >= 0 && this.height && this.map[j][i] !== CELL_TYPES.WALL;
  }

  /**
   *
   * @param i {number}
   * @param j {number}
   * @returns {Coordinate[]}
   */
  getAdjacentListOf(i, j) {
    let adjacent = [
      [i + 1, j],
      [i - 1, j],
      [i, j + 1],
      [i, j - 1],
    ];
    return adjacent.filter(([x, y]) => this.isInLimits(x, y)).map(([x, y]) => ({ x, y }));
  }
}

export default PacMap;
