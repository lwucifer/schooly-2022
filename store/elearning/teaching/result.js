import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import * as API from "~/utils/endpoints";
import Result from "~/services/elearning/teaching/Result";
import { get } from "lodash";
import * as APIs from '~/utils/endpoints';


import {
  QUESTION_CREATATION_METHODS,
  EXAM_TYPE_QUESTION
} from "~/utils/constants";

function isRandomItem(item) {
  return [
    QUESTION_CREATATION_METHODS['RANDOM']
  ].includes(get(item, 'method', ''));
}

function hasRange(item) {
  return isRandomItem(item);
}

function isQuestionFromManual(question) {
  return [
    QUESTION_CREATATION_METHODS['MANUAL'],
    QUESTION_CREATATION_METHODS['UPLOAD'],
    QUESTION_CREATATION_METHODS['IMPORT'],				
  ].includes(get(question, 'method', ''));
}

function isQuestionFromBank(question) {
  return [
    QUESTION_CREATATION_METHODS['SELECT'],
    QUESTION_CREATATION_METHODS['IPTEST'],
  ].includes(get(question, 'method', ''));
}

function isQuestionRandom(question) {
  return [
    QUESTION_CREATATION_METHODS['RANDOM']
  ].includes(get(question, 'method', ''));
}

function getQuestionContent(question) {
  if (isQuestionFromManual(question)) {
    let currentCnt = get(question, 'manual.content', '');
    let tmp = '';
    if (get(question, 'method', '') == QUESTION_CREATATION_METHODS['UPLOAD']) {
      if (!get(question, 'is_updated', false)) {
        tmp = currentCnt.replace('{}', get(question, 'range', ''));
        return tmp;
      }
    }
    if (get(question, 'type', '') == EXAM_TYPE_QUESTION['WORD_CHOICE']) {
      const reg = /\[.*?\]/gi;
      const blank = '......';
      tmp = currentCnt.replace(reg, blank);
      return tmp;
    }
    return get(question, 'manual.content', '');
  }
  if (isQuestionFromBank(question)) {
    return get(question, 'bank_question.content', '');
  }
  if (isQuestionRandom(question)) {
    const tmp = "Câu hỏi ngẫu nhiên" +
      "<p class='body-3 text-gray-3'>" +
      "( " +
      `${get(question, 'random.random', 0)}/${get(question, 'random.question', 0)}` + 
      " từ ngân hàng cậu hỏi " +
      `${get(question, 'random.question_bank_name', '')}` +
      ")" +
      "</p>";
    return tmp;
  }
  return '';
}

function getQuestionLevel(question) {
  if (isQuestionFromManual(question)) {
    return get(question, 'manual.level', '');
  }
  if (isQuestionFromBank(question)) {
    return get(question, 'select.level', '');
  }
  if (isQuestionRandom(question)) {
    return get(question, 'random.level', '');
  }
  return '';
}

/**
 * initial state
 */
const state = () => ({
  currentResult: {},
  questionsOfSubmission: {}
});

/**
 * initial getters
 */
const getters = {
  choiceQuestionsOfSubmission: (state) => {
    const questions = get(state, 'questionsOfSubmission.content', []);
    let lastIndex = 0;
    let neededRecords = questions.filter((item) => {
      if (get(item, 'category', '') == 'CHOICE') {
        let from = '', to = '', range = '';
        let points_total = 0;
        let point_for_each = get(item, 'points', 0);

        if(hasRange(item)) {
          let rangeSize = get(item, 'random.random', 0);
          if (rangeSize > 1) {
            from = lastIndex + 1;
            to = from + rangeSize - 1;
            range = `${from} - ${to}`;
          } else {
            to = lastIndex + rangeSize;
            range = to;
          }
          points_total = point_for_each * rangeSize;
        } else {
          to = lastIndex + 1; // from # to
          range = to;
          points_total = point_for_each;
        }
        lastIndex = to;
        item.range = range;
        item.points_total = points_total;
        item.parsed_content = getQuestionContent(item);
        item.level = getQuestionLevel(item);
      }
      return get(item, 'category', '') == 'CHOICE'
    });
    lastIndex = 0;
    return neededRecords;
  },
  essayQuestionsOfSubmission: (state) => {
    const questions = get(state, 'questionsOfSubmission.content', []);
    let lastIndex = 0;
    let neededRecords = questions.filter(item => {
      if (get(item, 'category', '') == 'ESSAY') {
        let from = '', to = '', range = '';
        let points_total = 0;
        let point_for_each = get(item, 'points', 0);

        if(hasRange(item)) {
          console.log('essay: has range')
          let rangeSize = get(item, 'random.random', 0);

          if (rangeSize > 1) {
            from = lastIndex + 1;
            to = from + rangeSize - 1;
            range = `${from} - ${to}`; 
          } else {
            to = lastIndex + rangeSize;
            range = to;
          }
          points_total = point_for_each * rangeSize;
        } else {
          to = lastIndex + 1; // from # to
          range = to;
          points_total = point_for_each;
        }
        lastIndex = to;
        item.range = range;
        item.points_total = points_total;
        item.parsed_content = getQuestionContent(item);
        item.level = getQuestionLevel(item);
      }
      return get(item, 'category', '') == 'ESSAY'
    });
    return neededRecords;
  },
  choiceSubmissionQuestionsPointTotal: (state) => {
    const questions = get(state, 'questionsOfSubmission.content', []);
    let neededRecords = questions.filter(item => {
      return get(item, 'category', '') == 'CHOICE'
    });
    const total = neededRecords.reduce((sum, item) => sum + get(item, 'points', 0), 0);
    return total;
  },
  essaySubmissionQuestionsPointTotal: (state) => {
    const questions = get(state, 'questionsOfSubmission.content', []);
    let neededRecords = questions.filter(item => {
      return get(item, 'category', '') == 'ESSAY'
    });
    const total = neededRecords.reduce((sum, item) => sum + get(item, 'points_total', 0), 0);
    return total;
  },
  allPointTotal: (state) => {
    const questions = get(state, 'questionsOfSubmission.content', []);
    const total = questions.reduce((sum, item) => sum + get(item, 'points_total', 0), 0);
    return total;
  }
};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_TEACHING_RESULT.DETAIL]({ commit }, payload) {
    try {
      const result = await new Result(this.$axios)[actionTypes.BASE.DETAIL](
        payload
      );
      // set to mutation
      commit(mutationTypes.ELEARNING_TEACHING_RESULT.SET_TEACHING_RESULT_DETAIL, result.data);
    } catch (error) {
      console.log("[Teaching results] list.error", error);
    }
  },
  async [actionTypes.ELEARNING_TEACHING_RESULT.SUBMISSION_QUESTION]({ commit }, payload) {
    try {
      const { data } = await this.$axios({
        url: API.ELEARNING_TEACHING_SUBMISSION_QUESTIONS,
        method: "GET",
        params: payload
      });
      // set to mutation
      commit(mutationTypes.ELEARNING_TEACHING_RESULT.SET_TEACHING_SUBMISSION_QUESTIONS, data.data);
    } catch (error) {
      console.log("[Teaching results] list.error", error);
    }
  },
  async [actionTypes.ELEARNING_TEACHING_RESULT.PUBLISH]({ commit }, payload) {
    try {
      const {data} = await this.$axios.post(APIs.ELEARNING_TEACHING_PUBLISH, payload);
      console.log("[ELEARNING_TEACHING_RESULT.PUBLISH] data", data);
      return data;
      // set to mutation
    } catch (error) {
      console.log("[ELEARNING_TEACHING_RESULT] PUBLISH.error", error);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_TEACHING_RESULT.SET_TEACHING_RESULT_DETAIL](state, data) {
    console.log("SET_ELEARNING_TEACHING_RESULT_DETAIL", data);
    state.currentResult = data;
  },
  [mutationTypes.ELEARNING_TEACHING_RESULT.SET_TEACHING_SUBMISSION_QUESTIONS](state, data) {
    console.log("SET_ELEARNING_TEACHING_SUBMISSION_QUESTIONS", data);
    state.questionsOfSubmission = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
