class CreateComment {
  constructor(text = '') {
    this.text = text;
  }
}

class EditComment {
  constructor(text = '') {
    this.text = text;
  }
}

export function createComment(...args) {
  return Object.freeze(new CreateComment(...args));
}

export function editComment(...args) {
  return Object.freeze(new EditComment(...args));
}
