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
          <span>Thêm câu hỏi từ ngân hàng đề thi</span>
        </div>

        <div class="template-content">
          <div class="heading-5 font-weight-medium">Lựa chọn câu hỏi:</div>

          <div class="frame mt-4">
            <div class="frame__title heading-5 font-weight-medium text-center">NGÂN HÀNG ĐỀ THI</div>

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
                    placeholder="Khối"
                    size="sm"
                    @change="handleChangeGrade"
                    :options="gradesAllOpts"
                  />

                  <app-select
                    class="page-filter__select mr-4"
                    placeholder="Môn học"
                    size="sm"
                    @change="handleChangeSubject"
                    :options="subjectOpts"
                  />

                  <app-select
                    class="page-filter__select mr-4"
                    placeholder="Thể loại"
                    size="sm"
                    v-model="payload.type"
                    @change="handleChangeType"
                    :options="optsType"
                  />

                  <!-- <app-select
                    v-if="choiceQuestion == 'select'"
                    class="page-filter__select mr-4"
                    placeholder="Cấp độ"
                    size="sm"
                    @change="handleChangeLevel"
                    :options="optsLevels"
                    v-model="level"
                  />-->
                </template>
              </div>

              <!-- <app-select
                size="sm"
                class="btn-type-question mb-5 heading-5"
                :options="optsChoiceQuestion"
                :default-value="'random'"
                placeholder="Chọn loại câu hỏi"
                @change="handleChangeChoice"
              />-->

              <!-- <app-select
                v-if="choiceQuestion == 'select'"
                size="sm"
                class="btn-type-question mb-4 heading-5"
                placeholder="Chọn ngân hàng câu hỏi"
                :options="questionOtps"
                @change="handleChangeBankQuestion"
              />-->

              <!-- <TableBankQuestion
                v-if="choiceQuestion == 'random'"
                @onPageChange="onPageChange"
                @selectionChange="selectionChange"
              />-->
              <!-- <TableChooseQuestion
                v-else
                :fillterQuestionToBank="fillterQuestionToBank"
                @onPageChange="onPageChangeQuestion"
                @selectionChangeQuestion="selectionChangeQuestion"
              />-->
              <TableSelectExam @onPageChange="onPageChange" @onSelectItem="onSelectItem" />
            </div>
          </div>

          <!-- <div class="text-right mt-4">
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
          </div>-->
        </div>
      </div>
      <!-- <app-modal
        v-if="isModalBankQuestion"
        :footer="false"
        :header="false"
        width="849px"
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
      </app-modal>-->
      <app-modal-confirm
        v-if="isShowConfirmModal"
        centered
        :confirm-loading="isProcessingConfirm"
        description="Bạn có muốn thêm câu hỏi từ ngân hàng đề thi?"
        @ok="addQuestionFromExam"
        @cancel="cancelAddQuestionFromExam"
      ></app-modal-confirm>
    </div>
  </div>
</template>

<script>
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import TableBankQuestion from "~/components/page/elearning/manager/bank/exams/TableBankQuestion";
import TableSelectExam from "~/components/page/elearning/manager/bank/exams/TableSelectExam";
import TableQuestionRandom from "~/components/page/elearning/manager/bank/exams/TableQuestionRandom";
import TableChooseQuestion from "~/components/page/elearning/manager/bank/exams/TableChooseQuestion";

import { initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common";

import IconArrowBackIos24px from "~/assets/svg/v2-icons/arrow_back_ios_24px.svg?inline";
import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";

import { mapActions, mapState, mapGetters } from "vuex";
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
    TableSelectExam,
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
        category: null,
        grade_id: null,
        page: 1,
        size: PAGE_SIZE.ELEARNING_12,
        show_statistic: true,
        parent: "BANK",
        query: null,
        status: null,
        subject_id: null,
        type: this.$route.query.type ? this.$route.query.type : null,
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
      isShowConfirmModal: false,
      selectedItem: {},
      isProcessingConfirm: false,
    };
  },

  async fetch({ params, query, store }) {
    const schoolId = store.getters["auth/organizationId"];
    const schoolLevel = store.getters["auth/organizationLevel"];
    const queryGrades = {
      school_id: schoolId ? schoolId : null,
      school_level: schoolLevel ? schoolLevel : null,
    };
    const queryBankExam = {
      page: 1,
      size: PAGE_SIZE.ELEARNING_12,
      show_statistic: true,
      type: query.type,
      parent: "BANK",
    };
    await Promise.all([
      store.dispatch(
        `elearning/manager/bank/exam/${actionTypes.BANK_EXAM.LIST}`,
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
    optsType() {
      let type = this.$route.query.type || null;
      if (type) {
        if (type == "ESSAY") {
          return [
            { value: "ESSAY", text: "Tư luận" },
            { value: "MIX", text: "Hỗn hợp" },
          ];
        } else if (type == "CHOICE") {
          return [
            { value: "CHOICE", text: "Trắc nghiệm" },
            { value: "MIX", text: "Hỗn hợp" },
          ];
        } else if ((type = "MIX")) {
          return [
            { value: null, text: "Tất cả" },
            { value: "CHOICE", text: "Trắc nghiệm" },
            { value: "ESSAY", text: "Tư luận" },
            { value: "MIX", text: "Hỗn hợp" },
          ];
        }
      }
      return [
        { value: null, text: "Tất cả" },
        { value: "essay", text: "Tư luận" },
        { value: "choice", text: "Trắc nghiệm" },
        { value: "mix", text: "Hỗn hợp" },
      ];
    },
  },

  methods: {
    ...mapActions(EXAM_STORE, [
      "bankQuestionList",
      "questionToBankList",
      "addQuestionToBank",
      "bankExamlist",
      "bankExamDelete",
      "bankExamDeleteMultile",
      "bankExamDetail",
    ]),
    getBankExam() {
      Object.keys(this.payload).map((k) => {
        if (this.payload[k] == null || this.payload[k] == -1) {
          delete this.payload[k];
        }
      });
      this.bankExamlist(this.payload);
    },
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
      this.getBankExam();
    },

    // FILLTER GRADE BANK QUESTION
    handleChangeGrade(val) {
      this.payload.page = 1;
      this.payload.grade_id = val;
      this.getBankExam();
    },

    // FILLTER SUBJECT BANK QUESTION
    handleChangeSubject(_newVal) {
      console.log("[handleChangeSubject]", _newVal);
      this.payload.page = 1;
      this.payload.subject_id = _newVal;
      this.getBankExam();
    },

    // FILLTER TYPE BANK QUESTION
    handleChangeType(_newVal) {
      console.log("[handleChangeType]", _newVal);
      this.payload.page = 1;
      this.payload.type = _newVal;
      this.getBankExam();
    },

    // FILLTER TYPE BANK QUESTION
    async handleChangeLevel(_newVal) {
      console.log("[handleChangeLevel]", _newVal);
      this.payloadQuestion.level = await _newVal;
      this.getBankExam();
    },

    // CHANGE OPTIONS
    handleChangeChoice(_newVal) {
      this.choiceQuestion = _newVal;
      this.payload.page = 1;
      _newVal == "random"
        ? (this.payload.size = PAGE_SIZE.ELEARNING_12)
        : (this.payload.size = PAGE_SIZE.MAXIMIZE);
      this.getBankExam();
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
      this.getBankExam();
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
      const elearningId = this.$route.query
        ? this.$route.query.elearning_id
        : "";
      const examId = this.$route.query ? this.$route.query.parent_id : "";
      const sourceType = this.$route.query ? this.$route.query.item_type : "";

      if (elearningId) {
        let url = "";
        if (sourceType == "exercise") {
          url = `/elearning/manager/courses/create?elearning_id=${elearningId}&active_section=exercise&active_content=edit-form&exercise_id=${examId}`;
        } else {
          url = `/elearning/manager/courses/create?elearning_id=${elearningId}&active_section=exam&active_content=edit-form&exam_id=${examId}`;
        }
        this.$router.push(url);
      } else {
        this.$router.push(
          `/elearning/manager/bank/exams/exam-no-questions?type=${type}&id=${parent_id}`
        );
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
      const type = this.$route.query ? this.$route.query.type : "";
      const category = this.$route.query ? this.$route.query.category : "";
      const parent_id = this.$route.query ? this.$route.query.parent_id : "";
      const itemType = this.$route.query ? this.$route.query.item_type : false;
      const elearningId = this.$route.query
        ? this.$route.query.elearning_id
        : "";
      const source = this.$route.query ? this.route.query.source : "";

      if (elearningId) {
        let url;
        if (itemType && itemType == "exercise") {
          // redirect back for exercise editing
          url = `/elearning/manager/courses/create?elearning_id=${elearningId}&active_section=exercise&active_content=edit-form&exercise_id=${parent_id}`;
        } else {
          url = `/elearning/manager/courses/create?elearning_id=${elearningId}&active_section=exam&active_content=edit-form&exam_id=${parent_id}`;
        }
        this.$router.push(url);
      } else if (source == 'edit-exercise') {
        let url = `/elearning/manager/exams/${parent_id}/edit-exercise`;
        this.$router.push(url);
      } else if (source == 'edit-test') {
        let url = `/elearning/manager/courses/create?elearning_id=${elearningId}&active_section=exam&active_content=edit-form&exam_id=${parent_id}`;
        this.$router.push(url);
      } else if (elearningId) {
        let url;
        if (itemType && itemType == "exercise") {
          // redirect back for exercise editing
          url = `/elearning/manager/courses/create?elearning_id=${elearningId}&active_section=exercise&active_content=edit-form&exercise_id=${parent_id}`;
        } else {
          url = `/elearning/manager/courses/create?elearning_id=${elearningId}&active_section=exam&active_content=edit-form&exam_id=${parent_id}`;
        }
        console.log("back url: ", url);
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
      this.resetPayload();
      this.getBankExam();
    },
    resetPayload() {
      this.payload.category = null;
      this.payload.grade_id = null;
      this.payload.page = 1;
      this.payload.size = PAGE_SIZE.ELEARNING_12;
      this.payload.show_statistic = true;
      this.payload.parent = "BANK";
      this.payload.query = null;
      this.payload.status = null;
      this.payload.subject_id = null;
      this.payload.type = this.$route.query.type ? this.$route.query.type : null;
    },
    detailBankExam(_row) {
      this.modalBankExam = true;
      this.typeExam = _row.type;
      this.statusExam = _row.status;
      const data = {
        page: 1,
        size: PAGE_SIZE.MAXIMIZE,
        parent_id: _row.id,
        parent: "test",
      };
      this.bankExamDetail(data);
    },
    onSelectItem(item) {
      this.selectedItem = Object.assign({}, item);
      this.isShowConfirmModal = true;
    },
    async addQuestionFromExam() {
      try {
        this.isProcessingConfirm = true;
        const parentId = this.$route.query.parent_id || "";

        const payload = {
          parent_id: parentId,
          parent: "TEST",
          method: "IPTEST",
          iptest: {
            test_id: this.selectedItem.id || "",
          },
        };
        const res = await this.addQuestionToBank(payload);
        if (res.success) {
          this.$toasted.success("Thành công");
          // const previousUrl =
          //   this.$route.query.back || "/elearning/manager/courses/create";
          this.$router.go(-1);
          // this.$router.push(previousUrl);
        } else {
          this.$toasted.error("Không thành công");
        }
      } catch (error) {
        this.$toasted.error("Xảy ra lỗi");
      } finally {
        this.isProcessingConfirm = false;
        this.isShowConfirmModal = false;
      }
    },
    cancelAddQuestionFromExam() {
      this.isShowConfirmModal = false;
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
