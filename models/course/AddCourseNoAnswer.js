import numeral from "numeral";
import { toNumber } from "lodash";

class AddCourse {
  constructor(payload) {
    if (payload.avatar) {
      this.avatar = payload.avatar;
    }

    if (payload.cover_image) {
      this.cover_image = payload.cover_image;
    }

    if (payload.benefit) {
      this.benefit = JSON.stringify(payload.benefit);
    }

    if (payload.description) {
      this.description = payload.description;
    }

    if (payload.level) {
      this.level = payload.level ? toNumber(payload.level) : "";
    }

    if (payload.name) {
      this.name = payload.name;
    }

    if (payload.subject) {
      this.subject = payload.subject;
    }

    if (payload.type) {
      this.type = payload.type;
    }

    if (payload.elearning_id) {
      this.elearning_id = payload.elearning_id;
    }
  }
}

export function createPayloadAddCourse(payload) {
  return Object.freeze(new AddCourse(payload));
}

class AddContentCourse {
  constructor(payload) {
    if (payload.elearning_id) {
      this.elearning_id = payload.elearning_id;
    }
    if (payload.chapter_id) {
      this.chapter_id = payload.chapter_id;
    }
    if (payload.lesson) {
      this.lesson = payload.lesson;
    }
    if (payload.repository_file_id) {
      this.repository_file_id = payload.repository_file_id;
    }
    if (payload.article_content) {
      this.article_content = payload.article_content;
    }
    if (payload.id) {
      this.id = payload.id;
    }
    this.name = payload.name;
    this.type = payload.type;
  }
}

export function createPayloadAddContentCourse(payload) {
  return Object.freeze(new AddContentCourse(payload));
}

class AddDocument {
  constructor(payload) {
    this.lesson_id = payload.lesson_id;
    if (payload.doc) {
      this.doc = payload.doc;
    }
    if (payload.url) {
      this.url = payload.url;
    }
    if (payload.format) {
      this.format = payload.format;
    }
    this.name = payload.name;
  }
}

export function createPayloadAddDocument(payload) {
  return Object.freeze(new AddDocument(payload));
}

class CourseSetting {
  constructor(payload, free) {
    if (payload.comment_allow !== "") {
      this.comment_allow = payload.comment_allow == 1 ? true : false;
    }

    if (free == 1) {
      this.price = numeral(payload.price).value();
      this.fee = numeral(payload.fee).value();
    }

    if (free == 2) {
      this.price = 0;
      this.fee = 0;
    }

    this.elearning_id = payload.elearning_id;
    this.privacy = payload.privacy;
  }
}

export function createPayloadCourseSetting(payload, free) {
  return Object.freeze(new CourseSetting(payload, free));
}

class Exercise {
  constructor(payload) {
    if (payload.id) {
      this.id = payload.id;
    }

    if (payload.lesson_id) {
      this.lesson_id = payload.lesson_id;
    }

    if (payload.elearning_id) {
      this.elearning_id = payload.elearning_id;
    }

    if (payload.required !== "") {
      this.required = payload.required ? true : false;
    }

    if (payload.required == 1) {
      if (payload.pass_score !== "") {
        this.pass_score = payload.pass_score;
      }
      if (payload.reworks !== "") {
        this.reworks = payload.reworks;
      }
      if (payload.duration !== "") {
        this.duration = payload.duration;
      }
    }

    if (payload.title) {
      this.title = payload.title;
    }

    if (payload.type) {
      this.type = payload.type;
    }

    if (payload.category) {
      this.category = payload.category;
    }

    if (payload.open_time) {
      this.open_time = payload.open_time;
    }
  }
}

export function createPayloadExercise(payload) {
  return Object.freeze(new Exercise(payload));
}

class Question {
  constructor(payload) {
    if (payload.exercise_id) {
      this.exercise_id = payload.exercise_id;
    }
    if (payload.points) {
      this.points = payload.points;
    }
    if (payload.exercise_id) {
      this.exercise_id = payload.exercise_id;
    }
    if (payload.id) {
      this.id = payload.id;
    }
    if (payload.type) {
      this.type = payload.type;
    }
    if (payload.content) {
      this.content = payload.content;
    }
    // let answers = [];
    // payload.answers.map(answer => {
    //   let item = {
    //     correct: answer.correct,
    //     content: answer.content
    //   };
    //   answers.push(item);
    // });
    // this.answers = answers;
  }
}

export function createPayloadQuestion(payload) {
  return Object.freeze(new Question(payload));
}
