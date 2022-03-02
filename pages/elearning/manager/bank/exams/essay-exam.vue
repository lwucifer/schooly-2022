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
          <span>{{ getObjBankExamEdit.name || ''}}</span>
          <IconEdit
            class="icon-edit ml-2 fill-primary vertical-middle"
            width="16px"
            @click.prevent="handleEditExam"
          />
        </div>

        <div class="template-content">
          <div class="d-flex justify-content-between align-items-center">
            <div class="body-1 text-dark font-weight-medium">
              Danh sách câu hỏi
            </div>

            <div>
              <a
                class="heading-5 font-weight-normal text-base mr-4"
                v-if="getObjBankExamEdit.status == 1"
              >
                <IconPlaylistAddCheck24px
                  class="mr-2 fill-primary vertical-middle"
                />
                Đề thi hợp lệ
              </a>

              <a class="text-warning fill-warning mr-4" v-else>
                <IconAlert class="mr-2 vertical-middle" /> Bạn chưa hoàn thiện
                nội dung đề thi
              </a>

              <app-button
                color="primary"
                class="heading-5 font-weight-normal btn-add-questions"
              >
                <IconPlus class="icon mr-2" /> Thêm câu hỏi
                <OptionsAddQuestionExam
                  :examId="examId"
                  class="opt-question"
                  active="essay"
                />
              </app-button>
            </div>
          </div>

          <TableEditEssayExam :dataDetailExam="filterExamEssay" @bankExamEditSuccess="bankExamEditSuccess" />

          <div class="total-point mt-4">
            <p class="text-dark heading-5">
              Tổng điểm:
              <span class="text-primary font-weight-medium">{{getObjBankExamEdit.essay_point}}/10</span>
            </p>
            <p class="mt-2 text-gray body-3">
              *Lưu ý: Một bài tập bắt buộc có kèm câu hỏi tự luận được tính là
              hợp lệ phải có tổng điểm các câu hỏi là 10, trong đó điểm thấp
              nhất của một câu hỏi là 0,25
            </p>
          </div>

          <div class="text-center mt-4 mb-3">
            <app-button
              color="default"
              class="text-secondary w-120 mr-3"
              outline
              @click.prevent="handleCancel"
            >
              Hủy
            </app-button>

            <!-- <app-button class="w-120" color="primary">
                            Lưu
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
import IconPlaylistAddCheck24px from "~/assets/svg/v2-icons/playlist_add_check_24px.svg?inline";
import IconPlus from "~/assets/svg/icons/plus3.svg?inline";
import IconAlert from "~/assets/svg/v2-icons/alert/error_outline_24px.svg?inline";

import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import TableEditEssayExam from "~/components/page/elearning/manager/bank/exams/TableEditEssayExam";
import OptionsAddQuestionExam from "~/components/page/elearning/manager/bank/exams/OptionsAddQuestionExam";
import { initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common";
import EditBankExam from "~/components/page/elearning/manager/bank/exams/EditBankExam";
import { PAGE_SIZE } from "~/utils/constants";

import { mapActions, mapState, mapGetters } from "vuex";
import * as actionTypes from "~/utils/action-types";

export default {
  components: {
    ElearningManagerSide,
    IconArrowBackIos24px,
    IconEdit,
    IconPlaylistAddCheck24px,
    IconPlus,
    IconAlert,
    TableEditEssayExam,
    OptionsAddQuestionExam,
    EditBankExam
  },

  data() {
    return {
      isValidExam: true,
      isShowPopupUpdateExam: false,
      examId: this.$route.query ? this.$route.query.id : "",
    };
  },

  async fetch({ params, query, store }) {
    console.log("fetch", query.id);
    const examId = query.id;
    const queryExamEdit = {
      page: 1,
      size: PAGE_SIZE.MAXIMIZE,
      parent: "test",
      parent_id: examId ? examId : null,
    };
    await Promise.all([
      store.dispatch(
        `elearning/manager/bank/exam/${actionTypes.BANK_EXAM.DETAIL_EXAM_ESSAY}`,
        queryExamEdit
      ),
      store.dispatch(
        `elearning/manager/bank/exam/${actionTypes.BANK_EXAM.DETAIL_EXAM_EDIT}`, examId
      ),
    ]);
  },

  computed: {
    ...mapState("elearning/manager/bank/exam", ["getDetailBankExamEssay", "getObjBankExamEdit"]),
    filterExamEssay(){
      return this.getDetailBankExamEssay && this.getDetailBankExamEssay.content || []
    },

    filterPoint() {
      const data =
        this.getDetailBankExamEssay && this.getDetailBankExamEssay.content
          ? this.getDetailBankExamEssay.content
          : [];

      const tmp = data.reduce((sum, item) => sum + (item.points || 0), 0);
      return tmp;
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

  methods: {
    handleAddQuestion(_link) {
      this.$route.push(_link);
    },
    handleEditExam() {
      this.isShowPopupUpdateExam = !this.isShowPopupUpdateExam;
    },
    bankExamEditSuccess(){
      this.isShowPopupUpdateExam = false;
      this.$store.dispatch(
        `elearning/manager/bank/exam/${actionTypes.BANK_EXAM.DETAIL_EXAM_EDIT}`, this.examId
      )
    },
    handleCancel(){
      this.$router.push(
        `/elearning/manager/bank/exams`
      );
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/pages/elearning/manager/bank/_template-content-exams.scss";
</style>
