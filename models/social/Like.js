class Like {
  constructor(source_id, source_type, like_type) {
    this.source_id = source_id;
    this.source_type = source_type;
    this.like_type = like_type;
  }
}

export function createLike(source_id, source_type, like_type) {
  return Object.freeze(new Like(source_id, source_type, like_type));
}
