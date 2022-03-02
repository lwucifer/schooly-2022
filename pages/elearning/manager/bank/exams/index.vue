<template>
  <div class="container">
    <breadcrumb />

    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide :group="5" :active="14" />
      </div>

      <div class="col-md-9">
        <sub-block-section title="Ngân hàng đề thi">
          <template #content>
            <div class="page-filter mb-5 d-flex align-items-center">
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
                <IconHamberger class="icon fill-opacity-1 body-1 mr-2" />Lọc kết
                quả
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
                  v-model="subject"
                  @change="handleChangeSubject"
                  :options="subjectOpts"
                />

                <app-select
                  class="page-filter__select mr-4"
                  placeholder="Thể loại"
                  size="sm"
                  @change="handleChangeType"
                  :options="optsType"
                />

                <app-select
                  class="page-filter__select"
                  placeholder="Trạng thái"
                  size="sm"
                  @change="handleChangeStatus"
                  :options="optsStatus"
                />
              </template>
            </div>

            <div class="page-btn mb-5">
              <app-button
                color="secondary"
                class="mr-4"
                size="sm"
                @click="handleDeleteExam"
                :disabled="disabledBtnDelete"
              >
                <IconDelete24px class="icon mr-2" />Xóa
              </app-button>

              <app-button color="primary" size="sm" @click="modalAddBankExam = true">
                <IconAddGreen class="icon mr-2" />Thêm mới
              </app-button>
            </div>

            <TableBankExams
              @detail="detailBankExam"
              @handleClickEdit="handleClickEdit"
              @onPageChange="onPageChange"
              @selectionChange="selectionChange"
              @handleShowModalConfirm="handleShowModalConfirm"
            />
          </template>
        </sub-block-section>
      </div>
    </div>

    <ModalBankExam
      @close="modalBankExam = false"
      v-if="modalBankExam"
      :typeExam="typeExam"
      :statusExam="statusExam"
      :titleExam="getObjBankExamEdit && getObjBankExamEdit.name"
    />

    <AddBankExam
      @close="modalAddBankExam = false"
      v-if="modalAddBankExam"
      @bankExamAddSuccess="bankExamAddSuccess"
    />

    <!-- <EditBankExam
      @close="modalEditBankExam = false"
      v-if="modalEditBankExam"
      :dataEditExam="dataEditExam"
      @bankExamEditSuccess="bankExamEditSuccess"
    />-->

    <app-modal-confirm
      centered
      v-if="showModalConfirm"
      title="Bạn có chắc chắn muốn xoá"
      @ok="confirmDelete"
      @cancel="showModalConfirm = false"
    />

    <app-modal-notify
      v-if="notify.showNotify"
      :title="notify.message"
      @close="notify.showNotify = false"
      @ok="notify.showNotify = false"
    />
  </div>
</template>

<script>
import IconFilterList from "~/assets/svg/v2-icons/filter_list_24px.svg?inline";
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import IconDelete24px from "~/assets/svg/v2-icons/delete_24px.svg?inline";
import IconAddGreen from "~/assets/svg/v2-icons/add_green.svg?inline";
import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";

import TableBankExams from "~/components/page/elearning/manager/bank/exams/TableBankExams";
import ModalBankExam from "~/components/page/elearning/manager/bank/exams/ModalBankExam";
import AddBankExam from "~/components/page/elearning/manager/bank/exams/AddBankExam";
import EditBankExam from "~/components/page/elearning/manager/bank/exams/EditBankExam";
import { initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common";

import { mapActions, mapState, mapGetters } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { PAGE_SIZE } from "~/utils/constants";
import {
  addAllOptionSelect,
  optionSelectSubject,
  redirectWithParams,
} from "~/utils/common";

const EXAM_STORE = `elearning/manager/bank/exam`;
const STORE_NAME_PUBLIC_GRADES = `elearning/public/public-grades`;

export default {
  data() {
    return {
      showFilter: false,
      modalBankExam: false,
      modalAddBankExam: false,
      modalEditBankExam: false,
      showModalConfirm: false,
      idDeleteRow: "",
      subject: null,
      dataEditExam: {},
      payload: {
        category: null,
        grade_id: null,
        page: 1,
        size: PAGE_SIZE.ELEARNING_12,
        show_statistic: true,
        parent: 'BANK',
        parent: null,
        query: null,
        status: null,
        subject_id: null,
        type: null,
      },

      notify: {
        message: "",
        showNotify: false,
      },
      optsType: [
        { value: null, text: "Tất cả" },
        { value: "essay", text: "Tư luận" },
        { value: "choice", text: "Trắc nghiệm" },
        { value: "mix", text: "Hỗn hợp" },
      ],
      optsStatus: [
        { value: null, text: "Tất cả" },
        { value: 0, text: "Pending" },
        { value: 1, text: "Completed" },
      ],
      typeExam: "",
      dataChecked: [],
      statusExam: "",
    };
  },

  components: {
    IconFilterList,
    ElearningManagerSide,
    IconDelete24px,
    IconAddGreen,
    TableBankExams,
    ModalBankExam,
    AddBankExam,
    EditBankExam,
    IconHamberger,
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
      parent: 'BANK',
      show_statistic: true,
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
    ...mapState("elearning/public/public-subject", {
      subjects: "subjects",
    }),
    ...mapState("elearning/manager/bank/exam", ["getObjBankExamEdit"]),
    ...mapGetters("auth", ["organizationId", "organizationLevel"]),
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
    disabledBtnDelete() {
      return !this.dataChecked.length > 0;
    },
  },

  // created() {
  //   this.getBankeXam();
  // },

  methods: {
    ...mapActions(EXAM_STORE, [
      "bankExamlist",
      "bankExamDelete",
      "bankExamDeleteMultile",
      "bankExamDetail",
      "bankExamDetailEdit",
    ]),

    getBankeXam() {
      this.payload.parent = 'BANK';
      Object.keys(this.payload).map((k) => {
        if (this.payload[k] == null || this.payload[k] == -1) {
          delete this.payload[k];
        }
      });
      this.bankExamlist(this.payload);
    },

    search(_newVal) {
      this.getBankeXam();
    },
    handleChangeGrade(val) {
      this.payload.page = 1;
      this.payload.grade_id = val;
      this.getBankeXam();
    },

    handleChangeSubject(_newVal) {
      console.log("[handleChangeSubject]", _newVal);
      // redirectWithParams({subject:_newVal ? _newVal : ''})
      this.payload.page = 1;
      this.payload.subject_id = _newVal;
      this.getBankeXam();
    },

    handleChangeType(_newVal) {
      console.log("[handleChangeType]", _newVal);
      this.payload.type = _newVal;
      this.getBankeXam();
    },

    handleChangeStatus(_newVal) {
      console.log("[handleChangeStatus]", _newVal);
      this.payload.status = _newVal;
      this.getBankeXam();
    },

    toggleFilter() {
      this.showFilter = !this.showFilter;
      this.subject = null;
      this.payload.grade_id = null;
      this.payload.subject_id = null;
      this.payload.type = null;
      this.payload.status = null;
      this.getBankeXam();
    },

    async detailBankExam(_row) {
      this.typeExam = _row.type;
      this.statusExam = _row.status;
      const data = {
        page: 1,
        size: PAGE_SIZE.MAXIMIZE,
        parent_id: _row.id,
        parent: "test",
      };
      await this.bankExamDetail(data);
      await this.bankExamDetailEdit(_row.id);
      this.modalBankExam = true;
    },

    selectionChange(data) {
      this.dataChecked = data;
      console.log("dataChecked", this.dataChecked);
    },

    onPageChange(e) {
      this.payload.page = e.number + 1;
      this.getBankeXam();
    },
    handleClickEdit(_data) {
      this.dataEditExam = _data;
      this.modalEditBankExam = true;
    },

    bankExamAddSuccess() {
      this.modalAddBankExam = false;
      this.payload.page = 1;
      this.getBankeXam();
    },

    bankExamEditSuccess() {
      this.modalEditBankExam = false;
      this.payload.page = 1;
      this.getBankeXam();
    },

    handleShowModalConfirm(_id) {
      this.showModalConfirm = true;
      this.idDeleteRow = _id;
    },

    handleDeleteExam() {
      this.showModalConfirm = true;
    },

    confirmDelete() {
      this.idDeleteRow
        ? this.bankExamDelete(this.idDeleteRow).then((res) => {
            this.showModalConfirm = false;
            if (res.success) {
              this.deleteSuccess();
            }
          })
        : this.bankExamDeleteMultile({ ids: this.dataChecked }).then((res) => {
            this.showModalConfirm = false;
            if (res.success) {
              this.deleteSuccess();
            }
          });
    },

    deleteSuccess() {
      this.$toasted.success("Thành công");
      this.idDeleteRow = "";
      this.dataChecked = [];
      this.getBankeXam();
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
        to: "/elearning/manager/bank/exams",
      },
    ];
    initBreadcrumb(this, breadcrumb);
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/pages/elearning/manager/bank/_exams.scss";
</style>
