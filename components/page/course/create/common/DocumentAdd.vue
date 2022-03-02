<template>
  <div class="cc-box__bg-gray">
    <div class="cc-box__bg-disable">
      <span class="heading-6 font-weight-semi-bold text-dark"
        >Thêm tài liệu tham khảo</span
      >
      <!-- <a href @click="handleCloseAdd($event)">
        <IconClose class="icon fill-gray" />
      </a> -->
    </div>

    <!-- <app-divider class="mt-3 mb-4" /> -->

    <div class="cc-box__bg-disable">
      <!-- <h3 class="heading-6 mb-2">Tên tài liệu</h3>
      <app-input v-model="payload.name" placeholder="Điền tên tài liệu" /> -->

      <div class="cc-tabs">
        <a
          href
          class="cc-tab-item"
          :class="{ active: tabAddDocument === 'upload' }"
          @click.prevent="changeTabAddDocument('upload')"
          >Upload tài liệu</a
        >

        <a
          href
          class="cc-tab-item"
          :class="{ active: tabAddDocument === 'choose' }"
          @click.prevent="changeTabAddDocument('choose')"
          >Chọn từ kho học liệu</a
        >
      </div>

      <DocumentSelectFile
        @handleSelectFile="handleSelectFile"
        v-if="tabAddDocument === 'upload'"
      />

      <DocumentSelectDoc
        descriptionModal="Bạn có chắc chắn muốn xóa tài liệu này?"
        @handleSelectUrl="handleSelectUrl"
        v-if="tabAddDocument === 'choose'"
        type="DOCS"
      />

      <div class="d-flex justify-content-end mt-4">
        <app-button
          class="clc-btn font-weight-semi-bold mr-4 text-secondary"
          size="md"
          color="default"
          outline
          @click="handleCloseAdd($event)"
          >Hủy</app-button
        >
        <app-button
          class="clc-btn font-weight-semi-bold"
          size="md"
          color="primary"
          @click="handleAddDocument"
          >Thêm tài liệu</app-button
        >
      </div>
    </div>

    <app-modal-confirm
      v-if="showModalConfirm"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancelModal"
      :okText="chagingBtnOk"
      :title="changingTitle"
      :description="chagingDescription"
    />
  </div>
</template>

<script>
const IconClose = () => import("~/assets/svg/icons/close.svg?inline");
const IconTrashAlt = () =>
  import("~/assets/svg/design-icons/trash-alt.svg?inline");
import DocumentSelectFile from "~/components/page/course/create/common/DocumentSelectFile";
import DocumentSelectDoc from "~/components/page/course/create/common/DocumentSelectDoc";
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { createPayloadAddDocument } from "~/models/course/AddCourse";
import { mapState } from "vuex";

export default {
  components: {
    IconClose,
    IconTrashAlt,
    DocumentSelectFile,
    DocumentSelectDoc,
  },

  props: {
    lesson: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      tabAddDocument: "upload",
      showModalConfirm: false,
      confirmLoading: false,
      payload: {
        doc: "",
        lesson_id: get(this, "lesson.id", ""),
        name: "",
        format: "",
        url: "",
      },
      modalType: "",
    };
  },

  computed: {
    disabled_all() {
      return this.$store.getters["elearning/create/disabled_all"];
    },
    changingTitle() {
      if (this.modalType == "upload") {
        return "Upload tài liệu";
      } else {
        return "Thêm tài liệu";
      }
    },

    chagingDescription() {
      if (this.confirmLoading) {
        return "File đang được tải lên, xin vui lòng không đóng cửa sổ này.";
      } else if (this.modalType == "url") {
        return "Bạn có chắc chắn muốn thêm file này từ kho học liệu?";
      }
      return "Bạn có chắc chắn muốn tải file này lên hệ thống?";
    },

    chagingBtnOk() {
      if (this.confirmLoading) {
        return "Đang tải";
      }
      return "Xác nhận";
    },
  },

  methods: {
    handleCloseAdd(e) {
      e.preventDefault();
      if (this.disabled_all) return;
      this.$emit("handleCloseAdd");
    },

    changeTabAddDocument(type) {
      if (this.disabled_all) return;
      this.tabAddDocument = type;
    },

    handleSelectFile(file) {
      if (this.disabled_all) return;
      this.modalType = "upload";
      this.payload.doc = file;
      this.payload.url = "";
      this.payload.format = "";
    },

    handleSelectUrl(file) {
      if (this.disabled_all) return;
      this.modalType = "url";
      this.payload.url = file.id;
      // this.payload.format = file.format;
      this.payload.doc = "";
    },

    async handleAddDocument() {
      if (this.disabled_all) return;
      this.showModalConfirm = true;
    },

    async handleOk() {
      if (this.disabled_all) return;
      this.confirmLoading = true;
      const payload = createPayloadAddDocument(this.payload);
      const result = await this.$store.dispatch(
        `elearning/creating/creating-doc/${actionTypes.ELEARNING_CREATING_DOC.ADD}`,
        payload
      );

      this.handleCancelModal();

      if (!get(result, "success", false)) {
        this.$toasted.error(get(result, "message", "Có lỗi xảy ra"));
        return;
      }
      this.$emit("handleCloseAdd");
      this.$store.dispatch(`elearning/create/getContent`);
      // this.$store.dispatch(`elearning/create/getProgress`);
      this.$toasted.success(get(result, "message", "Thành công"));
    },

    handleCancelModal() {
      if (this.disabled_all) return;
      this.showModalConfirm = false;
      this.confirmLoading = false;
    },
  },
};
</script>
