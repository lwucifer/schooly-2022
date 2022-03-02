<template>
  <div>
    <h3 class="mb-4">Thêm câu hỏi từ ngân hàng câu hỏi</h3>
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
                v-if="choiceQuestion == 'random'"
                class="page-filter__select mr-4"
                placeholder="Khối"
                size="sm"
                :value="grade.name"
                :disabled="true"
                />

                <app-select
                v-if="choiceQuestion == 'random'"
                class="page-filter__select mr-4"
                placeholder="Môn học"
                size="sm"
                @change="handleChangeSubject"
                :options="subjectOpts"
                />

                <app-select
                v-if="choiceQuestion == 'random' && typeExam == 'MIX'"
                class="page-filter__select mr-4"
                placeholder="Thể loại"
                size="sm"
                @change="handleChangeType"
                :options="questionBankTypeOpts"
                />
                <app-select
                v-else-if="choiceQuestion == 'random' && typeExam == 'CHOICE'"
                class="page-filter__select mr-4"
                placeholder="Thể loại"
                size="sm"
                @change="handleChangeType"
                :options="questionBankTypeChoiceOpts"
                />
                <app-select
                v-if="choiceQuestion == 'select'"
                class="page-filter__select mr-4"
                placeholder="Cấp độ"
                size="sm"
                v-model="level"
                @change="handleChangeLevel"
                :options="optsLevels"
                />
            </template>
            </div>

            <app-select
            size="sm"
            class="btn-type-question mb-5 heading-5"
            :options="optsChoiceQuestion"
            :default-value="'random'"
            placeholder="Chọn loại câu hỏi"
            @change="handleChangeChoice"
            />

            <app-select
            v-if="choiceQuestion == 'select'"
            size="sm"
            class="btn-type-question mb-4 heading-5"
            placeholder="Chọn ngân hàng câu hỏi"
            :options="questionOtps"
            @change="handleChangeBankQuestion"
            />

            <TableBankQuestion
            v-if="choiceQuestion == 'random'"
            @onPageChange="onPageChange"
            @selectionChange="selectionChange"
            />
            <TableChooseQuestion
            v-else
            :fillterQuestionToBank="fillterQuestionToBank"
            @onPageChange="onPageChangeQuestion"
            @selectionChangeQuestion="selectionChangeQuestion"
            />
        </div>
        </div>

        <div class="text-right mt-4">
        <app-button
            color="default"
            outline
            class="mr-3 text-secondary"
            size="md"
            @click.prevent="handleCancel"
        >Hủy</app-button>

        <app-button
            v-if="choiceQuestion == 'random'"
            color="primary"
            size="md"
            :disabled="dataExamChecked.length > 0 ? false : true"
            @click.prevent="isModalBankQuestion = true"
        >Thêm câu hỏi</app-button>

        <app-button
            v-else
            color="primary"
            size="md"
            :disabled="dataQuestionChecked.length > 0 ? false : true"
            @click.prevent="handleAddQuestionToExam"
        >Xác nhận</app-button>
        </div>
    </div>

    <app-modal
    v-if="isModalBankQuestion"
    :footer="false"
    :header="false"
    width="900px"
    @close="isModalBankQuestion = false"
    >
    <template #content>
        <TableQuestionRandom
        :dataExamChecked="dataExamChecked"
        :choiceQuestion="choiceQuestion"
        @hidenModalBankQuestion="isModalBankQuestion = false"
        @handleAddQuestionToBank="handleAddQuestionToBank"
        />
    </template>
    </app-modal>
  </div>
</template>

<script>
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import TableBankQuestion from "~/components/page/elearning/manager/bank/exams/TableBankQuestion";
import TableQuestionRandom from "~/components/page/elearning/manager/bank/exams/TableQuestionRandom";
import TableChooseQuestion from "~/components/page/elearning/manager/bank/exams/TableChooseQuestion";

import { initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common";

import IconArrowBackIos24px from "~/assets/svg/v2-icons/arrow_back_ios_24px.svg?inline";
import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";

import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { PAGE_SIZE, LEVEL_QUESTIONS, BANK_EXAM_TYPE } from "~/utils/constants";
import { addAllOptionSelect, questionBankTypeArr } from "~/utils/common";
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

    props: {
        id: {
            type: [String, Number],
            default: ''
        },
        type: {
            type: [String, Number],
            default: ''
        },
        grade: {
            type: [Array, Object],
            default: {}
        },
        subjects: {
            type: [Array, Object],
            default: []
        }
    },

  data() {
    return {
      showFilter: false,
      subject: null,
      level: null,
      type: null,
      grade_id: null,
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
        type: !this.typeExam || this.typeExam == "MIX" ? null : this.typeExam,
      },
      choiceQuestion: "random",
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
        { value: "random", text: "Chọn câu hỏi ngẫu nhiên" },
        { value: "select", text: "Chọn câu hỏi tuỳ chọn" },
      ],
      questionBankTypeOpts: [
        {
          value: "YES_NO",
          text: "Đúng/Sai",
        },

        {
          value: "SINGLE_CHOICE",
          text: "Một lựa chọn",
        },
        {
          value: "MULTIPLE_CHOICE",
          text: "Nhiều lựa chọn",
        },
        {
          value: "FILL_IN_BLANK",
          text: "Điền từ",
        },
        {
          value: "WORD_CHOICE",
          text: "Chọn từ",
        },
        {
          value: "WORD_MATCH",
          text: "Ghép đáp án",
        },
        {
          value: "ESSAY",
          text: "Tự luận",
        },
      ],
      questionBankTypeChoiceOpts: [
        {
          value: "YES_NO",
          text: "Đúng/Sai",
        },

        {
          value: "SINGLE_CHOICE",
          text: "Một lựa chọn",
        },
        {
          value: "MULTIPLE_CHOICE",
          text: "Nhiều lựa chọn",
        },
        {
          value: "FILL_IN_BLANK",
          text: "Điền từ",
        },
        {
          value: "WORD_CHOICE",
          text: "Chọn từ",
        },
        {
          value: "WORD_MATCH",
          text: "Ghép đáp án",
        },
      ],
    };
  },

  async asyncData({ store, query }) {
    const typeExam = query.type; // get keyword, type from url
    return {
      typeExam,
    };
  },

  async fetch({ params, query, store }) {
    const examId = this.id;
    const type = !this.type || this.type == "MIX" ? null : this.type;
    const schoolId = this.$store.getters["auth/organizationId"];
    const schoolLevel = this.$store.getters["auth/organizationLevel"];
    const queryGrades = {
      school_id: schoolId ? schoolId : null,
      school_level: schoolLevel ? schoolLevel : null,
    };
    const queryBankExam = {
      page: 1,
      size: PAGE_SIZE.ELEARNING_12,
      type: type,
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
    ...mapState(EXAM_STORE, [
      "getListBankQuestion",
      "getListQuestionToBank",
      "getDetailBankExamEssay",
    ]),
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
      if (this.payloadQuestion.parent_id != null) {
        this.getQuestionToBank();
      }
    },

    // CHANGE OPTIONS
    handleChangeChoice(_newVal) {
      this.grade_id = null;
      this.payload.grade_id = null;
      this.payload.subject_id = null;
      const type = this.$route.query ? this.$route.query.type : "";
      this.payload.type = !type || type == "MIX" ? null : type;
      this.level = null;
      this.choiceQuestion = _newVal;
      this.payload.page = 1;
      if (_newVal == "select") {
        this.setQuestionToBankList({});
        this.getBankQuestion();
      }
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
      console.log("handleCancel");
      const parent_id = this.$route.query ? this.$route.query.parent_id : "";
      const type = this.$route.query ? this.$route.query.type : "";
      const activeSection =
        this.$route.query && this.$route.query.active_section
          ? this.$route.query.active_section
          : "";
      if (activeSection == "") {
        this.$router.push(
          `/elearning/manager/bank/exams/exam-no-questions?type=${type}&id=${parent_id}`
        );
      } else {
        this.$router.go(-1);
      }
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

    handleRedirectExamBank() {
      console.log("handleRedirectExamBank");
      const type = this.$route.query ? this.$route.query.type : "";
      const category = this.$route.query ? this.$route.query.category : "";
      const parent_id = this.$route.query ? this.$route.query.parent_id : "";
      const itemType = this.$route.query ? this.$route.query.item_type : false;
      const elearningId = this.$route.query
        ? this.$route.query.elearning_id
        : "";
      if (elearningId) {
        let url;
        if (itemType && itemType == 'exercise') {
          // redirect back for exercise editing
          url = `/elearning/manager/courses/create?elearning_id=${elearningId}&active_section=exercise&active_content=edit-form&exercise_id=${parent_id}`;
        } else {
          url = `/elearning/manager/courses/create?elearning_id=${elearningId}&active_section=exam&active_content=edit-form&exam_id=${parent_id}`;
        }
        console.log('back url: ', url);
        this.$router.push(url);
      } else if (type == BANK_EXAM_TYPE.CHOICE) {
        const url = `/elearning/manager/bank/exams/choice-exam?category=${category}&type=${type}&id=${parent_id}`;
        this.$router.push(url);
      } else if (type == BANK_EXAM_TYPE.ESSAY) {
        const url = `/elearning/manager/bank/exams/essay-exam?category=${category}&type=${type}&id=${parent_id}`;
        this.$router.push(url);
      } else if (type == BANK_EXAM_TYPE.MIX) {
        const url = `/elearning/manager/bank/exams/combine-exam?category=${category}&type=${type}&id=${parent_id}`;
        this.$router.push(url);
      } else {
      }
    },

    toggleFilter() {
      this.showFilter = !this.showFilter;
      if (!this.showFilter && this.choiceQuestion == "random") {
        const type = this.$route.query ? this.$route.query.type : "";
        this.payload.type = !type || type == "MIX" ? null : type;
        this.payload.subject_id = null;
        this.payload.grade_id = null;
        this.grade_id = null;

        this.getBankQuestion();
      }
      if (!this.showFilter && this.choiceQuestion == "select") {
        this.payloadQuestion.level = null;
        this.level = null;
        if (this.payloadQuestion.parent_id != null) {
          this.getQuestionToBank();
        }
      }
    },
  },

  mounted() {
    const breadcrumb = [
      {
        title: "Quản lý E-learning",
        to: "/elearning",
      },
      {
        title: "Ngân hàng đề thi",
        to: "/elearning/manager/bank/questions",
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
