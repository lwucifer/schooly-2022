import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Evaluation from "~/services/elearning/teaching/Evaluation";
import {
  QUESTION_CREATATION_METHODS,
  EXAM_TYPE_QUESTION
} from "~/utils/constants";
import { get } from "lodash";

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
    return get(question, 'select.content', '');
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

/**
 * initial state
 */
const state = () => ({
  currentExerciseQuestion: null,
  currentExerciseAnswers: [],
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_TEACHING_EVALUATION.ADD]({ commit }, payload) {
    try {
      const result = await new Evaluation(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      return result;
    } catch (error) {
      console.log("[Teaching evaluation] add.error", error);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_TEACHING_EVALUATION.SET_MARK_EXERCISE_QUESTION_CHOOSE](
    state,
    _data
  ) {
    let tmp = _data;
    const questionContent = getQuestionContent(_data);
    tmp.parsed_content = questionContent;
    state.currentExerciseQuestion = tmp;
  },
  [mutationTypes.ELEARNING_TEACHING_EVALUATION.SET_MARK_EXERCISE_QUESTION_ANSWERS_CHOOSE](
    state,
    _data
  ) {
    state.currentExerciseAnswers = _data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
