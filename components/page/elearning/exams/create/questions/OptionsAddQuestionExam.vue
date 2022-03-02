<template>
  <div class="opt-add-question">
    <ul class="list-opt">
      <li
        @click.prevent="handleAddQuestion(1)"
        v-if="active == 'choice' || active == 'all'"
      >
        <a href=""><IconHdrStrong24px class="mr-2 icon" /> Đúng / Sai</a>
      </li>
      <li
        @click.prevent="handleAddQuestion(2)"
        v-if="active == 'choice' || active == 'all'"
      >
        <a href=""><IconCheckCircle24px class="mr-2 icon" /> Một lựa chọn</a>
      </li>
      <li
        @click.prevent="handleAddQuestion(3)"
        v-if="active == 'choice' || active == 'all'"
      >
        <a href=""
          ><IconFormatListBulleted24px class="mr-2 icon" /> Nhiều lựa chọn</a
        >
      </li>
      <li
        @click.prevent="handleAddQuestion(4)"
        v-if="active == 'choice' || active == 'all'"
      >
        <a href=""><IconSwapHoriz24px class="mr-2 icon" /> Ghép đáp án</a>
      </li>
      <li
        @click.prevent="handleAddQuestion(6)"
        v-if="active == 'choice' || active == 'all'"
      >
        <a href=""><IconTextRotationNone24px class="mr-2 icon" /> Chọn từ</a>
      </li>
      <li
        @click.prevent="handleAddQuestion(5)"
        v-if="active == 'choice' || active == 'all'"
      >
        <a href=""><IconFontDownload24px class="mr-2 icon" /> Điền từ</a>
      </li>
      <li
        @click.prevent="handleAddQuestion(7)"
        v-if="active == 'essay' || active == 'all'"
      >
        <a href=""><IconMode24px class="mr-2 icon" /> Tự luận</a>
      </li>
      <li @click.prevent="handleBankQuestion" class="set-border-top">
        <a href=""><IconHelp24px class="mr-2 icon" /> Từ ngân hàng câu hỏi</a>
      </li>
      <!-- <li @click.prevent="handleBankExam" class="set-border-bottom">
        <a href=""
          ><IconImportContacts24px class="mr-2 icon" /> Từ ngân hàng đề thi</a
        >
      </li> -->
      <li @click.prevent="handleUploadExam">
        <a
          ><IconCloudUpload24px class="mr-2 icon" /> Upload đề thi</a
        >
      </li>
    </ul>
    <app-modal-confirm
      v-if="modal"
      @cancel="modal = false"
      @ok="handleOk"
      title="Xác nhận"
      description="Nếu bạn chọn hình thức upload cả đề thi, bạn sẽ phải tạo lại câu hỏi và đáp án từ đầu. Những câu hỏi bạn tạo ra trước đó sẽ bị xoá. Bạn có muốn tiếp tục?"
    />
  </div>
</template>

<script>
import IconHdrStrong24px from "~/assets/svg/v2-icons/hdr_strong_24px.svg?inline";
import IconCheckCircle24px from "~/assets/svg/v2-icons/check_circle_24px.svg?inline";
import IconFormatListBulleted24px from "~/assets/svg/v2-icons/format_list_bulleted_24px.svg?inline";
import IconSwapHoriz24px from "~/assets/svg/v2-icons/swap_horiz_24px.svg?inline";
import IconTextRotationNone24px from "~/assets/svg/v2-icons/text_rotation_none_24px.svg?inline";
import IconFontDownload24px from "~/assets/svg/v2-icons/font_download_24px.svg?inline";
import IconMode24px from "~/assets/svg/v2-icons/mode_24px.svg?inline";
import IconHelp24px from "~/assets/svg/v2-icons/help_24px.svg?inline";
import IconImportContacts24px from "~/assets/svg/v2-icons/import_contacts_24px.svg?inline";
import IconCloudUpload24px from "~/assets/svg/v2-icons/cloud_upload_24px.svg?inline";

export default {
  components: {
    IconHdrStrong24px,
    IconCheckCircle24px,
    IconFormatListBulleted24px,
    IconSwapHoriz24px,
    IconTextRotationNone24px,
    IconFontDownload24px,
    IconMode24px,
    IconHelp24px,
    IconImportContacts24px,
    IconCloudUpload24px,
  },

  props: {
    active: {
      type: String,
      default: "all",
    },
  },
  data() {
    return {
      modal: false,
      examId: this.$route.query ? this.$route.query.id : "",
      type: this.$route.query ? this.$route.query.type : "",
      category: this.$route.query ? this.$route.query.category : "",
    }
  },

  methods: {
    handleAddQuestion(_type) {
      console.log('handleAddQuestion', _type)
      this.$router.push(
        `/elearning/manager/bank/exams/create?category=${this.category}&type=${_type}&parent_id=${this.examId}`
      );
    },

    handleBankQuestion(){
      this.$router.push(
        `/elearning/manager/bank/exams/choose-from-bank?category=${this.category}&type=${this.type}&parent_id=${this.examId}`
      );
    },

    handleBankExam(){
      
    },

    handleUploadExam(){
      this.modal = true;
    },

    handleOk(){
      this.$router.push(
        `/elearning/manager/bank/exams/upload-exam?category=${this.category}&type=${this.type}&parent_id=${this.examId}`
      );
    }
  },
};
</script>

<style lang="scss">
@import "~assets/scss/components/elearning/manager/bank/exam/_options-add-question-exam.scss";
</style>
