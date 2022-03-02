class TestModel {
  constructor(props = {}) {
    this.props = props;
  }
}

export function createModel(props) {
  return Object.freeze(new TestModel(props));
}
