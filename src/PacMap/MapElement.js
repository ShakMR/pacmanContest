class MapElement {
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
   * @param elem {MapElement || Coordinate}
   */
  samePosition(elem) {
    return elem.x === this.x && elem.y === this.y;
  }
}

export default MapElement;
