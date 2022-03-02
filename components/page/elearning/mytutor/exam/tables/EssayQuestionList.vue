<template>
  <div>
    <app-table
      :heads="heads"
      :needPagination="false"
      :data="list"
      class="mb-4"
      :ext-table-cls="{ 'table--nowrap-header': true }"
      :cols="[8,55,19,18]"
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

      <template v-slot:cell(action)="{row}">
        <td>
          <p class="text-center w-100">
            <button
              v-if="getAnswer(row) &&
                get(getAnswer(row), 'submissions.length', false)"
              @click="showResult(row)" class="d-inline-block text-info"
            >
              Xem
            </button>
            <a
              v-if="getAnswer(row) &&
                get(getAnswer(row), 'upload', false)"
              :href="get(getAnswer(row), 'upload.link', '')"
              download
              target="_blank"
              class="d-inline-block text-primary"
            >
              Tải về
            </a>
            <span
              v-if="!getAnswer(row) ||
                    (!get(getAnswer(row), 'submissions.length', false) &&
                    !get(getAnswer(row), 'upload', false))"
              class="text-error">Không nộp</span>
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
import SubmissionModal from "~/components/page/elearning/mytutor/exam/SubmissionModal";
import { mapMutations } from "vuex";

import { get } from "lodash";
import {
  EXAM_TYPE_QUESTION,
  EXERCISE_TYPES,
  PAGE_SIZE,
  QUESTION_CREATATION_METHODS,
  SUBMISSION_METHODS
} from "~/utils/constants";

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
    isQuestionRandom(question) {
			return [
				QUESTION_CREATATION_METHODS['RANDOM']
			].includes(get(question, 'method', ''));
    },
    showResult(question) {
      try {
        this.isLoadingSubmissionDetail = true;
        this.showSubmissionModal = true;
        this.currentQuestion = Object.assign({}, question);
        this.setMarkExerciseQuestionChoose(this.currentQuestion);
        this.getAnswer(question);
        this.setMarkExerciseQuestionAnswersChoose(this.currentSubmission);
      } catch (error) {
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
    closeSubmissionModal() {
      this.showSubmissionModal = false;
    },
    get
  }
}
</script>
<style>

</style>