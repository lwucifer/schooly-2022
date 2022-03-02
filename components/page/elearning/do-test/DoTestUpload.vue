<template>
  <div v-if="studyMode === STUDY_MODE.SUBMISSION_SUCCESS" class="do-exam-wrapper">
    <ElearningExerciseSubmitSuccess />
  </div>

  <div v-else class="row">
    <div class="col-md-8">
      <div class="do-exam-wrapper">
        <div class="dtu-box mb-4">
          <div class="dtu-box__title">
            <h4 class="dtu-box__heading">Câu trả lời</h4>
          </div>

          <div class="dtu-box__content">
            <div v-for="(file, index) in answerFileList" :key="index" class="dtu-answer">
              <div class="dtu-answer__content">
                <IconImage
                  v-if="file.type.includes('image')"
                  class="dtu-answer__icon-file icon fill-opacity-1"
                />
                <IconInsertDriveFile v-else class="dtu-answer__icon-file icon fill-opacity-1" />
                <span class="dtu-answer__name">{{ file.name }}</span>
                <IconCheckCircle class="dtu-answer__checked icon fill-opacity-1" />
              </div>
              <a href class="dtu-answer__remove" @click.prevent="removeImage(file, index)">
                <IconClose class="icon fill-opacity-1" />
              </a>
            </div>

            <div
              v-if="!answerFileList.length"
              class="text-center text-gray-3"
            >Bạn chưa upload câu trả lời nào</div>

            <!-- <div class="dtu-answer">
              <div class="dtu-answer__content">
                <IconImage class="dtu-answer__icon-file icon fill-opacity-1" />
                <span class="dtu-answer__name">file-co-dinh-dang-csv.csv</span>
                <IconCheckCircle class="dtu-answer__checked icon fill-opacity-1" />
              </div>
              <a href class="dtu-answer__remove">
                <IconClose class="icon fill-opacity-1" />
              </a>
            </div>-->

            <div class="text-center mt-4">
              <app-upload class="dtu-upload" multiple @change="handleUploadChange">
                <app-button class="dtu-btn-upload" color="default" size="sm" outline>
                  <IconCloudUpload class="icon fill-opacity-1 mr-2 body-1" />Upload câu trả lời
                </app-button>
              </app-upload>
            </div>
          </div>
        </div>

        <div class="text-right">
          <app-button class="dtu-btn-send" color @click="handleClickSubmit">
            <IconSend class="icon fill-opacity-1" />NỘP BÀI
          </app-button>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="dtu-box">
        <div class="dtu-box__title">
          <h4 class="dtu-box__heading">Danh sách File</h4>
        </div>

        <div class="dtu-box__content pa-0">
          <template v-if="$fetchState.pending">
            <div v-for="i in 10" :key="i" class="pa-3">
              <VueContentLoading :width="300" :height="10">
                <rect x="0" y="0" rx="4" ry="4" :width="i%2 == 0 ? 180 : 220" height="10"></rect>
              </VueContentLoading>
            </div>
          </template>

          <template v-else>
            <template v-for="(item, index) in questions">
              <div
                v-if="item.upload_file && item.upload_file.type === 'IMAGE'"
                v-tooltip="`Nhấn để Phóng to ảnh`"
                class="dtu-question dtu-question--image"
                :key="index"
                @click="openModalPreview(item.upload_file || {}, index)"
              >
                <div class="mb-2">{{ index + 1 }}. File số {{ index + 1 }}</div>
                <img :src="item.upload_file && item.upload_file.link" alt />
              </div>

              <a
                v-else
                v-tooltip="`Nhấn để tải xuống:<br/><span class='text-primary'>${item.upload_file ? item.upload_file.name : ''}</span>`"
                class="dtu-question"
                download
                :href="item.upload_file && item.upload_file.link"
                :key="index"
                target="_blank"
              >{{ index + 1 }}. File số {{ index + 1 }}</a>
            </template>
          </template>
        </div>
      </div>
    </div>

    <app-modal
      v-model="modalPreview"
      :footer="false"
      width="auto"
      :title="modalPreviewData.title"
      @close="closeModalPreview"
    >
      <div slot="content">
        <img :src="modalPreviewData.image" alt />
      </div>
    </app-modal>

    <app-modal-confirm
      v-model="modalConfirmSubmit"
      title="Xác nhận nộp bài"
      description="Bạn có chắc chắn muốn nộp bài?"
      :confirm-loading="submitLoading"
      @ok="submit"
      @cancel="modalConfirmSubmit = false"
      @close="modalConfirmSubmit = false"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { VueContentLoading } from "vue-content-loading";
import { STUDY_EXERCISE_SUBMISSION as API_STUDY_EXERCISE_SUBMISSION } from "~/utils/endpoints";
import { ELEARNING_STUDY_EXERCISE as ACTION_ELEARNING_STUDY_EXERCISE } from "~/utils/action-types";
import { STUDY_MODE } from "~/utils/constants";
import { RESPONSE_SUCCESS } from "~/utils/config";
import IconImage from "~/assets/svg/v2-icons/image_24px.svg?inline";
import IconInsertDriveFile from "~/assets/svg/v2-icons/insert_drive_file_24px.svg?inline";
import IconCheckCircle from "~/assets/svg/v2-icons/check_circle_24px.svg?inline";
import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline";
import IconCloudUpload from "~/assets/svg/v2-icons/cloud_upload_24px.svg?inline";
import IconSend from "~/assets/svg/v2-icons/send_24px.svg?inline";
import ElearningExerciseSubmitSuccess from "~/components/page/elearning/study/v2/exercise/ElearningExerciseSubmitSuccess";

export default {
  components: {
    IconImage,
    IconInsertDriveFile,
    IconCheckCircle,
    IconClose,
    IconCloudUpload,
    IconSend,
    VueContentLoading,
    ElearningExerciseSubmitSuccess,
  },

  data() {
    return {
      modalPreview: false,
      modalPreviewData: {
        image: "",
        title: "",
      },
      answerFileList: [],
      modalConfirmSubmit: false,
      submitLoading: false,
    };
  },

  computed: {
    ...mapState("elearning/study/study-exercise", ["questions"]),
    ...mapState("event", ["studyMode"]),
  },

  created() {
    this.STUDY_MODE = STUDY_MODE;

    //
    const { test_id = "" } = this.$route.query || {};
    this.elearningStudyExerciseGetDetailExercise({
      test_id,
    }).then((result) => {
      console.log("dattest elearningStudyExerciseGetDetailExercise", result);
      const { data = {} } = result;
      this.setStudyExerciseCurrent({
        id: data.id,
        name: data.name,
      });
    });
  },

  async fetch() {
    const { test_id = "" } = this.$route.query || {};
    if (test_id) {
      await this.elearningSudyExerciseQuestionList({ test_id });
    }
  },

  fetchOnServer: false,

  methods: {
    ...mapActions("elearning/study/study-exercise", [
      "elearningSudyExerciseQuestionList",
      "elearningStudyExerciseGetDetailExercise",
    ]),
    ...mapMutations("elearning/study/study-exercise", [
      "setStudyExerciseCurrent",
    ]),
    ...mapMutations("event", ["setStudyMode"]),

    openModalPreview(file, index) {
      this.modalPreviewData = {
        image: file.link,
        title: `File số ${index + 1}`,
      };
      this.$nextTick(() => {
        this.modalPreview = true;
      });
    },

    closeModalPreview() {
      this.modalPreview = false;
      this.modalPreviewData = {};
    },

    handleUploadChange(files) {
      const arrFiles = Array.from(files);
      this.answerFileList = [...this.answerFileList, ...arrFiles];
    },

    removeImage(file, index) {
      this.answerFileList = this.answerFileList.filter(
        (item, i) => i !== index
      );
    },

    handleClickSubmit() {
      if (this.answerFileList.length) {
        this.modalConfirmSubmit = true;
      } else {
        this.$toasted.error("Bạn chưa upload câu trả lời nào");
      }
    },

    async submit() {
      try {
        this.submitLoading = true;
        const { test_id = "" } = this.$route.query || {};
        const result = await this.$store.dispatch(
          `elearning/study/study-exercise/${ACTION_ELEARNING_STUDY_EXERCISE.SUBMIT_UPLOAD_ANSWER}`,
          {
            test_id,
            files: this.answerFileList,
          }
        );

        if (result.success === RESPONSE_SUCCESS) {
          this.setStudyMode(STUDY_MODE.SUBMISSION_SUCCESS);
        }

        console.log("dattest submit result", result);
        this.submitLoading = false;
      } catch (error) {
        this.$toasted.error(error.message);
        this.submitLoading = false;
      }
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/pages/elearning/do-test/_do-test-upload.scss";
</style>