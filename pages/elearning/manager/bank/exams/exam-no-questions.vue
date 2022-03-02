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
            class="mr-2 fill-primary vertical-middle"
            width="18px"
            @click.prevent="handleCancel"
          />
          <span>{{getObjBankExamEdit.name || ''}}</span>
          <IconEdit
            class="icon-edit ml-2 fill-primary vertical-middle"
            width="16px"
            @click.prevent="handleEditExam"
          />
        </div>

        <div class="template-content">
          <div class="text-right">
            <app-button
              color="primary"
              class="heading-5 font-weight-normal btn-add-questions"
            >
              <IconPlus class="icon mr-2" /> Thêm câu hỏi
              <OptionsAddQuestionExam
                :active="active"
                class="opt-question"
              />
            </app-button>
          </div>

          <div class="text-center mt-5">
            <img src="~assets/images/elearning/exam-no-question.png" alt="" />
            <p class="body-1">Bạn chưa tạo câu hỏi nào.</p>
            <p class="text-warning">
              <IconAlert class="icon mr-2 vertical-middle" />Bạn chưa hoàn thiện
              nội dung bài tập.
            </p>
          </div>

          <div class="template-content__btn text-center">
            <app-button
              color="default"
              outline
              class="text-secondary mr-3 w-120"
              @click.prevent="handleCancel"
            >
              Hủy
            </app-button>

            <!-- <app-button class="w-120" color="primary">
              Hoàn thành
            </app-button> -->
          </div>
        </div>
      </div>
    </div>

    <EditBankExam
      @close="isShowPopupUpdateExam = false"
      v-if="isShowPopupUpdateExam"
      :dataEditExam="getObjBankExamEdit"
      @bankExamEditSuccess="bankExamEditSuccess"
    />

  </div>
</template>

<script>
import IconArrowBackIos24px from "~/assets/svg/v2-icons/arrow_back_ios_24px.svg?inline";
import IconEdit from "~/assets/svg/icons/edit.svg?inline";
import IconPlus from "~/assets/svg/icons/plus3.svg?inline";
import IconAlert from "~/assets/svg/v2-icons/alert/error_outline_24px.svg?inline";

import OptionsAddQuestionExam from "~/components/page/elearning/manager/bank/exams/OptionsAddQuestionExam";
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import EditBankExam from "~/components/page/elearning/manager/bank/exams/EditBankExam";
import { initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common";
import { EXAM_TYPES } from "~/utils/constants"
import { mapActions, mapState, mapGetters } from "vuex";
import * as actionTypes from "~/utils/action-types";
export default {
  components: {
    IconArrowBackIos24px,
    IconEdit,
    IconPlus,
    OptionsAddQuestionExam,
    IconAlert,
    ElearningManagerSide,
    EditBankExam
  },

  data() {
    return {
      active: "",
      isShowPopupUpdateExam: false,
      examId: this.$route.query ? this.$route.query.id : "",
    };
  },

  computed: {
    ...mapState("elearning/manager/bank/exam", ["getObjBankExamEdit"]),
  },

  created() {
    const type = this.$route.query ? this.$route.query.type : "";
    this.checkTypeActive(type);
    this.getExamDetail();
  },

  methods: {
    getExamDetail(){
      this.$store.dispatch(
        `elearning/manager/bank/exam/${actionTypes.BANK_EXAM.DETAIL_EXAM_EDIT}`, this.examId
      )
    },
    checkTypeActive(type) {
      if (type == EXAM_TYPES.CHOICE) {
        this.active = "choice";
      } else if (type == EXAM_TYPES.ESSAY) {
        this.active = "essay";
      } else {
        this.active = "all";
      }
    },

    handleCancel() {
      this.$router.push(`/elearning/manager/bank/exams`);
    },
    async handleEditExam() {
      this.isShowPopupUpdateExam = !this.isShowPopupUpdateExam;
    },

    bankExamEditSuccess() {
      this.isShowPopupUpdateExam = false;
      this.$store.dispatch(
        `elearning/manager/bank/exam/${actionTypes.BANK_EXAM.DETAIL_EXAM_EDIT}`, this.examId
      )
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
@import "~assets/scss/pages/elearning/manager/bank/_template-content-exams.scss";
</style>
