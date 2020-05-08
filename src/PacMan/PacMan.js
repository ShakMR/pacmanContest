import { MapElement } from '../PacMap';
import Objective from './Objective';

class PacMan extends MapElement {
  constructor(id, x, y, owner) {
    super(x, y);
    this.id = id;
    this.owner = owner;
    /**
     * @type {Objective}
     */
    this.objective = Objective.fromDefault();
  }

  /**
   *
   * @param {Objective} pellet
   */
  setObjective(pellet) {
    this.objective = pellet;
  }

  getObjectiveValue() {
    return this.objective ? this.objective.value : null;
  }

  getObjectivePos() {
    return this.objective ? this.objective.getPosition() : null;
  }

  isMine() {
    return this.owner !== '0';
  }
}

export default PacMan;
