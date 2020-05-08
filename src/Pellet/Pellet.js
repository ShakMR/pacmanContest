import { MapElement } from '../PacMap';

class Pellet extends MapElement {
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

export default Pellet;
