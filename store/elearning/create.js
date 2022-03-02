import * as Service from "~/services/elearning/Create";
import { get } from "lodash";
import { allOptionSelect } from "~/utils/common";


/**
 * initial state
 */
const state = () => ({
  lesson: null, // màn hình tạo bài tập của bài giảng, 1 lesson bao gồm toàn bộ thông tin bài tập, câu hỏi, câu trả lời
  progress: null, // dữ liệu ở màn hình aside, check tiến độ tạo khoá học
  general: null, // màn hình thông tin chung
  lessons_lecture: [], // màn hình tạo nội dung bài giảng
  chapters: [], // màn hình tạo nội dung khoá học
  setting: null, // màn hình setting
  lessons: [], // màn hình tạo bài tập của khoá học
  exams: null, // ds bài kiểm tra
  grades: [],
  subjects: [],
  exercise: null, //man hinh chi tiet bai tap,
  exercises: [], //danh sach bai tap thuoc 1 course/lecture
  exam: null, //man hinh chi tiet bai kiem tra
  elearningDetail: {}
});

/**
 * initial getters
 */
const getters = {
  disabled_all(state) {
    if (get(state, "progress.elearning_status", "") === "APPROVED") {
      return true;
    }
    return false;
  },

  gradesOpt(state) {
    const tmp = state.grades
      ? state.grades.map(g => {
        return {
          value: g.id,
          text: g.name,
        };
      })
      : [];

    // return tmp;
    return allOptionSelect(tmp, "khối lớp học");
  },
  subjectsOpt(state) {
    const tmp = state.subjects
      ? state.subjects.map(g => {
        return {
          value: g.id,
          text: g.name,
        };
      })
      : [];

    return tmp;
    // return allOptionSelect(tmp, "");
  },
  gradesOptNoAll(state) {
    const tmp = state.grades
      ? state.grades.map(g => {
        return {
          value: g.id,
          text: g.name,
        };
      })
      : [];

    return tmp;
    // return allOptionSelect(tmp, "khối lớp học");
  },
};

/**
 * initial actions
 */
const actions = {
  resetSubjects({ commit }) {
    commit("subjects", []);
  },

  async getGrades({ commit }, params) {
    try {
      const res = await this.$axios({
        url: `/elearning/school/common/grades`,
        method: "get",
        params,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (get(res, "data.success", false)) {
        let data = get(res, "data.data", []);
        data.map((item) => {
          item.text = item.name;
          item.value = item.id;
        });
        commit("grades", data);
        return;
      }
      commit("grades", []);
    } catch (error) {
      commit("grades", []);
    }
  },

  async getSubjects({ commit }, params) {
    try {
      const res = await this.$axios({
        url: `/elearning/school/common/apply_subs`,
        method: "get",
        params,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (get(res, "data.success", false)) {
        let data = get(res, "data.data", []);
        data.map((item) => {
          item.text = item.name;
          item.value = item.id;
        });
        commit("subjects", data);
        return;
      }
      commit("subjects", []);
    } catch (error) {
      commit("subjects", []);
    }
  },

  async getExams({ commit, state }, options = {}) {
    if (get(state, "general", null)) {
      const payload = {
        params: {
          elearning_id: get(state, "general.id", ""),
          category: "TEST",
        },
      };
      const res = await Service.getExams(this.$axios, payload);
      commit("exams", res);
    } else {
      commit("exams", null);
    }
  },

  async getLessons({ commit, state }, options = {}) {
    if (get(state, "general", null)) {
      const payload = {
        params: {
          elearning_id: get(state, "general.id", ""),
        },
      };
      const res = await Service.getLessons(this.$axios, payload);

      commit("lessons", res);
    } else {
      commit("lessons", null);
    }
  },

  async getSetting({ commit, state }, options = {}) {
    if (get(state, "general", null)) {
      const payload = {
        params: {
          elearning_id: get(state, "general.id", ""),
        },
      };
      const res = await Service.getSetting(this.$axios, payload);
      commit("setting", res);
    } else {
      commit("setting", null);
    }
  },

  async getContent({ commit, state }, options = {}) {
    if (get(state, "general.type", "") === "LECTURE") {
      const payload = {
        params: {
          elearning_id: get(state, "general.id", ""),
        },
      };
      const res = await Service.getLessonsOfLecture(this.$axios, payload);
      commit("lessons_lecture", res);
    } else {
      commit("lessons_lecture", null);
    }

    if (get(state, "general.type", "") === "COURSE") {
      const payload = {
        params: {
          elearning_id: get(state, "general.id", ""),
        },
      };
      const res = await Service.getChaptersOfElearning(this.$axios, payload);
      commit("chapters", res);
    } else {
      commit("chapters", null);
    }
  },

  async getGeneral({ commit, state }, options) {
    const res = await Service.getGeneral(this.$axios, options);
    commit("general", res);
  },

  async getLesson({ commit, state }, lesson_id) {
    if (lesson_id) {
      const res = await Service.getLesson(this.$axios, lesson_id);
      commit("lesson", res);
      return;
    }
    commit("lesson", null);
  },

  async getProgress({ commit, state }, options = {}) {
    if (get(state, "general", null)) {
      const payload = {
        params: {
          elearning_id: get(state, "general.id", ""),
        },
      };
      const res = await Service.getProgress(this.$axios, payload);
      commit("progress", res);
      return;
    }
    commit("progress", null);
  },

  async getExercises({ commit, state }, payload = {}) {
    const res = await Service.getExercises(this.$axios, { params: payload });
    commit("exercises", res);
  },

  reset({ commit }) {
    commit("reset");
  },

  async getElearningDetail({ commit, state }, params) {
    try {
      const res = await this.$axios({
        url: "/elearning/teaching/elearning",
        method: "GET",
        params,
      });
      if (get(res, "data.success", false)) {
        let data = get(res, "data.data", {});
        commit("setElearningDetail", data);
        return;
      }
      commit("setElearningDetail", {});
    } catch (error) {
      console.log(error);
      commit("setElearningDetail", {});
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  grades(state, data) {
    state.grades = data;
  },

  subjects(state, data) {
    state.subjects = data;
  },

  lessons(state, data) {
    state.lessons = data;
  },

  exams(state, data) {
    state.exams = data;
  },

  setting(state, data) {
    state.setting = data;
  },

  chapters(state, data) {
    state.chapters = data;
  },

  lessons_lecture(state, data) {
    state.lessons_lecture = data;
  },

  general(state, data) {
    state.general = data;
  },

  lesson(state, data) {
    state.lesson = data;
  },

  progress(state, data) {
    state.progress = data;
  },

  reset() {
    state.lesson = null;
    state.progress = null;
    state.general = null;
    state.chapters = [];
    state.setting = null;
    state.lessons = [];
    state.exams = [];
  },

  exercise(state, data) {
    state.exercise = data;
  },

  exam(state, data) {
    state.exam = data;
  },

  exercises(state, data) {
    state.exercises = data;
  },
  setElearningDetail(state, data) {
    state.elearningDetail = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
