<template>
  <div class="container bank-questions">
    <breadcrumb />

    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide active="5" />
      </div>

      <div class="col-md-9" v-if="loading">Loading...</div>
      <div class="col-md-9" v-else>
        <sub-block-section :title="get(question_exam, 'name', '')" has-icon>
          <template #content>
            <div>
              <!-- Đúng sai -->
              <QuestionType1
                v-if="type == 1"
                @handleChangeData="handleChangeData"
                :question="question"
              />
              <!-- một lựa chọn -->
              <QuestionType2
                v-if="type == 2"
                @handleChangeData="handleChangeData"
                :question="question"
              />
              <!-- nhiều lựa chọn -->
              <QuestionType3
                v-if="type == 3"
                @handleChangeData="handleChangeData"
                :question="question"
              />
              <!-- ghép đáp án -->
              <QuestionType4
                v-if="type == 4"
                @handleChangeData="handleChangeData"
                :question="question"
              />
              <!-- điền từ -->
              <QuestionType5
                v-if="type == 5"
                @handleChangeData="handleChangeData"
                :question="question"
              />
              <!-- chọn từ -->
              <QuestionType6
                v-if="type == 6"
                @handleChangeData="handleChangeData"
                :question="question"
              />
              <!-- tự luận -->
              <QuestionType7
                v-if="type == 7"
                @handleChangeData="handleChangeData"
                :question="question"
              />
            </div>

            <div class="buttons d-flex">
              <app-button
                color="white"
                class="mr-4 color-red ml-auto"
                @click="handleRedirectExamBank"
                >Hủy</app-button
              >
              <app-button color="white" class="mr-4" @click="showPreview = true"
                >Xem trước</app-button
              >
              <app-button v-if="question" @click="handleEditQuestionToExam"
                >Sửa câu hỏi</app-button
              >
              <app-button v-else @click="handleAddQuestionToBank"
                >Tạo câu hỏi</app-button
              >
            </div>
          </template>
        </sub-block-section>
      </div>

      <ModalPreview
        v-if="showPreview"
        :typeQuestion="payload.type"
        :questions="payload"
        @click-close="showPreview = false"
      />
    </div>
  </div>
</template>

<script>
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import QuestionType1 from "~/components/page/elearning/manager/bank/exams/create/QuestionType1";
import QuestionType2 from "~/components/page/elearning/manager/bank/exams/create/QuestionType2";
import QuestionType3 from "~/components/page/elearning/manager/bank/exams/create/QuestionType3";
import QuestionType4 from "~/components/page/elearning/manager/bank/exams/create/QuestionType4";
import QuestionType5 from "~/components/page/elearning/manager/bank/exams/create/QuestionType5";
import QuestionType6 from "~/components/page/elearning/manager/bank/exams/create/QuestionType6";
import QuestionType7 from "~/components/page/elearning/manager/bank/exams/create/QuestionType7";
import ModalPreview from "~/components/page/elearning/manager/bank/exams/create/ModalPreview";
import IconDelete24px from "~/assets/svg/v2-icons/delete_24px.svg?inline";
import IconPlus2 from "~/assets/svg/icons/plus2.svg?inline";
import IconEdit from "~/assets/svg/icons/edit.svg?inline";
import IconEye from "~/assets/svg/v2-icons/remove_red_eye_24px.svg?inline";
import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";
import IconCloud from "~/assets/svg/v2-icons/cloud_download_24px.svg?inline";
import { get, cloneDeep, merge } from "lodash";
import { useEffect, questionBankTypeArr } from "~/utils/common";
import { BANK_EXAM_TYPE } from "~/utils/constants";

export default {
  data() {
    return {
      showPreview: false,
      loading: true,
      question_exam: null,
      question: null,
      payload: {
        question_id:"",
        answers: [
          {
            content: "",
            index: 0,
            matching: {
              content: "",
              index: 1,
              name: "",
            },
            name: "",
            selected: false,
          },
        ],
        category: "",
        index: 0,
        manual: {
          content: "",
          level: "",
          name: "",
          note: "",
        },
        method: "MANUAL",
        parent: "TEST",
        parent_id: "",
        points: 0,
        randoms: [
          {
            from_index: 0,
            level: "",
            question_bank_id: "",
            random: 0,
          },
        ],
        select: {
          question_ids: [""],
        },
        submission_form: "",
        type: "",
        upload: {
          attachments: [null],
          choice_question: 0,
          essay_question: 0,
        },
      },
    };
  },

  async mounted() {
    const question_id = get(this, "$route.query.question_id", "");
    const examId = get(this, "$route.query.parent_id", "");

    if (question_id) {
      this.question = await this.getQuestion(question_id);
    }
    if(examId){
      this.question_exam = await this.getQuestionExam(examId);
    }

    this.loading = false;

    this.handleChangeQuestionBank()

    this.handleChangeQuestionBankId()
  },

  components: {
    ModalPreview,
    ElearningManagerSide,
    IconDelete24px,
    IconPlus2,
    IconEye,
    IconEdit,
    IconHamberger,
    IconCloud,
    QuestionType1,
    QuestionType2,
    QuestionType3,
    QuestionType4,
    QuestionType5,
    QuestionType6,
    QuestionType7,
  },

  methods: {
    async handleEditQuestionToExam() {
      const question_id = get(this, "$route.query.question_id", "");
      this.payload.question_id = question_id;
      const res = await this.$axios({
        url: `/elearning/teaching/manage/question`,
        method: "PUT",
        data: this.payload,
      });
      if (get(res, "data.success", false)) {
        this.$toasted.success("Thành công");
        this.handleRedirectExamBank();
        return;
      }
      this.$toasted.error(get(res, "data.message", "Có lỗi xảy ra"));
    },

    async getQuestion(question_id) {
      const res = await this.$axios({
        url: `/elearning/teaching/manage/question/${question_id}`,
      });
      if (get(res, "data.success", false)) {
        return get(res, "data.data", null);
      }
      return null;
    },

    async handleAddQuestionToBank() {
      const res = await this.$axios({
        url: "/elearning/teaching/manage/question",
        method: "POST",
        data: this.payload,
      });
      if (get(res, "data.success", false)) {
        this.$toasted.success("Thành công");
        this.handleRedirectExamBank();
        return;
      }
      this.$toasted.error(get(res, "data.message", "Có lỗi xảy ra"));
    },

    handleRedirectExamBank() {
      if (this.question_exam.type == BANK_EXAM_TYPE.CHOICE) {
        this.$router.push(
          `/elearning/manager/bank/exams/choice-exam?id=${this.question_exam.id}`
        );
      } else if (this.question_exam.type == BANK_EXAM_TYPE.ESSAY) {
        this.$router.push(
          `/elearning/manager/bank/exams/essay-exam?id=${this.question_exam.id}`
        );
      } else if (this.question_exam.type == BANK_EXAM_TYPE.MIX) {
        this.$router.push(
          `/elearning/manager/bank/exams/combine-exam?id=${this.question_exam.id}`
        );
      } else {
      }
    },

    handleChangeQuestionBank() {
      console.log('handleChangeQuestionBank', this.question_exam)
      const typeParam = get(this, "$route.query.type", "");
      const type = parseInt(typeParam);
      this.payload.category = this.category;
      if (type === 5) {
        this.payload.answers = null;
      }
      if (type === 6) {
        this.payload.answers = null;
      }
      if (type === 7) {
        this.payload.answers = null;
      }
    },

    handleChangeQuestionBankId() {
      const parent_id = this.$route.query ? this.$route.query.parent_id : "";
      this.payload.parent_id = parent_id;
    },

    handleChangeData(data) {
      this.payload = { ...this.payload, ...data };
      console.log('handleChangeData', this.payload)
    },
    

    async getQuestionExam(examId) {
      const res = await this.$axios({
        url: `/elearning/teaching/test/${examId}`,
      });
      if (get(res, "data.success", false)) {
        return get(res, "data.data", null);
      }
      return null;
    },

    get,
  },

  computed: {
    category() {
      const typeParam = get(this, "$route.query.type", 1);
      const type = parseInt(typeParam);
      if (type === 1) {
        return "CHOICE";
      }
      if (type === 2) {
        return "CHOICE";
      }
      if (type === 3) {
        return "CHOICE";
      }
      if (type === 4) {
        return "CHOICE";
      }
      if (type === 5) {
        return "CHOICE";
      }
      if (type === 6) {
        return "CHOICE";
      }
      if (type === 7) {
        return "ESSAY";
      }
    },

    type() {
      const typeParam = get(this, "$route.query.type", "");
      const type = parseInt(typeParam);
      console.log('type', type)
      if (type === 1) {
        this.payload.type = "YES_NO";
      }
      if (type === 2) {
        this.payload.type = "SINGLE_CHOICE";
      }
      if (type === 3) {
        this.payload.type = "MULTIPLE_CHOICE";
      }
      if (type === 4) {
        this.payload.type = "WORD_MATCH";
      }
      if (type === 5) {
        this.payload.type = "FILL_IN_BLANK";
      }
      if (type === 6) {
        this.payload.type = "WORD_CHOICE";
      }
      if (type === 7) {
        this.payload.type = "ESSAY";
      }
      return type
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/bank/_questions.scss";
</style>
