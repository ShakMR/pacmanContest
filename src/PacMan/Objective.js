class Objective {
  constructor(pellet, heuristicValue) {
    this.pellet = pellet;
    this.value = heuristicValue;
  }

  static fromDefault() {
    return {
      pellet: null,
      value: Number.MAX_VALUE
    };
  }

  static cmp(asc = true) {
    return (a, b) => {
      if (asc) {
        return a.value - b.value;
      }
      return b.value - a.value;
    }
  }
}

export default Objective;
