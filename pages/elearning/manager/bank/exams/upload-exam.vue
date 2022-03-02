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
            @click="goBack"
          />
          <span>{{ contentTitle || getObjBankExamEdit.name }}</span>
          <!-- <IconEdit class="icon-edit ml-2 fill-primary vertical-middle" width="16px" /> -->
        </div>

        <div class="template-content">
          <p class="body-1 font-weight-medium">Tải đề thi</p>

          <div class="frame-dash text-center mb-4">
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
              <a href :title="item.name">{{ (item.name || "") | truncStrFilter(45) }}</a>
              <IconCheck />

              <IconClose24px @click.prevent="handleDeleteFile(index)" class="icon-close" />
            </div>

            <app-upload
              accept=".doc, .docx, .pdf, .rtf, .txt, .csv, .xls, .xlsx, .ppt, .pptx, odt, odp, .ods, .jpg, .png, .gif, .svg, .bmp, .jepg, .heic"
              :multiple="true"
              class="app-upload-exam"
              @change="handleChangeFile"
            >
              <IconCloudUpload24px class="icon mr-2 fill-opacity-1 vertical-middle" />Tải lên
            </app-upload>

            <client-only>
              <p class="body-3 mt-4 note-upload">
                <v-popover trigger="hover">
                  Xem các định dạng file được chấp nhận
                  <IconInfo24px class="icon ml-2 vertical-middle fill-opacity-1" />

                  <template #popover>
                    <p>.doc, .docx, .pdf, .rtf , .txt, .csv, .xls, .xlsx, .ppt, .pptx, odt, odp, .ods</p>
                    <p>.jpg, .png, .gif, .svg, .bmp, .jepg, .heic</p>
                  </template>
                </v-popover>
              </p>
            </client-only>
          </div>

          <div class="d-flex flex-wrap mb-4">
            <app-radio
              class="mr-5"
              name="student-upload-type"
              :value="UPLOAD_TEST_SUBMISSION_TYPE.MANUAL"
              v-model="payload.submission_type"
            >
              <span class="body-1 font-weight-medium">Học sinh làm bài trực tiếp</span>
            </app-radio>
            <app-radio
              name="student-upload-type"
              :value="UPLOAD_TEST_SUBMISSION_TYPE.UPLOAD"
              v-model="payload.submission_type"
            >
              <span class="body-1 font-weight-medium">Học sinh upload bài làm</span>
            </app-radio>
          </div>

          <div
            v-if="payload.submission_type === UPLOAD_TEST_SUBMISSION_TYPE.MANUAL"
            class="upload-exam-desc"
          >*Lưu ý: Bạn phải nhập số lượng câu hỏi có trong file sau đó chỉnh sửa các câu hỏi theo nội dung trong file để học sinh có thể làm bài trên hệ thống. Đối với các câu trắc nghiệm hệ thống có thể tự động chấm điểm.</div>
          <div
            v-if="payload.submission_type === UPLOAD_TEST_SUBMISSION_TYPE.UPLOAD"
            class="upload-exam-desc"
          >*Lưu ý: Học sinh sẽ làm bài qua file và up lên hệ thống. Giáo viên sẽ tải file bài làm của học sinh về để chấm điểm, sau đó đưa điểm lên hệ thống để quản lý.</div>

          <div
            v-if="payload.submission_type === UPLOAD_TEST_SUBMISSION_TYPE.MANUAL"
            class="d-flex align-items-center justify-content-between mt-4"
          >
            <p class="body-1 font-weight-medium">Nhập số lượng câu hỏi của đề thi bạn vừa tải lên:</p>

            <div v-if="type == 'CHOICE' || type == 'MIX'" class="d-flex align-items-center">
              <span class="mr-3">Câu hỏi trắc nghiệm</span>
              <app-input
                type="number"
                class="w-60 mb-0"
                :class="{ 'app-input--error': $v.payload.choice_questions.$error }"
                min="0"
                v-model="$v.payload.choice_questions.$model"
              />
            </div>

            <div v-if="type == 'ESSAY' || type == 'MIX'" class="d-flex align-items-center">
              <span class="mr-3">Câu hỏi tự luận</span>
              <app-input
                type="number"
                class="w-60 mb-0"
                :class="{ 'app-input--error': $v.payload.essay_questions.$error }"
                min="0"
                v-model="$v.payload.essay_questions.$model"
              />
            </div>
          </div>

          <div class="template-content__btn d-flex justify-content-center mt-6">
            <app-button
              color="default"
              outline
              class="text-secondary mr-3 w-120"
              @click="goBack"
            >Hủy</app-button>

            <app-button
              class="w-120"
              color="primary"
              :loading="uploadingFile"
              @click.prevent="handleClickUpload"
            >Tiếp tục</app-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { requiredIf, minValue } from "vuelidate/lib/validators";
import {
  initBreadcrumb,
  createPageTitle,
  initPageTitle,
  getBase64,
  getParamQuery,
} from "~/utils/common";
import { UPLOAD_TEST_SUBMISSION_TYPE } from "~/utils/constants";

import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import IconArrowBackIos24px from "~/assets/svg/v2-icons/arrow_back_ios_24px.svg?inline";
import IconEdit from "~/assets/svg/icons/edit.svg?inline";
import IconCloudUpload24px from "~/assets/svg/v2-icons/cloud_upload_24px.svg?inline";
import IconInfo24px from "~/assets/svg/v2-icons/info_24px.svg?inline";
import IconCheck from "~/assets/svg/v2-icons/check_primary.svg?inline";
import IconClose24px from "~/assets/svg/v2-icons/close_24px.svg?inline";

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
        choice_questions: 0,
        essay_questions: 0,
        method: "UPLOAD",
        test_id: this.$route.query ? this.$route.query.parent_id : "",
        submission_type: UPLOAD_TEST_SUBMISSION_TYPE.MANUAL,
      },
      contentTitle: this.$route.query ? this.$route.query.content_title : "",
      uploadingFile: false,
    };
  },

  validations() {
    if (this.payload.submission_type === UPLOAD_TEST_SUBMISSION_TYPE.UPLOAD) return {};

    const choice_questions = {
      required: requiredIf(function () {
        return this.type == "CHOICE" || this.type == "MIX";
      }),
      minValue: minValue(1),
    };

    const essay_questions = {
      required: requiredIf(function () {
        return this.type == "ESSAY" || this.type == "MIX";
      }),
      minValue: minValue(1),
    };

    if (this.type == "MIX")
      return {
        payload: {
          choice_questions,
          essay_questions,
        },
      };

    if (this.type == "CHOICE") return { payload: { choice_questions } };
    if (this.type == "ESSAY") return { payload: { essay_questions } };
  },

  created() {
    this.UPLOAD_TEST_SUBMISSION_TYPE = Object.freeze(
      UPLOAD_TEST_SUBMISSION_TYPE
    );

    const parent_id = this.$route.query.parent_id;
    console.log("parent_id", parent_id);
    this.bankExamDetailEdit(parent_id);
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

  computed: {
    ...mapState("elearning/manager/bank/exam", ["getObjBankExamEdit"]),
  },

  methods: {
    ...mapActions(UPLOAD_EXAM_STORE, ["addUploadExam"]),
    handleChangeFile(fileList, event) {
      console.log("handleChangeFile", fileList);
      for (let index = 0; index < fileList.length; index++) {
        this.payload.attachments.push(fileList[index]);
      }

      // getBase64(this.payload.attachments[0], (src) => {
      //   this.attachmentsSrc = src;
      // });
      console.log("this.payload.attachments", this.payload.attachments);
    },

    ...mapActions("elearning/manager/bank/exam", ["bankExamDetailEdit"]),

    handleDeleteFile(index) {
      // this.payload.attachments = [];
      const indexSplice = this.payload.attachments.indexOf(index);
      this.payload.attachments.splice(indexSplice, 1);
      this.attachmentsSrc = null;
    },

    async handleClickUpload() {
      try {
        this.$v.$touch();
        if (this.$v.$invalid) {
          this.$toasted.error(`Hãy nhập số lượng câu hỏi`);
          return;
        }

        const body = new FormData();
        this.uploadingFile = true;
        console.log("after change uploading status: ", this.uploadingFile);
        for (let index = 0; index < this.payload.attachments.length; index++) {
          const element = this.payload.attachments[index];
          body.append("attachments", this.payload.attachments[index]);
        }
        // body.append("attachments", this.payload.attachments[0] || []);
        body.append("choice_questions", this.payload.choice_questions || 0);
        body.append("essay_questions", this.payload.essay_questions || 0);
        body.append("method", this.payload.method);
        body.append("test_id", this.payload.test_id);
        body.append("submission_type", this.payload.submission_type);
        console.log("handleClickUpload", this.payload);
        const res = await this.addUploadExam(body);
        if (res.success == true) {
          this.$toasted.success("Thành công");
          if (getParamQuery("active_section")) {
            this.goBack();
          } else {
            this.$router.push(
              `/elearning/manager/bank/exams/list-upload?category=${this.category}&type=${this.type}&parent_id=${this.payload.test_id}`
            );
          }
        } else {
          this.$toasted.error(res.message);
        }
      } catch (error) {
      } finally {
        this.uploadingFile = false;
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    // cancel() {
    //   this.payload.attachments = [];
    //   this.choice_questions = null;
    //   this.essay_questions = null;
    //   this.method = "UPLOAD";
    // }
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/pages/elearning/manager/bank/_template-content-exams.scss";
</style>
