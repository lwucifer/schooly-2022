<template>
  <div
    class="clc-choosen-doc-item d-flex align-items-center justify-content-between mb-3"
  >
    <span class="d-flex align-items-center">
      <IconFileBlank class="icon body-1 mr-2" />{{ get(doc, "name", "") }}
      (25.6kB)
    </span>

    <button @click="handleDeleteDoc($event)">
      <IconClose24px class="icon subheading" />
    </button>

    <app-modal-confirm
      v-if="showModalConfirm"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancelModal"
      title="Xóa tài liệu"
      description="Bạn có chắc chắn muốn xóa tài liệu này?"
    />
  </div>
</template>

<script>
import IconClose24px from "~/assets/svg/v2-icons/close_24px.svg?inline";
const IconFileBlank = () =>
  import("~/assets/svg/design-icons/file-blank.svg?inline");
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { mapState } from "vuex";

export default {
  components: {
    IconClose24px,
    IconFileBlank,
  },

  props: {
    doc: {
      type: Object,
    },
  },

  computed: {
    disabled_all() {
      return this.$store.getters["elearning/create/disabled_all"];
    },
  },

  data() {
    return {
      showModalConfirm: false,
      confirmLoading: false,
    };
  },

  methods: {
    async handleDeleteDoc(e) {
      e.preventDefault();
      if (this.disabled_all) return;
      this.showModalConfirm = true;
    },

    async handleOk() {
      if (this.disabled_all) return;
      this.confirmLoading = true;
      const doc_id = get(this, "doc.id", "");
      const options = {
        data: {
          id: doc_id,
        },
      };
      const result = await this.$store.dispatch(
        `elearning/creating/creating-doc/${actionTypes.ELEARNING_CREATING_DOC.DELETE}`,
        options
      );

      this.handleCancelModal();

      if (get(result, "success", false)) {
        this.$toasted.success(get(result, "message", "Thành công"));
        this.$store.dispatch(`elearning/create/getContent`);
        // this.$store.dispatch(`elearning/create/getProgress`);
        return;
      }
      this.$toasted.error(get(result, "message", "Có lỗi xảy ra"));
    },

    handleCancelModal() {
      if (this.disabled_all) return;
      this.showModalConfirm = false;
      this.confirmLoading = false;
    },

    get,
  },
};
</script>
