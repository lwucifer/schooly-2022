<template>
  <div class="container">
        <breadcrumb />

    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide />
      </div>

      <div class="col-md-9">
        <div class="page-title">
          <IconArrowBackIos24px @click.prevent="handleBack"
          class="mr-2 fill-primary vertical-middle" width="18px" />
          <span>{{ getObjBankExamEdit.name || ''}}</span>
          <!-- <IconEdit class="icon-edit ml-2 fill-primary vertical-middle" width="16px" /> -->
        </div>

        <div class="template-content">
          <p class="body-1 font-weight-medium">Tải đề thi</p>

          <div class="frame-dash text-center">
            <p class="mb-4">Click để chọn tập tin hoặc kéo thả tập tin vào đây để tải lên.</p>

            <div
              v-if="payload.attachments.length > 0"
              class="heading-5 mb-4"
            >Đã tải xong {{ payload.attachments.length }} file lên</div>
            <div
              v-for="(item, index) in payload.attachments"
              :key="index"
              class="file-upload d-flex justify-content-between align-items-center"
            >
              <a href>{{ item.name || "" }}</a>
              <IconCheck />

              <IconClose24px @click.prevent="handleDeleteFile(index)" class="icon-close" />
            </div>

            <app-upload :multiple="true" class="app-upload-exam" @change="handleChangeFile">
              <IconCloudUpload24px class="icon mr-2 fill-opacity-1 vertical-middle" />Tải lên
            </app-upload>

            <p class="body-3 mt-4 note-upload">
              Xem các định dạng file được chấp nhận
              <IconInfo24px class="icon ml-2 vertical-middle fill-opacity-1" />
            </p>
          </div>

          <div class="d-flex align-items-center justify-content-between mt-5">
            <p class="body-1 font-weight-medium">Nhập số lượng câu hỏi của đề thi bạn vừa tải lên:</p>

            <div class="d-flex align-items-center">
              <span class="mr-3">Câu hỏi trắc nghiệm</span>
              <app-input type="number" class="w-60 mb-0" v-model="payload.choice_questions" />
            </div>

            <div class="d-flex align-items-center">
              <span class="mr-3">Câu hỏi tự luận</span>
              <app-input type="number" class="w-60 mb-0" v-model="payload.essay_questions" />
            </div>
          </div>

          <div class="template-content__btn text-center mt-6">
            <app-button color="default" @click="handleBack" outline class="text-secondary mr-3 w-120">Hủy</app-button>

            <app-button class="w-120" color="primary" @click.prevent="handleClickUpload">Tiếp tục</app-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common";

import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";

import IconArrowBackIos24px from "~/assets/svg/v2-icons/arrow_back_ios_24px.svg?inline";
import IconEdit from "~/assets/svg/icons/edit.svg?inline";
import IconCloudUpload24px from "~/assets/svg/v2-icons/cloud_upload_24px.svg?inline";
import IconInfo24px from "~/assets/svg/v2-icons/info_24px.svg?inline";
import IconCheck from "~/assets/svg/v2-icons/check_primary.svg?inline";
import IconClose24px from "~/assets/svg/v2-icons/close_24px.svg?inline";
import { get, cloneDeep, merge } from "lodash";
import { getBase64, getParamQuery } from "~/utils/common";
import { mapActions, mapState, mapGetters } from "vuex";
import * as actionTypes from "~/utils/action-types";

const UPLOAD_EXAM_STORE = `elearning/manager/bank/exam/upload`;

export default {
  components: {
    ElearningManagerSide,
    IconArrowBackIos24px,
    IconEdit,
    IconCloudUpload24px,
    IconInfo24px,
    IconCheck,
    IconClose24px,
  },

  data() {
    return {
      category: this.$route.query ? this.$route.query.category : "",
      type: this.$route.query ? this.$route.query.type : "",
      attachmentsSrc: null,
      payload: {
        attachments: [],
        choice_questions: null,
        essay_questions: null,
        method: "UPLOAD",
        test_id: this.$route.query ? this.$route.query.parent_id : "",
      },
    };
  },

   async fetch({ params, query, store }) {
    const test_id = query.parent_id;

    await Promise.all([
      store.dispatch(
        `elearning/manager/bank/exam/${actionTypes.BANK_EXAM.DETAIL_EXAM_EDIT}`,
        test_id
      ),
    ]);
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

  computed: {
    ...mapState('elearning/manager/bank/exam', ["getObjBankExamEdit"]),
  },

  methods: {
    ...mapActions(UPLOAD_EXAM_STORE, ["addUploadExam"]),
    get,
    handleChangeFile(fileList, event) {
      console.log("handleChangeFile", fileList);
      for (let index = 0; index < fileList.length; index++) {
        this.payload.attachments.push(fileList[index]);
      }
    },

    handleDeleteFile(index) {
      // this.payload.attachments = [];
      const indexSplice = this.payload.attachments.indexOf(index);
      this.payload.attachments.splice(indexSplice, 1);
      this.attachmentsSrc = null;
    },

    handleClickUpload() {
      const body = new FormData();
      for (let index = 0; index < this.payload.attachments.length; index++) {
        const element = this.payload.attachments[index];
        body.append("attachments", this.payload.attachments[index]);
      }
      // body.append("attachments", this.payload.attachments[0] || []);
      body.append("choice_questions", this.payload.choice_questions || 0);
      body.append("essay_questions", this.payload.essay_questions || 0);
      body.append("method", this.payload.method);
      body.append("test_id", this.payload.test_id);
      console.log("handleClickUpload", this.payload);
      this.addUploadExam(body).then((res) => {
        if (res.success == true) {
          this.$toasted.success("Thành công");
          if (getParamQuery("active_section")) {
            this.$router.go(-1);
          } else {
            this.$router.push(
              '/elearning/manager/semester/create/list-upload?category=' +
              this.$route.query.category +
              '&type=' + this.$route.query.type +
              '&parent_id='+ this.$route.query.parent_id +
              '&exam_id=' + this.$route.query.exam_id
            );
          }
        } else {
          this.$toasted.error(res.message);
        }
      });
    },

    handleBack() {
      this.$router.push(
        `/elearning/manager/semester/create?id=`+ 
        get(this.$route, 'query.exam_id', '') +
        `&test_id=${this.payload.test_id}`
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
