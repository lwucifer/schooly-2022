<template>
  <div>
    <create-action :isShowAction="false" />
    <div v-if="currentContent == 'createForm'">
      <div class="cc-panel bg-white mb-4">
        <div class="cc-panel__title">
          <h1 class="cc-panel__heading heading-5 text-primary">Bài kiểm tra</h1>
        </div>

        <div class="px-4">
          <app-alert type="info" class="mt-4" show-close>
            Bạn có thể tạo bài kiểm tra cho bài giảng/ khóa học của bạn tại đây.
            Nếu bài giảng/ khóa học của bạn không yêu cầu làm bài tập, bạn có thể
            bỏ qua phần này và tiến hành gửi lên để được xét duyệt.
          </app-alert>
        </div>

        <ButtonCreateExam v-if="isShowButtonCreate" @handleClick="handleShowFormAdd" />

        <!-- <ExamList
          v-for="(exam, index) in get(exams, 'content', [])"
          :key="exam.id"
          :exam="exam"
          :index="index"
        />-->
      </div>

      <AddExam v-if="isShowFormAdd" @cancel="handleHideFormAdd" />

      <ExamList2
        v-if="filterType == 'coefficient' || filterType == 'noData'"
        type="coefficient"
        @editExam="handleEditExam"
        :dataTable="filterListCoefficient"
        :filterPagination="filterPagination"
        @onPageChange="onPageChange"
      />

      <ExamList2
        v-if="filterType == 'weight' || filterType == 'noData'"
        type="weight"
        @editExam="handleEditExam"
        :dataTable="filterListWeight"
        :filterWeight="filterWeight"
        :filterPagination="filterPagination"
        @onPageChange="onPageChange"
      />
    </div>

    <div v-if="currentContent == 'editForm'">
      <EditExam @goBack="closeEditForm" :dataTest="getObjBankExamEdit" />
    </div>
  </div>
</template>

<script>
import IconInfoCircle from "~/assets/svg/design-icons/info-circle.svg?inline";
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import IconEditAlt from "~/assets/svg/design-icons/edit-alt.svg?inline";
import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline";
import IconAlignCenterAlt from "~/assets/svg/design-icons/align-center-alt.svg?inline";
import IconFileCheck from "~/assets/svg/design-icons/file-check.svg?inline";
import IconClipboardNotes from "~/assets/svg/design-icons/clipboard-notes.svg?inline";
import ButtonCreateExam from "~/components/page/course/create/exams/ButtonCreateExam";
import AddExam from "~/components/page/course/create/exams/AddExam";
import ExamList from "~/components/page/course/create/exams/ExamList";
import ExamList2 from "~/components/page/course/create/exams/ExamList2";
import SelectLesson from "~/components/page/course/create/exams/SelectLesson";
import CreateAction from "~/components/page/course/create/common/CreateAction";
import EditExam from "~/components/page/course/create/exams/EditExam";
import * as actionTypes from "~/utils/action-types";
import { getParamQuery, useEffect } from "~/utils/common";
import { get } from "lodash";
import { mapState, mapActions } from "vuex";
import { CATEGORY_TEST, PAGE_SIZE } from "~/utils/constants";
const EXAM_STORE = `elearning/manager/bank/exam`;

export default {
  components: {
    IconInfoCircle,
    IconAngleDown,
    IconEditAlt,
    IconTrashAlt,
    IconAlignCenterAlt,
    IconFileCheck,
    IconClipboardNotes,
    CreateAction,
    ButtonCreateExam,
    AddExam,
    ExamList,
    ExamList2,
    SelectLesson,
    EditExam,
  },

  watch: {
    "$route.query": function (newQuery, oldQuery) {
      const activeContent = get(newQuery, "active_content", false);
      if (activeContent && activeContent == "edit-form") {
        this.currentContent = "editForm";
      }
    },
  },

  data() {
    return {
      isShowButtonCreate: true,
      isShowFormAdd: false,
      currentContent: "createForm", // editForm | createForm
      dataTest: {},
    };
  },

  computed: {
    ...mapState("elearning/create", {
      general: "general",
      exams: "exams",
      progress: "progress",
    }),
    ...mapState(EXAM_STORE, ["getListBankExam", "getObjBankExamEdit"]),
    filterListCoefficient() {
      const data =
        this.getListBankExam && this.getListBankExam.content
          ? this.getListBankExam.content
          : [];
      const dataMap = data
        .filter((item) => item.settings && item.settings.coefficient)
        .map((i) => {
          return {
            ...i,
            questionNum:
              i && i.statistic && i.statistic.questions
                ? i.statistic.questions
                : 0,
          };
        });
      return dataMap;
    },
    filterListWeight() {
      const data =
        this.getListBankExam && this.getListBankExam.content
          ? this.getListBankExam.content
          : [];
      const dataMap = data
        .filter((item) => item.settings && item.settings.weight)
        .map((i) => {
          return {
            ...i,
            questionNum:
              i && i.statistic && i.statistic.questions
                ? i.statistic.questions
                : 0,
          };
        });
      return dataMap;
    },
    filterType() {
      const data =
        this.getListBankExam && this.getListBankExam.content
          ? this.getListBankExam.content
          : [];
      console.log("data", data);
      if (data[0] && data[0].settings && data[0].settings.coefficient) {
        return "coefficient";
      } else if (data[0] && data[0].settings && data[0].settings.weight) {
        return "weight";
      } else {
        return "noData";
      }
    },
    filterWeight() {
      const data =
        this.getListBankExam && this.getListBankExam.content
          ? this.getListBankExam.content
          : [];

      const tmp = data
        .filter((item) => item.settings && item.settings.weight)
        .reduce((sum, item) => sum + (item.settings.weight || 0), 0);
      return tmp;
    },
    filterPagination() {
      return {
        size: this.get(this.getListBankExam, "page.size", 10),
        total_pages: this.get(this.getListBankExam, "page.total_pages", 0),
        total_elements: this.get(
          this.getListBankExam,
          "page.total_elements",
          0
        ),
        first: this.get(this.getListBankExam, "page.first", 1),
        last: this.get(this.getListBankExam, "page.last", 1),
        number_of_elements: this.get(
          this.getListBankExam,
          "page.number_of_elements",
          0
        ),
        number: this.get(this.getListBankExam, "page.number", 0),
      };
    },
  },

  methods: {
    ...mapActions(EXAM_STORE, ["bankExamDetail", "bankExamlist"]),
    handleShowFormAdd() {
      if (this.disabled_all) return;
      this.isShowFormAdd = true;
    },

    handleHideFormAdd() {
      if (this.disabled_all) return;
      this.isShowButtonCreate = true;
      this.isShowFormAdd = false;
    },
    async handleEditExam(data) {
      // this.currentContent = "editForm";
      this.dataTest = data;
      const dataParams = {
        size: PAGE_SIZE.MAXIMIZE,
        page: 1,
        parent_id: data.id,
        parent: "test",
      };
      await Promise.all([
        // Get list question of exam
        this.bankExamDetail(dataParams),
        // Get detail of current exam
        this.$store.dispatch(
          `${EXAM_STORE}/${actionTypes.BANK_EXAM.DETAIL_EXAM_EDIT}`,
          data.id
        ),
      ]);

      this.$router.push({
        query: {
          elearning_id: getParamQuery("elearning_id"),
          active_section: getParamQuery("active_section"),
          active_content: "edit-form",
          exam_id: data.id,
        },
      });
    },
    async closeEditForm() {
      this.currentContent = "createForm";
      await this.$store.dispatch(
        `${EXAM_STORE}/${actionTypes.BANK_EXAM.LIST}`,
        {
          page: 1,
          size: PAGE_SIZE.MAXIMIZE,
          category: CATEGORY_TEST.TEST,
          parent: "ELEARNING",
          parent_id: getParamQuery("elearning_id"),
          show_statistic: true,
        }
      );
      this.$router.push({
        query: {
          elearning_id: getParamQuery("elearning_id"),
          active_section: getParamQuery("active_section"),
        },
      });
    },
    onPageChange(e) {
      const data = {
        page: e && e.number ? e.number + 1 : 1,
        size: 10,
        category: CATEGORY_TEST.TEST,
        parent: "ELEARNING",
        parent_id: getParamQuery("elearning_id"),
      };
      this.bankExamlist(data);
    },
    async setCurrentContent() {
      const currentContent = get(this, "$route.query.active_content", false);
      const currentSection = get(this, "$route.query.active_section", false);

      console.log("set current exam: ", currentContent);
      if (currentContent == "edit-form" && currentSection == "exam") {
        if (get(this, "$route.query.exam_id", false)) {
          const examId = get(this, "$route.query.exam_id", "");
          console.log("examId", examId);
          await Promise.all([
            // Get detail of current exercise
            this.$store.dispatch(
              `${EXAM_STORE}/${actionTypes.BANK_EXAM.DETAIL_EXAM_EDIT}`,
              examId
            ),
            // Get list questions of exercise
            this.$store.dispatch(
              `${EXAM_STORE}/${actionTypes.BANK_EXAM.DETAIL_EXAM}`,
              {
                parent_id: examId,
                parent: CATEGORY_TEST.TEST,
                size: PAGE_SIZE.MAXIMIZE,
                page: 1,
              }
            ),
          ]);
          this.currentContent = "editForm";
        }
      }
    },
    async getListExam() {
      await this.$store.dispatch(
        `${EXAM_STORE}/${actionTypes.BANK_EXAM.LIST}`,
        {
          page: 1,
          size: PAGE_SIZE.MAXIMIZE,
          category: CATEGORY_TEST.TEST,
          parent: "ELEARNING",
          parent_id: getParamQuery("elearning_id"),
          show_statistic: true,
        }
      );
    },
    get,
  },
  created() {
    this.setCurrentContent();
  },

  async fetch() {
    await this.getListExam();
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/create/_create-exercise.scss";
</style>
