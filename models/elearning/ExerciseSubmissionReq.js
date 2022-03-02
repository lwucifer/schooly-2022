class ExerciseSubmissionReq {
  constructor(props = {}) {
    this.props = props;
  }
}

export function createExerciseSubmissionReq(props) {
  const form = new FormData();
  form.append('answers', JSON.stringify(props.answers));
  form.append('attachments', props.attachments);
  // form.append('duration', props.duration);
  form.append('exercise_id', props.exercise_id);
  // form.append('start_time', props.start_time);

  return form;
}
