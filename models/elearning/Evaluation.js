class AddEvaluation {
  constructor({
                mark,
                note,
                to_passed,
                user_id,
                test_id
              }) {
    // this.exercise_id = exercise_id;
    this.mark = mark;
    this.note = note;
    this.to_passed = to_passed;
    this.user_id = user_id;
    this.test_id = test_id;
  }
}

export function createPayloadAddEvaluation(payload) {
  return Object.freeze(new AddEvaluation(payload));
}
