import Exercise from "~/services/elearning/study/Exercise";
import * as actionTypes from "~/utils/action-types";
import { RESPONSE_SUCCESS } from "~/utils/config";
import * as mutationTypes from "~/utils/mutation-types";
import * as APIs from "~/utils/endpoints";
import {
  QUESTION_NAV,
  EXERCISE_CATEGORIES,
  EXAM_TYPE_QUESTION,
} from "~/utils/constants";
import { getLocalEndTime } from "~/utils/moment";
import * as _ from "lodash";
/**
 * initial state
 */
const state = () => ({
  questions: [],
  result: {},
  submissions: {},
  submissionAdd: {},
  elearningExercises: [],
  paginatedElearningExericses: [],
  elearningExerciseTests: [],
  currentExercise: {},
  currentElearningId: null,
  currentExerciseQuestion: null,
  currentExerciseAnswers: [],
  submission: {
    test_id: null,
    answers: [],
  },
  currentQuestionId: null,
  autoSubmission: null,
  currentLession: null,
  changeQuestion: null,
});

/**
 * initial getters
 */
const getters = {
  numOfQuestion: (state) => {
    return state.questions ? state.questions.length : 0;
  },
  currentQuestionIndex: (state) => {
    return state.currentExerciseQuestion
      ? state.currentExerciseQuestion.index
      : 0;
  },
  questionNoOpts: (state) => {
    const questionNoOpts = !state.questions
      ? []
      : state.questions.map((item) => {
          return {
            value: item.id,
            text: item.index,
          };
        });
    console.log("[questionNoOpts]", questionNoOpts, state.questions);
    return questionNoOpts;
  },
  tests: (state) => {
    return state.elearningExerciseTests
      ? state.elearningExerciseTests.length > 0
      : false;
  },
  orderOfQuestion: (state) => {
    const total = state.questions ? state.questions.length : 0;
    const currentIndex = state.currentExerciseQuestion
      ? state.currentExerciseQuestion.index
      : 0;
    // console.log("[orderOfQuestion]", state.currentExerciseQuestion, state.questions);
    return `${currentIndex}/${total}`;
  },
};

const actions = {
  /**
   * Start call before get list exercise
   * https://api.schoolly.famtechvn.com/swagger-ui.html?urls.primaryName=core-service#/study-controller/startWorkingExerciseUsingPOST
   */
  async [actionTypes.ELEARNING_STUDY_EXERCISE.LIST_QUESTION_START](
    { commit },
    payload
  ) {
    try {
      const { data } = await this.$axios.post(
        APIs.STUDY_EXERCISE_START,
        payload
      );
      console.log("[LIST_QUESTION_START]", data);
      return data;
    } catch (error) {
      console.log("[LIST_QUESTION_START] error", error);
    }
  },

  /**
   * Get questions and answers for exercise
   * https://api.schoolly.famtechvn.com/swagger-ui.html?urls.primaryName=core-service#/study-controller/getQuestionsUsingGET
   */
  async [actionTypes.ELEARNING_STUDY_EXERCISE.LIST_QUESTION](
    { commit },
    payload
  ) {
    try {
      const result = await new Exercise(this.$axios)[
        actionTypes.ELEARNING_STUDY_EXERCISE.LIST_QUESTION
      ](payload);
      console.log("[LIST_QUESTION]", result, payload);
      if (result.success == RESPONSE_SUCCESS) {
        commit(
          mutationTypes.ELEARNING_STUDY_EXERCISE
            .SET_STUDY_EXERCISE_QUESTION_LIST,
          result.data.content
        );

        // turnof loadingExercise
        commit("event/setExerciseLoading", false, { root: true });
      }

      return result;
    } catch (error) {
      console.log(
        "[Elearning ELEARNING_STUDY_EXERCISE] LIST_QUESTION.error",
        error
      );
    }
  },

  /**
   * Get result of exercise
   * https://api.schoolly.famtechvn.com/swagger-ui.html?urls.primaryName=core-service#/study-controller/getResultExerciseUsingGET
   */
  async [actionTypes.ELEARNING_STUDY_EXERCISE.LIST_RESULT](
    { commit },
    payload
  ) {
    try {
      const result = await new Exercise(this.$axios)[
        actionTypes.ELEARNING_STUDY_EXERCISE.LIST_RESULT
      ](payload);
      console.log("[LIST_RESULT]", result);
      if (result.success == RESPONSE_SUCCESS) {
        commit(
          mutationTypes.ELEARNING_STUDY_EXERCISE.SET_STUDY_EXERCISE_RESULT_LIST,
          result.data
        );

        // turnof loadingExercise
        commit("event/setExerciseLoading", false, { root: true });
      }

      return result;
    } catch (error) {
      console.log(
        "[Elearning ELEARNING_STUDY_EXERCISE] LIST_RESULT.error",
        error
      );
    }
  },

  /**
   * Get student answers for exercise
   * https://api.schoolly.famtechvn.com/swagger-ui.html?urls.primaryName=core-service#/study-controller/getAnswersUsingGET
   */
  async [actionTypes.ELEARNING_STUDY_EXERCISE.LIST_SUBMISTION](
    { commit },
    payload
  ) {
    try {
      const result = await new Exercise(this.$axios)[actionTypes.BASE.LIST]({
        params: payload,
      });
      console.log("[LIST_SUBMISTION]", result, payload);
      if (result.success == RESPONSE_SUCCESS) {
        commit(
          mutationTypes.ELEARNING_STUDY_EXERCISE
            .SET_STUDY_EXERCISE_SUBMISSION_LIST,
          result.data
        );

        // turnof loadingExercise
        commit("event/setExerciseLoading", false, { root: true });
      }

      return result;
    } catch (error) {
      console.log(
        "[Elearning ELEARNING_STUDY_EXERCISE] LIST_SUBMISTION.error",
        error
      );
    }
  },

  /**
   * Submit answers for exercise
   * https://api.schoolly.famtechvn.com/swagger-ui.html?urls.primaryName=core-service#/study-controller/submitAnswersUsingPOST
   */
  async [actionTypes.ELEARNING_STUDY_EXERCISE.ADD_SUBMISTION](
    { commit },
    payload
  ) {
    try {
      const result = await new Exercise(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      console.log("[ADD_SUBMISTION]", result);
      if (result.success == RESPONSE_SUCCESS) {
        commit(
          mutationTypes.ELEARNING_STUDY_EXERCISE
            .SET_STUDY_EXERCISE_SUBMISSION_ADD,
          result.data
        );
        // turnof loadingExercise
        commit("event/setExerciseLoading", false, { root: true });

        return result;
      }

      return result;
    } catch (error) {
      console.log(
        "[Elearning ELEARNING_STUDY_EXERCISE] ADD_SUBMISTION.error",
        error
      );
    }
  },

  /**
   * to upload answer file
   * @param {*} question_id: string
   * @param {*} answer: file
   */
  async [actionTypes.ELEARNING_STUDY_EXERCISE.UPLOAD_FILE](
    { commit },
    payload
  ) {
    try {
      const { data } = await this.$axios.post(
        APIs.STUDY_EXERCISE_UPLOAD,
        payload
      );
      console.log("[UPLOAD_FILE]", data);
      return data;
    } catch (error) {
      console.log(
        "[Elearning ELEARNING_STUDY_EXERCISE] ADD_SUBMISTION.error",
        error
      );
    }
  },

  /**
   * Get exercise list of e-learning
   * https://api.schoolly.famtechvn.com/swagger-ui.html?urls.primaryName=core-service#/study-controller/getElearningExerciseUsingGET
   */
  async [actionTypes.ELEARNING_STUDY_EXERCISE.LIST_ELEARNING_EXERCISE](
    { commit },
    payload
  ) {
    try {
      const result = await new Exercise(this.$axios)[
        actionTypes.ELEARNING_STUDY_EXERCISE.LIST_ELEARNING_EXERCISE
      ](payload);
      console.log("[LIST_ELEARNING_EXERCISE]", result, payload);
      if (result.success == RESPONSE_SUCCESS) {
        if (payload.category == EXERCISE_CATEGORIES.TEST) {
          commit(
            mutationTypes.ELEARNING_STUDY_EXERCISE
              .SET_STUDY_ELEARNING_EXERCISE_TEST_LIST,
            result.data.content
          );
        }
        commit(
          mutationTypes.ELEARNING_STUDY_EXERCISE
            .SET_STUDY_ELEARNING_EXERCISE_LIST,
          result.data.content
        );

        commit(
          mutationTypes.ELEARNING_STUDY_EXERCISE
            .SET_STUDY_PAGINATED_ELEARNING_EXERCISE_LIST,
          result.data
        );

        // turnof loadingExercise
        commit("event/setExerciseLoading", false, { root: true });
      }

      return result;
    } catch (error) {
      console.log("[LIST_ELEARNING_EXERCISE] error", error);
    }
  },

  /**
   * Get exercise list of exercise_list
   */
  async [actionTypes.ELEARNING_STUDY_EXERCISE.LIST_ELEARNING_EXERCISE_2](
    { commit },
    payload
  ) {
    try {
      const result = await new Exercise(this.$axios)[
        actionTypes.ELEARNING_STUDY_EXERCISE.LIST_ELEARNING_EXERCISE_2
      ](payload);
      console.log("[LIST_ELEARNING_EXERCISE_2]", result, payload);
      if (result.success == RESPONSE_SUCCESS) {
        if (payload.category == EXERCISE_CATEGORIES.TEST) {
          commit(
            mutationTypes.ELEARNING_STUDY_EXERCISE
              .SET_STUDY_ELEARNING_EXERCISE_TEST_LIST,
            result.data.content
          );
        }
        commit(
          mutationTypes.ELEARNING_STUDY_EXERCISE
            .SET_STUDY_ELEARNING_EXERCISE_LIST,
          result.data.content
        );
        commit(
          mutationTypes.ELEARNING_STUDY_EXERCISE
            .SET_STUDY_PAGINATED_ELEARNING_EXERCISE_LIST,
          result.data
        );
      }

      return result;
    } catch (error) {
      console.log("[LIST_ELEARNING_EXERCISE] error", error);
    }
  },

  async [actionTypes.ELEARNING_STUDY_EXERCISE.SUBMIT_UPLOAD_ANSWER](
    { commit },
    payload
  ) {
    try {
      const { test_id = "", files = [] } = payload;
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const result = await this.$axios.$post(
        `elearning/study/submission/upload/${test_id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      commit(
        mutationTypes.ELEARNING_STUDY_EXERCISE
          .SET_STUDY_EXERCISE_SUBMISSION_ADD,
        result.data || {}
      );

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.ELEARNING_STUDY_EXERCISE.GET_DETAIL_EXERCISE](
    { commit },
    payload
  ) {
    try {
      const { test_id = "" } = payload;
      const result = await this.$axios.$get(
        `${APIs.STUDY_EXAM_TEST}/${test_id}`,
        payload
      );
      return result;
    } catch (error) {
      return error;
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_STUDY_EXERCISE.SET_STUDY_EXERCISE_QUESTION_LIST](
    state,
    _list
  ) {
    console.log("[SET_STUDY_EXERCISE_QUESTION_LIST] _list", _list);
    const ques = [..._list].map((q) => {
      const method = q.method || {};
      if (method == "SELECT" || method == "RANDOM") {
        q.manual = q.bank_question;
      }
      return q;
    });
    console.log("[SET_STUDY_EXERCISE_QUESTION_LIST] ques", ques);
    state.questions = ques;
    // state.questions = _list;
  },

  [mutationTypes.ELEARNING_STUDY_EXERCISE.SET_STUDY_EXERCISE_QUESTION_START](
    state,
    _data
  ) {
    // reset submission state
    state.submission = {
      ...state.submission,
      test_id: null,
      // start_time: _data.start_time, // set start_time from api /study/test/start response
      // duration: 0,
      answers: [],
      // attachments: []
    };

    // update currentExercise
    const end_time = getLocalEndTime(
      _data.start_time,
      _data.duration,
      "minutes"
    ); // end_time in local time already
    const updatedCurrentExercise = {
      id: _data.id,
      name: _data.name,
      duration: _data.duration,
      end_time: end_time,
    };
    const tmp = { ...state.currentExercise, ...updatedCurrentExercise };
    state.currentExercise = tmp;

    // reset answer
    state.currentExerciseAnswers = [];

    // set the first question
    state.currentExerciseQuestion =
      state.questions && state.questions.length > 0 ? state.questions[0] : null; // set current question is the first

    console.log(
      "[SET_STUDY_EXERCISE_QUESTION_START]",
      state.questions,
      state.currentExerciseQuestion,
      state.currentExercise
    );
  },

  [mutationTypes.ELEARNING_STUDY_EXERCISE.SET_STUDY_EXERCISE_RESULT_LIST](
    state,
    _list
  ) {
    state.result = _list;
  },

  [mutationTypes.ELEARNING_STUDY_EXERCISE.SET_STUDY_EXERCISE_SUBMISSION_LIST](
    state,
    _list
  ) {
    console.log("[SET_STUDY_EXERCISE_SUBMISSION_LIST]", _list);
    state.submissions = _list;
  },

  [mutationTypes.ELEARNING_STUDY_EXERCISE.SET_STUDY_EXERCISE_SUBMISSION_ADD](
    state,
    _submissionAdd
  ) {
    state.submissionAdd = _submissionAdd;
  },

  [mutationTypes.ELEARNING_STUDY_EXERCISE
    .SET_STUDY_ELEARNING_EXERCISE_TEST_LIST](state, _list) {
    state.elearningExerciseTests = _list;
  },

  [mutationTypes.ELEARNING_STUDY_EXERCISE.SET_STUDY_ELEARNING_EXERCISE_LIST](
    state,
    _list
  ) {
    state.elearningExercises = _list;
  },

  [mutationTypes.ELEARNING_STUDY_EXERCISE
    .SET_STUDY_PAGINATED_ELEARNING_EXERCISE_LIST](state, _list) {
    state.paginatedElearningExericses = _list;
  },

  [mutationTypes.ELEARNING_STUDY_EXERCISE.SET_STUDY_EXERCISE_CURRENT](
    state,
    _curr
  ) {
    console.log("[SET_STUDY_EXERCISE_CURRENT", _curr);
    // reset current question
    state.currentExerciseQuestion = null;

    state.currentExercise = _curr;
  },

  [mutationTypes.ELEARNING_STUDY_EXERCISE.SET_STUDY_EXERCISE_CURRENT_BY_NO](
    state,
    _questionId
  ) {
    const currQuestion = state.questions.find((item) => item.id == _questionId);
    if (currQuestion) {
      state.currentExerciseQuestion = currQuestion;
    }
  },

  [mutationTypes.ELEARNING_STUDY_EXERCISE.SET_STUDY_EXERCISE_QUESTION_NAV](
    state,
    _nav
  ) {
    // console.log("[SET_STUDY_EXERCISE_QUESTION_NAV]", _nav);
    const currQuestionIndex = state.questions.findIndex(
      (item) => item.index == state.currentExerciseQuestion.index
    );
    if (currQuestionIndex != -1) {
      if (_nav == QUESTION_NAV.NEXT) {
        state.currentExerciseQuestion = state.questions[currQuestionIndex + 1];
      } else if (_nav == QUESTION_NAV.BACK) {
        state.currentExerciseQuestion = state.questions[currQuestionIndex - 1];
      }

      state.changeQuestion = new Date().getTime();
    }
    console.log(
      "[SET_STUDY_EXERCISE_QUESTION_NAV]",
      state.currentExerciseQuestion,
      state.changeQuestion
    );
  },

  [mutationTypes.ELEARNING_STUDY_EXERCISE.SET_STUDY_EXERCISE_QUESTION_CHOOSE](
    state,
    _nav
  ) {
    const foundQuestionIndex = state.questions.findIndex(
      (item) => item.index == _nav
    );
    if (foundQuestionIndex != -1) {
      state.currentExerciseQuestion = state.questions[foundQuestionIndex];
      state.changeQuestion = new Date().getTime();
    }
    console.log(
      "[SET_STUDY_EXERCISE_QUESTION_CHOOSE]",
      _nav,
      // state.currentExerciseQuestion,
      state.changeQuestion
    );
  },

  [mutationTypes.ELEARNING_STUDY_EXERCISE.SET_STUDY_EXERCISE_SUBMISSION](
    state,
    _submission
  ) {
    console.log("[SET_STUDY_EXERCISE_SUBMISSION]", _submission);
    const updatedAnswer = _submission.answers;
    const updatedExerciseId = _submission.test_id;

    // debugger;
    // update exercise_id
    if (!!updatedExerciseId) {
      state.submission = {
        ...state.submission,
        test_id: updatedExerciseId,
      };
    }

    // update answer
    if (!!updatedAnswer) {
      let currAnsers = [...state.submission.answers];
      let question_id = null;
      let questionType = null;

      let submissions = updatedAnswer.map((item) => {
        question_id = item.question_id;
        questionType = item.type;
        return {
          answer: item.answer,
          selected_answer_id: item.selected_answer_id,
          position: item.position,
          matching_answer_id: item.matching_answer_id,
          nameFiles: item.nameFiles,
        };
      });
      const currAnswerIndex = currAnsers.findIndex(
        (item) => item.question_id == question_id
      );
      if (currAnswerIndex == -1) {
        const newAnswer = {
          question_id: question_id,
          submissions: submissions,
        };
        currAnsers = [...currAnsers, newAnswer];
      } else if (
        questionType == EXAM_TYPE_QUESTION.FILL_IN_BLANK ||
        questionType == EXAM_TYPE_QUESTION.WORD_CHOICE
      ) {
        // const updatedSubmission = [...currAnsers[currAnswerIndex].submissions, ...submissions];
        const updatedSubmission = _.map(
          _.assign(
            _.mapKeys(
              currAnsers[currAnswerIndex].submissions,
              (v) => v.position
            ),
            _.mapKeys(submissions, (v) => v.position)
          )
        );
        // console.log("[updatedSubmission]", updatedSubmission);

        const newUpdatedAnswer1 = {
          ...currAnsers[currAnswerIndex],
          submissions: updatedSubmission,
        };
        currAnsers[currAnswerIndex] = newUpdatedAnswer1;
      } else {
        const newUpdatedAnswer = {
          ...currAnsers[currAnswerIndex],
          submissions,
        };
        currAnsers[currAnswerIndex] = newUpdatedAnswer;
      }
      state.submission = { ...state.submission, answers: currAnsers };
      state.currentExerciseAnswers = [...state.submission.answers];
    }

    console.log(
      "[SET_STUDY_EXERCISE_SUBMISSION] state.submission",
      state.submission
    );
  },

  [mutationTypes.ELEARNING_STUDY_EXERCISE.SET_STUDY_ELEARNING_CURRENT_ID](
    state,
    _curr
  ) {
    state.currentElearningId = _curr;
  },

  [mutationTypes.ELEARNING_STUDY_EXERCISE.SET_STUDY_EXERCISE_QUESTION_CURRENT](
    state,
    _currQuestionId
  ) {
    state.currentQuestionId = _currQuestionId;
  },

  [mutationTypes.ELEARNING_STUDY_EXERCISE.SET_STUDY_EXERCISE_AUTO_SUBMISSION](
    state,
    _auto
  ) {
    console.log("[SET_STUDY_EXERCISE_AUTO_SUBMISSION]", _auto);
    state.autoSubmission = _auto;
  },

  [mutationTypes.ELEARNING_STUDY_EXERCISE.SET_STUDY_EXERCISE_CHANGE_QUESTION](
    state,
    _data
  ) {
    console.log("[setStudyExerciseChangeQuestion]", _data);
    state.changeQuestion = _data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
