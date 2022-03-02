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
            @click.prevent="handleBack"
          />
          <span>{{ getObjBankExamEdit.name || ''}}</span>
          <!-- <IconEdit
            class="icon-edit ml-2 fill-primary vertical-middle"
            width="16px"
          /> -->
        </div>

        <div class="template-content">
          <div class="frame-dash text-center">
            <div v-if="getListUploadExam.length > 0" class="heading-5 mb-4">Đã tải xong 1 file lên</div>

            <div 
              v-for="(item, index) in getListUploadExam" :key="index"
              class="file-upload d-flex justify-content-between align-items-center"
            >
              <a>{{ item.name || ' '}}</a>
              <IconCheck />

              <!-- <IconClose24px class="icon-close" /> -->
            </div>

            <app-upload class="app-upload-exam" @click.prevent="handleUploadExam">
              <IconCloudUpload24px
                class="icon mr-2 fill-opacity-1 vertical-middle"
              />
              Tải lên tiếp
            </app-upload>

            <p class="body-3 mt-4 note-upload">
              Xem các định dạng file được chấp nhận
              <IconInfo24px class="icon ml-2 vertical-middle fill-opacity-1" />
            </p>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-5">
            <div class="body-1 text-dark font-weight-medium">
              Danh sách câu hỏi
            </div>

            <div>
              <a
                class="heading-5 font-weight-normal text-base mr-4"
                v-if="checkExamFinish"
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

              <!-- <app-button
                color="primary"
                class="heading-5 font-weight-normal btn-add-questions"
              >
                <IconPlus class="icon mr-2" /> Thêm câu hỏi
                <OptionsAddQuestionExam 
                  class="opt-question" 
                  :examId="parent_id"
                  active="all" 
                />
              </app-button> -->
            </div>
          </div>

          <TableListUpload :filterExam="filterExam" />

          <div class="total-point mt-4">
            <p class="text-dark heading-5">
              Tổng điểm:
              <span class="text-primary font-weight-medium"
                >{{filterPoint}}/10</span
              >
            </p>
            <p class="mt-2 text-gray body-3">
              *Lưu ý: Một bài tập bắt buộc có kèm câu hỏi tự luận được tính là
              hợp lệ phải có tổng điểm các câu hỏi là 10, trong đó điểm thấp
              nhất của một câu hỏi là 0,25
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common";

import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import TableListUpload from "~/components/page/elearning/manager/bank/exams/TableListUpload";
import OptionsAddQuestionExam from "~/components/page/elearning/manager/bank/exams/OptionsAddQuestionExam";

import IconArrowBackIos24px from "~/assets/svg/v2-icons/arrow_back_ios_24px.svg?inline";
import IconEdit from "~/assets/svg/icons/edit.svg?inline";
import IconCloudUpload24px from "~/assets/svg/v2-icons/cloud_upload_24px.svg?inline";
import IconInfo24px from "~/assets/svg/v2-icons/info_24px.svg?inline";
import IconPlus from "~/assets/svg/icons/plus3.svg?inline";
import IconAlert from "~/assets/svg/v2-icons/alert/error_outline_24px.svg?inline";
import IconCheck from "~/assets/svg/v2-icons/check_primary.svg?inline";
import IconClose24px from "~/assets/svg/v2-icons/close_24px.svg?inline";
import { get, cloneDeep, merge } from "lodash";

import { mapActions, mapState, mapGetters } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { PAGE_SIZE } from "~/utils/constants";

export default {
  components: {
    ElearningManagerSide,
    TableListUpload,
    IconArrowBackIos24px,
    IconEdit,
    IconCloudUpload24px,
    IconInfo24px,
    IconPlus,
    IconAlert,
    IconCheck,
    IconClose24px,
    OptionsAddQuestionExam,
  },

  data() {
    return {
      parent_id: this.$route.query ? this.$route.query.parent_id : "",
      category: this.$route.query ? this.$route.query.category : "",
      type: this.$route.query ? this.$route.query.type : "",
    }
  },


  async fetch({ params, query, store }) {
    const test_id = query.parent_id;
    const queryListQuestion = {
      page: 1,
      size: PAGE_SIZE.MAXIMIZE,
      parent_id: test_id,
      parent: "test",
    };

    await Promise.all([
      store.dispatch(
        `elearning/manager/bank/exam/upload/${actionTypes.UPLOAD_EXAM.LIST}`,
        { test_id: test_id }
      ),
      store.dispatch(
        `elearning/manager/bank/exam/${actionTypes.BANK_EXAM.DETAIL_EXAM_EDIT}`,
        test_id
      ),
      store.dispatch(
        `elearning/manager/bank/exam/${actionTypes.BANK_EXAM.DETAIL_EXAM}`,
        queryListQuestion
      ),
    ]);
  },
  

  computed: {
    ...mapState('elearning/manager/bank/exam', ["bankExamDetailList", "getObjBankExamEdit"]),
    ...mapState('elearning/manager/bank/exam/upload', ["getListUploadExam"]),
    filterExam() {
      return (
        (this.bankExamDetailList && this.bankExamDetailList.content) || []
      );
    },

    fillterExamChoise() {
      const tmp =
        (this.filterExamMix &&
          this.filterExamMix.filter(
            (item) => item.category == "CHOICE" || item.category == "MIX"
          )) ||
        [];
      return tmp;
    },

    fillterExamEssay() {
      const tmp =
        (this.filterExamMix &&
          this.filterExamMix.filter(
            (item) => item.category == "CHOICE" || item.category == "ESSAY"
          )) ||
        [];
      return tmp;
    },

    filterPoint() {
      const data =
        this.bankExamDetailList && this.bankExamDetailList.content
          ? this.bankExamDetailList.content
          : [];

      let tmp = 10;
      if(this.fillterExamChoise.length == 0){
        tmp = data.reduce((sum, item) => sum + (item.points || 0), 0)
      }
      return tmp;
    },

    checkExamFinish() {
      let checkStatus = false
      let tmp = this.fillterExamEssay.reduce((sum, item) => sum + (item.points || 0), 0);
      let sumPointsChoice = 10 - tmp;
      let pointMediumChoice = sumPointsChoice/this.fillterExamChoise.length;
      if(pointMediumChoice%0.25 == 0){
        checkStatus = true
      }
      else{
        checkStatus = false
      }
      return checkStatus;
    },
  },

  mounted() {
    const breadcrumb = [
      {
        title: "Quản lý E-learning",
        to: "/elearning",
      },
      {
        title: "Quản lý kỳ thi",
        to: "/elearning/manager/semester/create/upload",
      },
    ];
    initBreadcrumb(this, breadcrumb);
  },

  methods: {
    get,
    handleUploadExam(){
      this.$router.push(
        '/elearning/manager/semester/create/upload?category=' +
        this.$route.query.category +
        '&type=' + this.$route.query.type +
        '&parent_id='+ this.$route.query.parent_id +
        '&exam_id=' + this.$route.query.exam_id
      );
    },
    handleBack() {
      this.$router.push(
        `/elearning/manager/semester/create?id=`+ get(this.$route, 'query.exam_id', '') + '&test_id=' + this.$route.query.parent_id
      );
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/pages/elearning/manager/bank/_template-content-exams.scss";
.file-upload >a {
  overflow: hidden;
}
</style>
