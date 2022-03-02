<template>
  <div class="container bank-questions">
    <breadcrumb />

    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide :group="5" :active="13" />
      </div>

      <div class="col-md-9">
        <sub-block-section title="Ngân hàng câu hỏi">
          <template #content>
            <div class="d-flex-center">
              <div
                class="filter-form__item ml-0"
                style="max-width: 36rem; min-width: 30rem"
              >
                <app-search
                  class="page-filter__search w-100 mb-0"
                  placeholder="Nhập để tìm kiếm"
                  size="sm"
                  bordered
                  v-model="paramsGetQuestionBank.query"
                />
              </div>
              <div class="filter-form__item">
                <app-button
                  :color="showFilter ? 'primary' : 'white'"
                  square
                  :size="'sm'"
                  @click="toggleFilter"
                >
                  <IconHamberger
                    :class="showFilter ? 'fill-white' : 'fill-primary'"
                    class="mr-2"
                  />
                  <span>Lọc kết quả</span>
                </app-button>
              </div>

              <div class="d-flex-center ml-3" v-if="showFilter">
                <div class="filter-form__item">
                  <app-vue-select
                    style="width: 11rem"
                    class="app-vue-select filter-form__item__selection"
                    placeholder="Khối lớp"
                    has-border
                    label="name"
                    :options="_grades"
                    :all-opt="allOpt"
                    :reduce="(item) => item.id"
                    @input="handleChangeGrade"
                    :value="paramsGetQuestionBank.grade_id"
                  ></app-vue-select>
                </div>
                <div class="filter-form__item">
                  <app-vue-select
                    style="width: 11rem"
                    class="app-vue-select filter-form__item__selection"
                    placeholder="Môn học"
                    has-border
                    label="name"
                    :options="_subjects"
                    :all-opt="allOpt"
                    :reduce="(item) => item.id"
                    @input="handleChangeSubject"
                    :value="paramsGetQuestionBank.subject_id"
                  ></app-vue-select>
                </div>
                <div class="filter-form__item">
                  <app-vue-select
                    style="width: 11rem"
                    class="app-vue-select filter-form__item__selection"
                    label="name"
                    placeholder="Thể loại"
                    has-border
                    :options="_questionBankTypeArr"
                    :all-opt="allOpt"
                    :reduce="(item) => item.id"
                    :value="paramsGetQuestionBank.type"
                    @input="handleChangeType"
                  ></app-vue-select>
                </div>
              </div>
            </div>

            <div class="page-btn">
              <app-button
                color="secondary"
                class="mr-4"
                @click="handleDeleteQuestionBanks"
                :disabled="disableDeleteQuestionBanks"
              >
                <IconDelete24px />Xóa
              </app-button>

              <app-button @click="handleAddQuestionBank">
                <IconPlus2 />Thêm mới
              </app-button>
            </div>

            <!--Table-->
            <app-table
              class="mt-5"
              :loading="loading"
              :heads="heads"
              :pagination="get(questions, 'page', {})"
              :data="get(questions, 'content', [])"
              multiple-selection
              :cols="cols"
              @selectAll="handleSelectAll"
              @check="handleSelectItem"
              @pagechange="handleChangePage"
            >
              <template v-slot:cell(created_at)="{ row }">
                <td>
                  {{ getDateBirthDay(row.created_at) }}
                </td>
              </template>
              <template v-slot:actions="{ row }">
                <n-link
                  :to="'/elearning/manager/bank/questions/' + row.id + ''"
                  class="link"
                >
                  <IconEye
                    height="18"
                    width="18"
                    class="fill-primary mr-2"
                  />Xem chi tiết
                </n-link>
                <button @click="handleEditQuestionBank(row.id)">
                  <IconEdit
                    class="fill-purple mr-2"
                    height="16"
                    width="16"
                  />Chỉnh sửa
                </button>
                <button @click="deleteRows(row.id)">
                  <IconDelete24px
                    height="22"
                    width="22"
                    class="fill-secondary mr-2"
                  />Xóa
                </button>
              </template>
            </app-table>
            <!--End table-->

            <!--Modal create question-->
            <ModalAddQuestionsBank
              v-if="showAddQues"
              @click-close="showAddQues = false"
            />

            <ModalEditQuestionsBank
              v-if="showEditQuestionBank"
              @click-close="showEditQuestionBank = false"
              :question_bank_id="question_bank_id"
            />
          </template>
        </sub-block-section>
      </div>
    </div>

    <app-modal-confirm
      centered
      v-if="showModalConfirm"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      title="Bạn có chắc chắn muốn xóa?"
      description=""
    />
  </div>
</template>

<script>
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import ModalAddQuestionsBank from "~/components/page/elearning/manager/bank/questions/ModalAddQuestionsBank";
import ModalEditQuestionsBank from "~/components/page/elearning/manager/bank/questions/ModalEditQuestionsBank";
import { mapState } from "vuex";
import IconDelete24px from "~/assets/svg/v2-icons/delete_24px.svg?inline";
import IconPlus2 from "~/assets/svg/icons/plus2.svg?inline";
import IconEdit from "~/assets/svg/icons/edit.svg?inline";
import IconEye from "~/assets/svg/v2-icons/remove_red_eye_24px.svg?inline";
import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";
import { get, cloneDeep } from "lodash";
import { questionBankTypeArr, useEffect, initBreadcrumb } from "~/utils/common";
import { getDateBirthDay } from "~/utils/moment";

export default {
  data() {
    return {
      allOpt: {
        value: null,
        text: 'Tất cả'
      },
      showAddQues: false,
      showEditQuestionBank: false,
      showModalConfirm: false,
      confirmLoading: false,
      questionBankTypeArr,
      showFilter: false,
      cols: [5, 30, 15, 16, 12, 12, 15],
      loading: false,
      payloadDeleteQuestionBanks: {
        question_bank_ids: [],
      },
      paramsGetQuestionBank: {
        page: 1,
        size: 10,
        grade_id: null,
        subject_id: null,
        type: null,
        query: "",
      },
      heads: [
        {
          name: "name",
          text: "Tiêu đề",
        },
        {
          name: "grade_id",
          text: "Khối",
        },
        {
          name: "subject",
          text: "Môn học",
        },
        {
          name: "typeText",
          text: "Thể loại",
        },
        {
          name: "total_questions",
          text: "Số câu hỏi",
        },
        {
          name: "created_at",
          text: "Ngày tạo",
          sort: true,
        },
      ],
      question_bank_id: "",
    };
  },

  async mounted() {
    const breadcrumb = [
      {
        title: "Quản lý E-learning",
        to: "/elearning",
      },
      {
        title: "Ngân hàng câu hỏi",
        to: "/elearning/manager/bank/questions",
      },
    ];
    initBreadcrumb(this, breadcrumb);

    const params = {
      school_id: get(this, "userLogin.organization.id", ""),
      school_level: get(this, "userLogin.organization.level", ""),
    };
    this.$store.dispatch(
      "elearning/manager/bank/question/questions/getGrades",
      params
    );
    useEffect(this, this.getQuestionBank.bind(this), ["paramsGetQuestionBank"]);
  },

  computed: {
    ...mapState("elearning/manager/bank/question/questions", {
      questions: "questions",
      grades: "grades",
      subjects: "subjects",
    }),
    ...mapState("auth", {
      userLogin: "token",
    }),
    disableDeleteQuestionBanks() {
      return !this.payloadDeleteQuestionBanks.question_bank_ids.length;
    },
    _subjects() {
      return [{ name: "Tất cả", id: '' }].concat(this.subjects);
    },
    _grades() {
      return [{ name: "Tất cả", id: '' }].concat(this.grades);
    },
    _questionBankTypeArr() {
      return [{ name: "Tất cả", id: '' }].concat(this.questionBankTypeArr);
    },
  },

  components: {
    ElearningManagerSide,
    ModalAddQuestionsBank,
    IconDelete24px,
    IconPlus2,
    IconEye,
    IconEdit,
    IconHamberger,
    ModalEditQuestionsBank,
  },

  watch: {
    "paramsGetQuestionBank.grade_id": {
      handler: function() {
        this.paramsGetQuestionBank.subject_id = null;
        this.$store.dispatch(
          "elearning/manager/bank/question/questions/clearSubjects"
        );

        const params = {
          school_id: get(this, "userLogin.organization.id", ""),
          grade: this.paramsGetQuestionBank.grade_id,
        };

        this.$store.dispatch(
          "elearning/manager/bank/question/questions/getSubjects",
          params
        );
      },
    },
    showFilter: {
      handler: function() {
        if (!this.showFilter) {
          this.paramsGetQuestionBank.grade_id = null;
          this.paramsGetQuestionBank.subject_id = null;
          this.paramsGetQuestionBank.type = null;
        }
      },
    },
  },

  methods: {
    getDateBirthDay,

    handleEditQuestionBank(question_bank_id) {
      this.showEditQuestionBank = true;
      this.question_bank_id = question_bank_id;
    },

    deleteRows(question_bank_id) {
      this.payloadDeleteQuestionBanks.question_bank_ids = [question_bank_id];
      this.showModalConfirm = true;
    },

    handleAddQuestionBank() {
      this.showAddQues = true;
      this.showFilter = false;
    },

    handleChangeGrade(grade_id) {
      this.paramsGetQuestionBank.grade_id = grade_id ? grade_id : null;
    },

    handleChangeSubject(subject_id) {
      this.paramsGetQuestionBank.subject_id = subject_id ? subject_id : null;
    },

    handleChangeType(type) {
      this.paramsGetQuestionBank.type = type ? type : null;
    },

    handleDeleteQuestionBanks() {
      this.showModalConfirm = true;
    },

    async handleOk() {
      this.confirmLoading = true;
      const data = {
        question_bank_ids: this.payloadDeleteQuestionBanks.question_bank_ids,
      };
      try {
        const res = await this.$axios({
          url: "/elearning/teaching/manage/question_banks",
          method: "DELETE",
          data,
        });
        this.handleCancel();
        if (get(res, "data.success", false)) {
          this.getQuestionBank();
          this.$toasted.success("Thành công");
          return;
        }
        this.$toasted.error(get(res, "data.message", "Có lỗi xảy ra"));
      } catch (error) {
        this.$toasted.error("Có lỗi xảy ra");
      }
    },

    handleCancel() {
      this.showModalConfirm = false;
      this.confirmLoading = false;
      this.payloadDeleteQuestionBanks.question_bank_ids = [];
    },

    async getQuestionBank() {
      this.loading = true;
      let paramsGetQuestionBank = cloneDeep(this.paramsGetQuestionBank);
      if (!paramsGetQuestionBank.subject_id) {
        paramsGetQuestionBank.subject_id = null;
      }

      if (!paramsGetQuestionBank.grade_id) {
        paramsGetQuestionBank.grade_id = null;
      }

      if (!paramsGetQuestionBank.type) {
        paramsGetQuestionBank.type = null;
      }

      await this.$store.dispatch(
        "elearning/manager/bank/question/questions/getQuestions",
        paramsGetQuestionBank
      );
      this.loading = false;
    },

    toggleFilter() {
      this.showFilter = !this.showFilter;
    },

    handleChangePage(page) {
      this.paramsGetQuestionBank.page = +page.number + 1;
    },

    handleSelectAll(items) {
      let question_bank_ids = [];
      items.map((item) => {
        question_bank_ids.push(item.id);
      });
      this.payloadDeleteQuestionBanks.question_bank_ids = question_bank_ids;
    },

    handleSelectItem(item, items) {
      let question_bank_ids = [];
      items.map((item) => {
        question_bank_ids.push(item.id);
      });
      this.payloadDeleteQuestionBanks.question_bank_ids = question_bank_ids;
    },

    get,
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/bank/_questions.scss";
</style>
