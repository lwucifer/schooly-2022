import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import * as APIs from "~/utils/endpoints";
import { get } from "lodash";
import { questionBankType } from "~/utils/common";
import { getLocalDateTime } from "~/utils/moment";
import BankExam from "~/services/bank/exam/BankExam";


/**
 * initial state
 */
const state = () => ({
  getListBankExam: {},
  getListBankExercise: {},
  getDetailBankExamEssay: {},
  getDetailBankExamChoise: {},
  getDetailBankExamMix: {},
  getObjBankExamEdit: {},
  bankExamDetailList: [],
  getListBankQuestion: {},
  getListQuestionToBank: {}
});

/**
 * initial getters
 */
const getters = {
  bankExamContent(state){
    return !state.getListBankExam ? [] : state.getListBankExam.content;
  },
  bankExamPagination(state){
    return !state.getListBankExam ? {} : state.getListBankExam.page;
  },
  bankExamDetailContent(state){
    return !state.bankExamDetailList ? [] : state.bankExamDetailList.content;
  },
  bankExamDetailPagination(state){
    return !state.bankExamDetailList ? {} : state.bankExamDetailList.page;
  }
};

const actions = {
  async [actionTypes.BANK_EXAM.LIST]({ commit }, payload) {
    try {
      return this.$axios.get(`${APIs.BANK_EXAM}`, { params: payload }).then((res) => res.data)
        .then((result) => {
          if (result.success) {
            // console.log("[BANK_EXAM.LIST] list", result);
            commit(mutationTypes.BANK_EXAM.SET_BANK_EXAM, result.data);
          }
          return result;
        });

    } catch (error) {
      console.log("[BANK_EXAM.LIST] list.error", error);
      return error;
    }
  },

  async [actionTypes.BANK_EXAM.LIST_BANK_QUESTION]({ commit }, params) {
    try {
      return await this.$axios({
        url: "/elearning/teaching/manage/question_banks",
        method: "GET",
        params,
      }).then((res) => res.data)
        .then((result) => {
          if (result.success) {
            commit(mutationTypes.BANK_EXAM.SET_BANK_QUESTION, result.data);
          }
          return result;
        });

    } catch (error) {
      console.log("[BANK_EXAM.LIST_BANK_QUESTION] list.error", error);
      return error;
    }
  },

  async [actionTypes.BANK_EXAM.LIST_QUESTION_TO_BANK]({ commit }, params) {
    try {
      return await this.$axios({
        url: `/elearning/teaching/manage/questions`,
        method: "GET",
        params
      }).then((res) => res.data)
        .then((result) => {
          if (result.success) {
            commit(mutationTypes.BANK_EXAM.SET_QUESTION_TO_BANK, result.data);
          }
          return result;
        });

    } catch (error) {
      console.log("[BANK_EXAM.LIST_QUESTION_TO_BANK] list.error", error);
      return error;
    }
  },

  async [actionTypes.BANK_EXAM.LIST_EXERCISE]({ commit }, payload) {
    try {
      return this.$axios.get(`${APIs.BANK_EXAM}`, { params: payload }).then((res) => res.data)
        .then((result) => {
          if (result.success) {
            commit(mutationTypes.BANK_EXAM.SET_BANK_EXERCISE, result.data);
          }
          return result;
        });

    } catch (error) {
      console.log("[BANK_EXAM.LIST] list.error", error);
      return error;
    }
  },

  async [actionTypes.BANK_EXAM.DETAIL_EXAM]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.BANK_QUESTION}`, { params: payload })
        .then((res) => res.data)
        .then((result) => {
          if (result.success) {
            // console.log("[BANK_EXAM.LIST] list", result);
            commit(mutationTypes.BANK_EXAM.SET_BANK_EXAM_DETAIL, result.data);
          }
          return result;
        });
    } catch (error) {
      console.log("[DETAIL_EXAM_ESSAY.LIST] list.error", error);
      return error;
    }
  },

  async [actionTypes.BANK_EXAM.DETAIL_EXAM_ESSAY]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.BANK_QUESTION}`, { params: payload })
        .then((res) => res.data)
        .then((result) => {
          if (result.success) {
            console.log("[DETAIL_EXAM_ESSAY.LIST] list", result);
            commit(mutationTypes.BANK_EXAM.SET_BANK_EXAM_ESSAY, result.data);
          }
          return result;
        });
    } catch (error) {
      console.log("[DETAIL_EXAM_ESSAY.LIST] list.error", error);
      return error;
    }
  },

  async [actionTypes.BANK_EXAM.DETAIL_EXAM_CHOISE]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.BANK_QUESTION}`, { params: payload })
        .then((res) => res.data)
        .then((result) => {
          if (result.success) {
            console.log("[DETAIL_EXAM_CHOISE.LIST] list", result);
            commit(mutationTypes.BANK_EXAM.SET_BANK_EXAM_CHOISE, result.data);
          }
          return result;
        });
    } catch (error) {
      console.log("[DETAIL_EXAM_CHOISE.LIST] list.error", error);
      return error;
    }
  },

  async [actionTypes.BANK_EXAM.DETAIL_EXAM_MIX]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.BANK_QUESTION}`, { params: payload })
        .then((res) => res.data)
        .then((result) => {
          if (result.success) {
            console.log("[DETAIL_EXAM_MIX.LIST] list", result);
            commit(mutationTypes.BANK_EXAM.SET_BANK_EXAM_MIX, result.data);
          }
          return result;
        });
    } catch (error) {
      console.log("[DETAIL_EXAM_MIX.LIST] list.error", error);
      return error;
    }
  },

  async [actionTypes.BANK_EXAM.DETAIL_EXAM_EDIT]({ commit }, id) {
    try {
      return this.$axios.get(`${APIs.BANK_EXAM_POST}/${id}`).then((res) => res.data)
        .then((result) => {
          if (result.success) {
            commit(mutationTypes.BANK_EXAM.SET_BANK_EXAM_EDIT, result.data);
          }
          return result;
        });

    } catch (error) {
      console.log("[BANK_EXAM.DETAIL_EXAM_EDIT] list.error", error);
      return error;
    }
  },

  async [actionTypes.BANK_EXAM.ADD_NEW]({ commit }, payload) {
    console.log("[BANK_EXAM.ADD_NEW]", payload);
    try {
      return this.$axios.post(`${APIs.BANK_EXAM_POST}`, payload).then((res) => res.data)
        .then((result) => {
          console.log("[BANK_EXAM.ADD_NEW]", result);
          return result;
        })
    } catch (error) {
      console.log("[BANK_EXAM.ADD_NEW] error", error);
      return error;
    }
  },

  async [actionTypes.BANK_EXAM.ADD]({ commit }, payload) {
    try {
      const result = await new BankExam(this.$axios)["postWithFormData"](
        payload
      );
      console.log("[BANK_EXAM.ADD]", result.data);
      return result;
    } catch (error) {
      console.log("[BANK_EXAM.ADD] error", error);
    }
  },

  async [actionTypes.BANK_EXAM.ADD_QUESTION_TO_BANK]({ commit }, payload) {
    try {
      return this.$axios.post(`${APIs.QUESTION_TO_BANK}`, payload).then((res) => res.data)
        .then((result) => {
          console.log("[BANK_EXAM.ADD_QUESTION_TO_BANK]", result);
          return result;
        })
    } catch (error) {
      console.log("[BANK_EXAM.ADD_QUESTION_TO_BANK] error", error);
      return error;
    }
  },

  async [actionTypes.BANK_EXAM.EDIT_EXAM_ESSAY]({ commit }, payload) {
    try {
      const result = await this.$axios.put(`${APIs.BANK_EXAM}`, payload);
      console.log("[EDIT_EXAM_ESSAY.EDIT]", result);
      return result;
    } catch (error) {
      console.log("[EDIT_EXAM_ESSAY.EDIT] error", error);
      return error;
    }
  },

  async [actionTypes.BANK_EXAM.EDIT_EXAM_CHOISE]({ commit }, payload) {
    try {
      const result = await this.$axios.put(`${APIs.BANK_EXAM}`, payload);
      console.log("[EDIT_EXAM_CHOISE.EDIT]", result);
      return result;
    } catch (error) {
      console.log("[EDIT_EXAM_CHOISE.EDIT] error", error);
      return error;
    }
  },

  async [actionTypes.BANK_EXAM.EDIT_EXAM_MIX]({ commit }, payload) {
    try {
      const result = await this.$axios.put(`${APIs.BANK_EXAM}`, payload);
      console.log("[EDIT_EXAM_MIX.EDIT]", result);
      return result;
    } catch (error) {
      console.log("[EDIT_EXAM_MIX.EDIT] error", error);
      return error;
    }
  },

  async [actionTypes.BANK_EXAM.EDIT_POIN_QUESTION_TO_EXAM]({ commit }, payload) {
    try {
      return this.$axios.post(`${APIs.POINT_QUESTION_EXAM}`, payload).then((res) => res.data)
        .then((result) => {
          console.log("[BANK_EXAM.EDIT_POIN_QUESTION_TO_EXAM]", result);
          return result;
        })
    } catch (error) {
      console.log("[BANK_EXAM.EDIT_POIN_QUESTION_TO_EXAM] error", error);
      return error;
    }
  },

  async [actionTypes.BANK_EXAM.DELETE]({ commit }, id) {
    try {
      const result = await this.$axios.delete(`${APIs.BANK_EXAM_POST}/${id}`);
      console.log("[BANK_EXAM.DELETE]", result);
      return result.data;
    } catch (error) {
      console.log("[BANK_EXAM.DELETE] error", error);
      return error;
    }
  },

  async [actionTypes.BANK_EXAM.DELETE_MULTILE]({ commit }, payload) {
    try {
      const result = await this.$axios({
        url: "/elearning/teaching/test",
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      });
      console.log("[BANK_EXAM.DELETE_MULTILE]", result);
      return result.data;
    } catch (error) {
      console.log("[BANK_EXAM.DELETE_MULTILE] error", error);
      return error;
    }
  },
  async [actionTypes.BANK_EXAM.QUESTION_SORT]({ commit }, payload) {
    try {
      return this.$axios.put(`${APIs.QUESTION_SORT}`, payload)
        .then(res => res.data)
        .then(result => {
          console.log("[QUESTION_SORT.EDIT]", result);
          return result;
        });
    } catch (error) {
      console.log("[QUESTION_SORT.EDIT] error", error);
      return error;
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.BANK_EXAM.SET_BANK_EXAM](state, _data) {
    // console.log("SET_BANK_EXAM", _data);
    state.getListBankExam = _data;
  },
  [mutationTypes.BANK_EXAM.SET_BANK_EXERCISE](state, _data) {
    state.getListBankExercise = _data;
  },
  [mutationTypes.BANK_EXAM.SET_BANK_EXAM_EDIT](state, _data) {
    state.getObjBankExamEdit = _data;
  },
  [mutationTypes.BANK_EXAM.SET_BANK_EXAM_ESSAY](state, _data) {
    console.log("SET_BANK_EXAM_ESSAY", _data);
    state.getDetailBankExamEssay = _data;
  },
  [mutationTypes.BANK_EXAM.SET_BANK_EXAM_CHOISE](state, _data) {
    console.log("SET_BANK_EXAM_CHOISE", _data);
    state.getDetailBankExamChoise = _data;
  },
  [mutationTypes.BANK_EXAM.SET_BANK_EXAM_MIX](state, _data) {
    console.log("SET_BANK_EXAM_MIX", _data);
    state.getDetailBankExamMix = _data;
  },
  [mutationTypes.BANK_EXAM.SET_BANK_EXAM_DETAIL](state, _data) {
    // console.log("SET_BANK_EXAM", _data);
    state.bankExamDetailList = _data;
  },
  [mutationTypes.BANK_EXAM.SET_BANK_QUESTION](state, _data) {
    state.getListBankQuestion = _data;
  },

  [mutationTypes.BANK_EXAM.SET_QUESTION_TO_BANK](state, _data) {
    state.getListQuestionToBank = _data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
