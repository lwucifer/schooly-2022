<template>
  <div class="container">
    <breadcrumb />

    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide />
      </div>

      <div class="col-md-9">
        <div class="page-title">
          <IconArrowBackIos24px
            @click.prevent="handleCancel"
            class="mr-2 fill-primary vertical-middle"
            width="18px"
          />
          <span>Thêm câu hỏi từ ngân hàng câu hỏi</span>
        </div>

        <div class="template-content">
          <div class="heading-5 font-weight-medium">Lựa chọn câu hỏi:</div>

          <div class="frame mt-4">
            <div class="frame__title heading-5 font-weight-medium text-center">NGÂN HÀNG CÂU HỎI</div>

            <div class="frame__content">
              <!-- <button
                class="text-primary mb-4 font-weight-medium body-1"
              >
                <IconArrowBackIos24px class="icon mr-2 vertical-middle"/> Ngân hàng câu hỏi số 1 
                <span class="heading-5 text-base" style="opacity: 0.5">(12 câu hỏi)</span>
              </button>-->

              <div class="page-filter mb-4 d-flex align-items-center">
                <app-search
                  class="page-filter__search mb-0"
                  placeholder="Nhập để tìm kiếm"
                  size="sm"
                  v-model="payload.query"
                  @submit="search"
                  @keyup.enter.native="search"
                />

                <app-button
                  class="page-filter__btn-filter font-weight-normal mx-3"
                  :color="showFilter ? 'primary' : 'default'"
                  size="sm"
                  @click="toggleFilter"
                >
                  <IconHamberger class="icon fill-opacity-1 body-1 mr-2" />Lọc
                  kết quả
                </app-button>

                <template v-if="showFilter">
                  <app-select
                    class="page-filter__select mr-4"
                    placeholder="Cấp độ"
                    size="sm"
                    @change="handleChangeLevel"
                    :options="optsLevels"
                    v-model="level"
                  />
                </template>
              </div>

              <app-select
                :disabled="true"
                size="sm"
                class="btn-type-question mb-5 heading-5"
                :options="optsChoiceQuestion"
                :default-value="'select'"
                placeholder="Chọn loại câu hỏi"
                @change="handleChangeChoice"
              />

              <app-select
                size="sm"
                class="btn-type-question mb-4 heading-5"
                placeholder="Chọn ngân hàng câu hỏi"
                :options="questionOtps"
                @change="handleChangeBankQuestion"
              />
              <TableChooseQuestion
                :fillterQuestionToBank="fillterQuestionToBank"
                @onPageChange="onPageChangeQuestion"
                @selectionChangeQuestion="selectionChangeQuestion"
                @selectItem="showModalConfirm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-modal-confirm
      v-if="isShowEditSelectModal"
      @cancel="isShowEditSelectModal = false"
      @ok="handleSelectQuestion"
      description="Bạn có chắc muốn chọn câu hỏi này để sửa câu hỏi đã có của bạn?"
    ></app-modal-confirm>
  </div>
</template>

<script>
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import TableBankQuestion from "~/components/page/elearning/manager/bank/exams/TableBankQuestionNoSelection";
import TableQuestionRandom from "~/components/page/elearning/manager/bank/exams/TableQuestionRandom";
import TableChooseQuestion from "~/components/page/elearning/manager/bank/exams/TableChooseQuestionNoSelection";

import { initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common";

import IconArrowBackIos24px from "~/assets/svg/v2-icons/arrow_back_ios_24px.svg?inline";
import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";
import { get } from "lodash";
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { PAGE_SIZE, LEVEL_QUESTIONS, BANK_EXAM_TYPE } from "~/utils/constants";
import {
  addAllOptionSelect,
  questionBankTypeArr,
  getParamQuery,
} from "~/utils/common";
const STORE_NAME_PUBLIC_GRADES = `elearning/public/public-grades`;
const EXAM_STORE = `elearning/manager/bank/exam`;

export default {
  components: {
    ElearningManagerSide,
    TableBankQuestion,
    TableChooseQuestion,
    TableQuestionRandom,
    IconArrowBackIos24px,
    IconHamberger,
  },

  data() {
    return {
      showFilter: false,
      subject: null,
      level: null,
      questionBankTypeArr,
      isModalBankQuestion: false,
      dataExamChecked: [],
      dataQuestionChecked: [],
      easyNumber: 0,
      mediumNumber: 0,
      hardNumber: 0,
      payloadQuestion: {
        page: 1,
        size: PAGE_SIZE.ELEARNING_12,
        parent: "BANK",
        parent_id: null,
        level: null,
      },
      payload: {
        grade_id: null,
        page: 1,
        size: PAGE_SIZE.ELEARNING_12,
        parent: null,
        query: null,
        subject_id: null,
        type: null,
      },
      choiceQuestion: "select",
      optsLevels: [
        {
          text: "Dễ",
          value: "EASY",
        },
        {
          text: "Trung bình",
          value: "MEDIUM",
        },
        {
          text: "Khó",
          value: "HARD",
        },
      ],
      optsChoiceQuestion: [
        // { value: "random", text: "Chọn câu hỏi ngẫu nhiên" },
        { value: "select", text: "Chọn câu hỏi tuỳ chọn" },
      ],
      dataQuestion: {},
      isShowEditSelectModal: false,
    };
  },

  async fetch({ params, query, store }) {
    const examId = query.parent_id;
    const schoolId = store.getters["auth/organizationId"];
    const schoolLevel = store.getters["auth/organizationLevel"];
    const typeTest = query.type == "MIX" ? null : query.type;
    const queryGrades = {
      school_id: schoolId ? schoolId : null,
      school_level: schoolLevel ? schoolLevel : null,
    };
    const queryBankExam = {
      page: 1,
      size: PAGE_SIZE.ELEARNING_12,
      type: typeTest,
    };
    await Promise.all([
      store.dispatch(
        `elearning/manager/bank/exam/${actionTypes.BANK_EXAM.LIST_BANK_QUESTION}`,
        queryBankExam
      ),

      store.dispatch(
        `elearning/public/public-subject/${actionTypes.ELEARNING.SUBJECT}`
      ),
      store.dispatch(
        `${STORE_NAME_PUBLIC_GRADES}/${actionTypes.PUBLIC_GRADES.GRADES_ALL}`,
        {
          params: queryGrades,
        }
      ),
    ]);
  },

  computed: {
    ...mapState(EXAM_STORE, ["getListBankQuestion", "getListQuestionToBank"]),
    ...mapState("elearning/public/public-subject", {
      subjects: "subjects",
    }),
    ...mapGetters(STORE_NAME_PUBLIC_GRADES, ["gradesAllOpts"]),
    subjectOpts() {
      this.subject = this.$route.query.subject
        ? this.$route.query.subject
        : null;
      const alls = addAllOptionSelect(this.subjects);
      return alls.map((c) => {
        return {
          value: c.id,
          text: c.name,
        };
      });
    },

    fillterQuestionToBank() {
      console.log("fillterQuestionToBank", this.getListQuestionToBank);
      return this.getListQuestionToBank;
    },

    questionOtps() {
      const data =
        this.getListBankQuestion && this.getListBankQuestion.content
          ? this.getListBankQuestion.content
          : [];
      const dataMap = data.map((item) => {
        return {
          text: item.name,
          value: item.id,
        };
      });
      return dataMap;
    },
  },

  methods: {
    ...mapActions(EXAM_STORE, [
      "bankQuestionList",
      "questionToBankList",
      "addQuestionToBank",
    ]),

    ...mapMutations(EXAM_STORE, ["setQuestionToBankList"]),
    // GET LIST BANK QUESTION
    getBankQuestion() {
      Object.keys(this.payload).map((k) => {
        if (this.payload[k] == null || this.payload[k] == -1) {
          delete this.payload[k];
        }
      });
      this.bankQuestionList(this.payload);
    },

    // GET LIST QUESTION TO BANK
    getQuestionToBank() {
      Object.keys(this.payloadQuestion).map((k) => {
        if (this.payloadQuestion[k] == null || this.payloadQuestion[k] == -1) {
          delete this.payloadQuestion[k];
        }
      });
      this.questionToBankList(this.payloadQuestion);
    },

    // SEARCH BANK QUESTION
    search(_newVal) {
      this.getBankQuestion();
    },

    // FILLTER GRADE BANK QUESTION
    handleChangeGrade(val) {
      this.payload.page = 1;
      this.payload.grade_id = val;
      this.getBankQuestion();
    },

    // FILLTER SUBJECT BANK QUESTION
    handleChangeSubject(_newVal) {
      console.log("[handleChangeSubject]", _newVal);
      this.payload.page = 1;
      this.payload.subject_id = _newVal;
      this.getBankQuestion();
    },

    // FILLTER TYPE BANK QUESTION
    handleChangeType(_newVal) {
      console.log("[handleChangeType]", _newVal);
      this.payload.page = 1;
      this.payload.type = _newVal;
      this.getBankQuestion();
    },

    // FILLTER TYPE BANK QUESTION
    async handleChangeLevel(_newVal) {
      console.log("[handleChangeLevel]", _newVal);
      this.payloadQuestion.level = _newVal;
      if (this.payloadQuestion.parent_id) {
        this.getQuestionToBank();
      }
    },

    // CHANGE OPTIONS
    handleChangeChoice(_newVal) {
      this.choiceQuestion = _newVal;
      this.payload.page = 1;
      _newVal == "random"
        ? (this.payload.size = PAGE_SIZE.ELEARNING_12)
        : (this.payload.size = PAGE_SIZE.MAXIMIZE);
      this.getBankQuestion();
    },

    // CHANGE BANK QUESTION
    handleChangeBankQuestion(_newVal) {
      console.log("handleChangeBankQuestion", _newVal);
      this.payloadQuestion.parent_id = _newVal;
      this.questionToBankList(this.payloadQuestion);
    },

    // SELECT DATA CHECKED BANK QUESTION
    selectionChange(data) {
      this.dataExamChecked = data;
      console.log("dataExamChecked", this.dataExamChecked);
    },

    // CHANGE PAGE BANK QUESTION
    onPageChange(e) {
      this.payload.page = e.number + 1;
      this.getBankQuestion();
    },

    // SELECT DATA CHECKED QUESTION TO BANK
    selectionChangeQuestion(data) {
      this.dataQuestionChecked = data;
      console.log("dataQuestionChecked", this.dataQuestionChecked);
    },

    // CHANGE PAGE QUESTION TO BANK
    onPageChangeQuestion(e) {
      this.payloadQuestion.page = e.number + 1;
      this.getQuestionToBank();
    },

    handleCancel() {
      // console.log("handleCancel");
      // const parent_id = this.$route.query ? this.$route.query.parent_id : "";
      // const type = this.$route.query ? this.$route.query.type : "";
      // this.$router.push(
      //   `/elearning/manager/bank/exams/exam-no-questions?type=${type}&id=${parent_id}`
      // );
      this.$router.go(-1);
    },

    handleAddQuestionToBank(val) {
      console.log("handleAddQuestionToBank", val);
      let payload = {
        parent_id: val.parent_id,
        parent: val.parent,
        method: val.method,
        randoms: val.randoms.map((item) => {
          return {
            question_bank_id: item.question_bank_id,
            settings: item.settings.filter((i) => i.random > 0),
          };
        }),
      };

      console.log("payload", payload);
      this.addQuestionToBank(payload).then((res) => {
        console.log("res", res);
        if (res.success == true) {
          this.$toasted.success("Thành công");
          this.handleRedirectExamBank();
        } else {
          this.$toasted.error(res.message);
        }
      });
    },

    handleAddQuestionToExam() {
      const queryAddQuestionToExam = {
        parent_id: this.$route.query ? this.$route.query.parent_id : "",
        parent: "test",
        category: this.$route.query ? this.$route.query.category : "",
        method: "select",
        type: this.$route.query ? this.$route.query.type : "",
        select: {
          question_ids: this.dataQuestionChecked,
        },
      };
      console.log("queryAddQuestionToExam", queryAddQuestionToExam);
      this.addQuestionToBank(queryAddQuestionToExam).then((res) => {
        console.log("res", res);
        if (res.success == true) {
          this.$toasted.success("Thành công");
          this.handleRedirectExamBank();
        } else {
          this.$toasted.error(res.message);
        }
      });
    },
    async handleSelectQuestion() {
      this.isShowEditSelectModal = false;
      const res = await this.$axios({
        url: `/elearning/teaching/manage/question`,
        method: "PUT",
        data: {
          test_id: getParamQuery("parent_id"),
          method: "SELECT",
          question_id: getParamQuery("question_id"),
          select_question_id: this.dataQuestion.id,
        },
      });
      if (get(res, "data.success", false)) {
        this.$toasted.success("Thành công");
        this.$router.go(-1);
        this.setQuestionToBankList({});
        // const data = {
        //   size: PAGE_SIZE.MAXIMIZE,
        //   page: 1,
        //   parent_id: getParamQuery("exam_id"),
        //   parent: "test",
        // };
        // this.bankExamDetail(data);
        // this.handleRedirectQuestionBanks();
      } else {
        this.$toasted.error(get(res, "data.message", "Có lỗi xảy ra"));
      }
    },

    toggleFilter() {
      this.showFilter = !this.showFilter;
    },

    showModalConfirm(item) {
      this.isShowEditSelectModal = true;
      this.dataQuestion = item;
    },
    get,
  },

  mounted() {
    const breadcrumb = [
      {
        title: "Quản lý E-learning",
        to: "/elearning",
      },
      {
        title: "Ngân hàng đề thi",
        to: "/elearning/manager/bank/list-exams",
      },
    ];
    initBreadcrumb(this, breadcrumb);
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/pages/elearning/manager/bank/_exams.scss";
@import "~assets/scss/pages/elearning/manager/bank/_template-content-exams.scss";
</style>
