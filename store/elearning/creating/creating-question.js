import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import { Question, QuestionOfBank } from "~/services/elearning/creating/Question";
import { get } from "lodash";
import * as APIs from "~/utils/endpoints";
import {
  QUESTION_CREATATION_METHODS,
  EXAM_TYPE_QUESTION
} from "~/utils/constants";
import { converNumberDecs2 } from "~/utils/common";

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
  questions: [],
  questionsOfBank: {},
});

/**
 * initial getters
 */
const getters = {
  choiceQuestionsOfBank: (state, getters, rootState, rootGetters) => {
    const questions = get(state, 'questionsOfBank.content', []);
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
  essayQuestionsOfBank: (state) => {
    const questions = get(state, 'questionsOfBank.content', []);
    let lastIndex = 0;
    let neededRecords = questions.filter(item => {
      if (get(item, 'category', '') == 'ESSAY') {
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
      return get(item, 'category', '') == 'ESSAY'
    });
    return neededRecords;
  },
  choiceQuestionsPointTotal: (state) => {
    const questions = get(state, 'questionsOfBank.content', []);
    let neededRecords = questions.filter(item => {
      return get(item, 'category', '') == 'CHOICE'
    });
    const total = neededRecords.reduce((sum, item) => sum + get(item, 'points', 0), 0);
    return total;
  },
  essayQuestionsPointTotal: (state) => {
    const questions = get(state, 'questionsOfBank.content', []);
    let neededRecords = questions.filter(item => {
      return get(item, 'category', '') == 'ESSAY'
    });
    const total = neededRecords.reduce((sum, item) => sum + get(item, 'points_total', 0), 0);
    return total;
  },
  allPointTotal: (state) => {
    const questions = get(state, 'questionsOfBank.content', []);
    const total = questions.reduce((sum, item) => sum + get(item, 'points_total', 0), 0);
    return total;
  },
  choiceQuestionCounter: (state, getters) => {
    let counter = 0;
    const questionList = getters.choiceQuestionsOfBank;
    const size = questionList.length;
    for (let i = 0; i < size; i++) {
      const item = questionList[i];
      if(hasRange(item)) {
        let rangeSize = get(item, 'random.random', 0);
        counter += rangeSize;
      } else {
        counter += 1;
      }
    }
    return counter;
  },
  pointOfEachChoiceQuestion: (state, getters, rootState, rootGetters) => {
    const choicePointTotal = get(rootGetters['elearning/creating/creating-excercises/exerciseDetail'], 'choice_point', 0);
    let point = converNumberDecs2(choicePointTotal/(getters.choiceQuestionCounter));
    return point;
  }
};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_CREATING_QUESTIONS.LIST]({ commit }, payload) {
    try {
      const result = await new Question(this.$axios)[actionTypes.BASE.LIST](
        payload
      );
      // set to mutation
      commit(
        mutationTypes.ELEARNING_CREATING_QUESTIONS
          .SET_ELEARNING_CREATING_QUESTIONS_LIST,
        result
      );
    } catch (error) {
      console.log("[Creating Question] list.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_QUESTIONS.ADD]({ commit }, payload) {
    try {
      const result = await new Question(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      return result;
    } catch (error) {
      console.log("[Creating Question] add.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_QUESTIONS.EDIT]({ commit }, payload) {
    try {
      const result = await new Question(this.$axios)[
        actionTypes.BASE.EDIT_PAYLOAD
      ](payload);
      return result;
    } catch (error) {
      console.log("[Creating Question] edit.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_QUESTIONS.DELETE]({ commit }, payload) {
    try {
      const result = await new Question(this.$axios)[
        actionTypes.BASE.DELETE_PAYLOAD
      ](payload);
      return result;
    } catch (error) {
      console.log("[Creating Question] delete.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_QUESTIONS_OF_BANK.LIST]({ commit }, payload) {
    try {
      const result = await new QuestionOfBank(this.$axios)[
        actionTypes.BASE.LIST
      ]({ params: payload });
      commit(
        mutationTypes.ELEARNING_CREATING_QUESTIONS_OF_BANK
          .SET_ELEARNING_CREATING_QUESTIONS_OF_BANK_LIST,
        result.data
      );
      return result.data;
    } catch (error) {
      console.log("[List Question] list.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_QUESTIONS_OF_BANK.SORT]({ commit }, payload) {
    try {
      const result = await this.$axios.put(`${APIs.QUESTION_SORT}`, payload);
      return result.data;
    } catch (error) {
      console.log("[Sort Questions] sort.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_QUESTIONS_OF_BANK.UPDATE_SCORE]({ commit }, payload) {
    try {
      const result = await this.$axios.post(`${APIs.POINT_QUESTION_EXAM}`, payload);
      return result.data;
    } catch (error) {
      console.log("[QUESTION UPDATE SCORE] error", error);
      return error;
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_CREATING_QUESTIONS
    .SET_ELEARNING_CREATING_QUESTIONS_LIST](state, questions) {
    console.log("SET_ELEARNING_CREATING_QUESTIONS_LIST", questions);
    state.questions = questions;
  },
  [mutationTypes.ELEARNING_CREATING_QUESTIONS_OF_BANK
    .SET_ELEARNING_CREATING_QUESTIONS_OF_BANK_LIST](state, data) {
    console.log("SET_ELEARNING_CREATING_QUESTIONS_OF_BANK_LIST", data);
    state.questionsOfBank = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
