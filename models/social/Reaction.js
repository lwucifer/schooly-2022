class CreateReaction {
  constructor(emoji) {
    this.emoji = emoji;
  }
}

export function createReaction(...args) {
  return Object.freeze(new CreateReaction(...args));
}
