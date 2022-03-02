<template>
  <div class="container bank-questions">
    <breadcrumb />

    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide :group="5" :active="13" />
      </div>

      <div class="col-md-9" v-if="loading">Loading...</div>
      <div class="col-md-9" v-else>
        <sub-block-section :title="title" has-icon :actionClick="handleBack">
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
                @click="handleRedirectQuestionBanks"
              >Hủy</app-button>
              <app-button color="white" class="mr-4" @click="showPreview = true">Xem trước</app-button>
              <app-button v-if="question" @click="handleEditQuestionToBank">Sửa câu hỏi</app-button>
              <app-button
                v-else
                @click="handleAddQuestionToBank"
                :disabled="isCreatingQuestion"
                :loading="isCreatingQuestion"
              >
                Tạo câu hỏi
              </app-button>
            </div>
          </template>
        </sub-block-section>
      </div>

      <ModalPreview
        v-if="showPreview"
        :typeQuestion="typeTxt"
        :questions.sync="payload"
        @click-close="showPreview = false"
      />
    </div>
  </div>
</template>

<script>
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import QuestionType1 from "~/components/page/elearning/manager/bank/questions/create/QuestionType1";
import QuestionType2 from "~/components/page/elearning/manager/bank/questions/create/QuestionType2";
import QuestionType3 from "~/components/page/elearning/manager/bank/questions/create/QuestionType3";
import QuestionType4 from "~/components/page/elearning/manager/bank/questions/create/QuestionType4";
import QuestionType5 from "~/components/page/elearning/manager/bank/questions/create/QuestionType5";
import QuestionType6 from "~/components/page/elearning/manager/bank/questions/create/QuestionType6";
import QuestionType7 from "~/components/page/elearning/manager/bank/questions/create/QuestionType7";
import ModalPreview from "~/components/page/elearning/manager/bank/questions/create/ModalPreview";
import IconDelete24px from "~/assets/svg/v2-icons/delete_24px.svg?inline";
import IconPlus2 from "~/assets/svg/icons/plus2.svg?inline";
import IconEdit from "~/assets/svg/icons/edit.svg?inline";
import IconEye from "~/assets/svg/v2-icons/remove_red_eye_24px.svg?inline";
import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";
import IconCloud from "~/assets/svg/v2-icons/cloud_download_24px.svg?inline";
import { get, cloneDeep, merge } from "lodash";
import { useEffect, questionBankTypeArr } from "~/utils/common";
import { getTypeQuestion } from "~/plugins/filters";

export default {
  data() {
    return {
      showPreview: false,
      loading: true,
      question_bank: null,
      question: null,
      payload: {
        question_id: "",
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
      isCreatingQuestion: false
    };
  },

  async mounted() {
    const parent_id = get(this, "$route.query.parent_id", "");
    const question_id = get(this, "$route.query.question_id", "");

    if (question_id) {
      this.question = await this.getQuestion(question_id);
    }

    if (parent_id) {
      this.question_bank = await this.getQuestionBank(parent_id);
    }

    this.loading = false;

    useEffect(this, this.handleChangeQuestionBank.bind(this), [
      "question_bank",
    ]);

    useEffect(this, this.handleChangeQuestionBankId.bind(this), [
      "$route.query.parent_id",
    ]);

    useEffect(this, this.handleChangeQuestionId.bind(this), [
      "$route.query.question_id",
    ]);
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
    handleBack() {
      this.handleRedirectQuestionBanks();
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

    async handleEditQuestionToBank() {
      this.handleFormatPayload();
      const res = await this.$axios({
        url: `/elearning/teaching/manage/question`,
        method: "PUT",
        data: this.payload,
      });
      if (get(res, "data.success", false)) {
        this.$toasted.success("Thành công");
        this.handleRedirectQuestionBanks();
        return;
      }
      this.$toasted.error(get(res, "data.message", "Có lỗi xảy ra"));
    },

    async handleAddQuestionToBank() {
      try {
        this.isCreatingQuestion = true;
        this.handleFormatPayload();
        const res = await this.$axios({
          url: "/elearning/teaching/manage/question",
          method: "POST",
          data: this.payload,
        });
        if (get(res, "data.success", false)) {
          this.$toasted.success("Thành công");
          this.handleRedirectQuestionBanks();
          return;
        }
        this.$toasted.error(get(res, "data.message", "Có lỗi xảy ra"));
      } catch (error) {
        this.$toasted.error("Có lỗi xảy ra");
      } finally {
        this.isCreatingQuestion = false;
      }
      
    },

    handleFormatPayload() {
      const typeParam = get(this, "$route.query.type", "");
      if (typeParam === questionBankTypeArr[3]["id"]) {
        this.payload.answers = null;
      }
      if (typeParam === questionBankTypeArr[4]["id"]) {
        this.payload.answers = null;
      }
      if (typeParam === questionBankTypeArr[6]["id"]) {
        this.payload.answers = null;
      }
    },

    handleRedirectQuestionBanks() {
      const elearningId = get(this, "$route.query.elearning_id", "");
      const parentId = get(this, "$route.query.parent_id", "");
      const activeSection = get(this, "$route.query.active_section", "");
      // const goBackUrl = get(
      //   this,
      //   "$route.query.back",
      //   `/elearning/manager/courses/create?elearning_id=${elearningId}`
      // );
      // if (activeSection == "exam") {
      //   const url = `/elearning/manager/courses/create?elearning_id=${elearningId}&active_section=exam&active_content=edit-form&exam_id=${parentId}`;
      //   this.$router.push(url);
      // } else {
      //   const url = `/elearning/manager/courses/create?elearning_id=${elearningId}&active_section=exercise&active_content=edit-form&exercise_id=${parentId}`;
      //   this.$router.push(url);
      // }
      this.$router.go(-1);
    },

    handleChangeQuestionBank() {
      const typeParam = get(this, "$route.query.type", "");
      this.payload.category = this.category;
      if (typeParam === questionBankTypeArr[3]["id"]) {
        this.payload.answers = null;
      }
      if (typeParam === questionBankTypeArr[4]["id"]) {
        this.payload.answers = null;
      }
      if (typeParam === questionBankTypeArr[6]["id"]) {
        this.payload.answers = null;
      }
    },

    handleChangeQuestionId() {
      const question_id = get(this, "$route.query.question_id", "");
      this.payload.question_id = question_id;
    },

    handleChangeQuestionBankId() {
      const parent_id = get(this, "$route.query.parent_id", "");
      this.payload.parent_id = parent_id;
    },

    handleChangeData(data) {
      let payload = cloneDeep(this.payload);
      payload = merge(payload, data);
      this.payload = payload;
    },

    async getQuestionBank(parent_id) {
      const res = await this.$axios({
        url: `/elearning/teaching/manage/question_bank/${parent_id}`,
      });
      if (get(res, "data.success", false)) {
        return get(res, "data.data", null);
      }
      return null;
    },

    get,
  },

  computed: {
    title() {
      if (this.question) {
        return "Sửa câu hỏi";
      }
      return "Thêm câu hỏi";
    },

    category() {
      const type = get(this, "$route.query.type", "YES_NO");
      if (type === questionBankTypeArr[0]["id"]) {
        return "CHOICE";
      }
      if (type === questionBankTypeArr[1]["id"]) {
        return "CHOICE";
      }
      if (type === questionBankTypeArr[2]["id"]) {
        return "CHOICE";
      }
      if (type === questionBankTypeArr[3]["id"]) {
        return "CHOICE";
      }
      if (type === questionBankTypeArr[4]["id"]) {
        return "CHOICE";
      }
      if (type === questionBankTypeArr[5]["id"]) {
        return "CHOICE";
      }
      if (type === questionBankTypeArr[6]["id"]) {
        return "ESSAY";
      }
    },

    type() {
      const typeParam = get(this, "$route.query.type", "YES_NO");
      this.payload.type = typeParam;
      return getTypeQuestion(typeParam);
    },
    typeTxt() {
      const typeParam = get(this, "$route.query.type", "YES_NO");
      return typeParam;
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/bank/_questions.scss";
</style>
