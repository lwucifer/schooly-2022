<template>
  <div>
    <app-table
      :heads="heads"
      :needPagination="false"
      :data="list"
      class="mb-4"
      :ext-table-cls="{ 'table--nowrap-header': true }"
      :cols="[8,50,14,12,16]"
    >
      <template v-slot:cell(order)="{row}">
        <td>
          <p class="text-center nowrap w-100">
            {{ get(row, 'range', 'N/A') }}
          </p>
        </td>
      </template>
      <template v-slot:cell(title)="{row}">
        <td class="">
          <div class="">
            <v-popover
              class=""
              trigger="hover"
              placement="top"
              popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content bg-white"
              :disabled="isQuestionRandom(row)"
              :autoHide="false"
            >
              <div class="collapsed-content">
                <p v-html="get(row, 'parsed_content', '')"></p>
              </div>
              <template slot="popover" class="tooltip-detail">
                <div class="tooltip-limited-content">
                  <p v-html="get(row, 'parsed_content', '')"></p>
                </div>
              </template>
            </v-popover>
          </div>
        </td>
      </template>

      <template v-slot:cell(type)="{row}">
        <td>
          <span class="nowrap">
            {{ get(row, 'type', '') | exType2TxtTypeQues }}
          </span>
        </td>
      </template>

      <!-- <template v-slot:cell(level)="{row}">
        <td>
          <span class="nowrap">
            {{ get(row, 'level', 0) | exType2TxtLevel }}
          </span>
        </td>
      </template> -->

      <template v-slot:cell(score)="{row}">
        <td class="text-center">
          <p class="w-100">
            {{ getSubmissionScore(row) }}
          </p>
        </td>
      </template>

      <template v-slot:cell(action)="{row}">
        <td>
          <p class="text-center w-100">
            <button
              @click="showResult(row)" class="d-inline-block text-info"
            >
              Xem
            </button>
          </p>
        </td>
      </template>
    </app-table>

    <submission-modal
      v-if="showSubmissionModal"
      :loading="isLoadingSubmissionDetail"
      @close="closeSubmissionModal"
    >
    </submission-modal>
  </div>
</template>
<script>
import SubmissionModal from "~/components/page/elearning/manager/exam/SubmissionModal";
import { mapMutations, mapActions } from "vuex";

import { get } from "lodash";
import {
  EXAM_TYPE_QUESTION,
  EXERCISE_TYPES,
  PAGE_SIZE,
  QUESTION_CREATATION_METHODS,
  SUBMISSION_METHODS
} from "~/utils/constants";

const QUESTION_STORE = `elearning/manager/bank/question/questions`;

export default {
  components: {
    SubmissionModal
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    answers: {
      type: Object | Array
    }
  },
  data() {
    return {
      QUESTION_CREATATION_METHODS: Object.freeze(QUESTION_CREATATION_METHODS),
      QUESTION_STORE: Object.freeze(QUESTION_STORE),
      showSubmissionModal: false,
      isLoadingSubmissionDetail: false,
      currentSubmission: {},
      currentQuestion: {},
      heads: [
        {
          name: "order",
          text: "STT",
          classTextCenter: true
        },
        {
          name: "title",
          text: "Nội dung",
        },
        {
          name: "type",
          text: "Thể loại",
        },
        // {
        //   name: "level",
        //   text: "Cấp độ",
        // },
        {
          name: "score",
          text: "Điểm",
          classTextCenter: true
        },
        {
          name: "action",
          text: "Xem bài làm",
          textRight: true
        },
      ],
    }
  },
  computed: {
    answerCounter() {
      return this.answers.length;
    }
  },
  methods: {
    ...mapMutations("elearning/teaching/evaluation", [
      "setMarkExerciseQuestionChoose",
      "setMarkExerciseQuestionAnswersChoose"
    ]),
    ...mapActions(QUESTION_STORE, {
      getQuestionDetail: 'getQuestionDetail'
    }),
    isQuestionRandom(question) {
			return [
				QUESTION_CREATATION_METHODS['RANDOM']
			].includes(get(question, 'method', ''));
    },
    async showResult(question) {
      try {
        this.isLoadingSubmissionDetail = true;
        this.showSubmissionModal = true;
        this.currentQuestion = Object.assign({}, question);
        const res = await this.getQuestionDetail(question.id);
        if (get(res, 'success', false)) {
          this.setMarkExerciseQuestionChoose(res.data);
        } else {
          this.$toasted.error("Xảy ra lỗi khi lấy dữ liệu câu hỏi");
        }
        this.getAnswer(question);
        this.setMarkExerciseQuestionAnswersChoose(this.currentSubmission);
      } catch (error) {
        console.log('error: ', error)
        this.$toasted.error("Xảy ra lỗi khi xem bài làm học sinh");
      } finally {
        this.isLoadingSubmissionDetail = false;
      }
    },
    downloadResult(question) {

    },
    getAnswer(question) {
      let ans = false;
      for(let i = 0; i < this.answerCounter; i++) {
        const tmp = this.answers[i];
        const tmpQuestionId = get(tmp, 'question_id', '');
        if (tmpQuestionId == get(question, 'id', '')) {
          this.currentSubmission = Object.assign({}, tmp);
          return tmp;
        }
      }
      return ans;
    },
    questionAllowAttachment(question) {
      const submissionType = get(question, 'submission_form', 'MANUAL');
      if (submissionType == 'UPLOAD' || submissionType == 'BOTH') {
        return true;
      }
      return false;
    },
    questionAllowWriting(question) {
      const submissionType = get(question, 'submission_form', 'UPLOAD');
      if (submissionType == 'MANUAL' || submissionType == 'BOTH') {
        return true;
      }
      return false;
    },
    answerHasAttachment(question) {
      if (this.questionAllowAttachment(question)) {
        const matchingAns = this.getAnswer(question);
        if (matchingAns) {
          if (get(matchingAns, 'upload', false)) {
            return get(matchingAns, 'upload');
          }
        }
        return false;
      }
      return false;
    },
    answerHasWritting(question) {
      if (this.questionAllowWriting(question)) {
        const matchingAns = this.getAnswer(question);
        if (matchingAns) {
          if (get(matchingAns, 'submissions.length', false)) {
            return get(matchingAns, 'submissions[0].answer');
          }
        }
        return false;
      }
      return false;
    },
    getSubmissionScore(question) {
      for(let i = 0; i < this.answerCounter; i++) {
        const tmp = this.answers[i];
        const tmpQuestionId = get(tmp, 'question_id', '');
        if (tmpQuestionId == get(question, 'id', '')) {
          return get(tmp, 'mark', 0);
        }
      }
      return 0;
    },
    closeSubmissionModal() {
      this.showSubmissionModal = false;
    },
    get
  }
}
</script>
<style>

</style>