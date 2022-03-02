class AddRepository {
  constructor({
                name,
                file
              }) {
    this.name = name;
    this.file = file;
  }
}

export function createPayloadAddRepository(payload) {
  return Object.freeze(new AddRepository(payload));
}
