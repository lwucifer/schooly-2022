<template>
  <div class="ce-item__left d-flex align-items-center">
    <div class="mr-3 d-flex align-items-center">
      <strong>Chương {{ index + 1 }}:</strong>
      <input
        v-if="isEditChaperName"
        v-model="chaperNameModel"
        ref="inputChaperName"
        class="cc-box__input-title bg-input-gray mb-0"
        type="text"
        maxlength="60"
      />

      <h3 v-else class="d-inline-block body-2 mx-3 cc-box__title">
        <span class="font-weight-normal">{{ get(chapter, "name", "") }}</span>
      </h3>
    </div>

    <template v-if="isEditChaperName">
      <button
        class="cc-box__btn mr-3 text-success d-flex align-items-center w-50"
        @click="handleEditChaperName"
      >
        <IconSave24px class="mr-2 fill-primary" /> Lưu
      </button>
      <button
        class="cc-box__btn mr-3 text-secondary d-flex align-items-center w-50"
        @click="cancelEditChapterName"
      >
        <IconClose24px class="mr-2 fill-secondary" />Huỷ
      </button>
    </template>

    <template v-else>
      <a href class="ce-item__action edit mr-3" @click.prevent="editChaperName">
        <IconBorderColor24px
          width="18px"
          height="18px"
          class="d-block subheading fill-primary"
        />
      </a>

      <a
        href
        class="ce-item__action delete mr-3"
        @click.prevent="handleDeleteChapter"
      >
        <IconTrashAlt
          class="fill-secondary d-block subheading"
          width="16px"
          height="16px"
        />
      </a>
    </template>
    <app-modal-confirm
      centered
      v-if="showModalConfirm"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancelModal"
      description="Bạn có chắc chắn muốn xóa chương này?"
    />
  </div>
</template>

<script>
import { string } from "yup";
import { get, toNumber } from "lodash";
import IconBorderColor24px from "~/assets/svg/v2-icons/border_color_24px.svg?inline";
import IconTrashAlt from "~/assets/svg/icons/trash-alt.svg?inline";
import IconSave24px from "~/assets/svg/v2-icons/save_24px.svg?inline";
import IconClose24px from "~/assets/svg/v2-icons/close_24px.svg?inline";
import { mapState } from "vuex";
import { useEffect, getParamQuery } from "~/utils/common";
import * as actionTypes from "~/utils/action-types";
import { createPayloadAddContentCourse } from "~/models/course/AddCourse";

export default {
  components: {
    IconBorderColor24px,
    IconTrashAlt,
    IconSave24px,
    IconClose24px,
  },
  props: {
    chapter: {
      type: Object,
      default: null,
    },
    index: {},
  },
  data() {
    return {
      chaperNameModel: "",
      isEditChaperName: false,
      showModalConfirm: false,
      confirmLoading: false,
    };
  },

  computed: {
    disabled_all() {
      return this.$store.getters["elearning/create/disabled_all"];
    },
  },

  mounted() {
    useEffect(this, this.handleChangeDefaultName.bind(this), ["chapter"]);
  },

  methods: {
    get,
    handleChangeDefaultName() {
      this.chaperNameModel = this.chapter.name;
    },
    async handleDeleteChapter() {
      if (this.disabled_all) return;
      this.showModalConfirm = true;
    },
    async handleCancelModal() {
      if (this.disabled_all) return;
      this.showModalConfirm = false;
      this.confirmLoading = false;
    },
    async handleOk() {
      if (this.disabled_all) return;
      this.confirmLoading = true;
      const payload = {
        id: get(this, "chapter.id", ""),
      };
      const res = await this.$store.dispatch(
        `elearning/creating/creating-chapter/${actionTypes.ELEARNING_CREATING_CHAPTER.DELETE}`,
        payload
      );

      this.handleCancelModal();

      if (get(res, "success", false)) {
        this.$store.dispatch(`elearning/create/getContent`);
        // this.$store.dispatch(`elearning/create/getProgress`);
        this.$toasted.success(get(res, "message", "Thành công"));
        return;
      }
      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },
    editChaperName() {
      if (this.disabled_all) return;
      this.isEditChaperName = true;
      const timeout = setTimeout(() => {
        this.$refs.inputChaperName.focus();
        clearTimeout(timeout);
      });
    },
    cancelEditChapterName() {
      if (this.disabled_all) return;
      this.isEditChaperName = false;
    },
    async handleEditChaperName() {
      if (this.disabled_all) return;
      const data = {
        id: get(this, "chapter.id", ""),
        name: this.chaperNameModel,
      };

      const payload = createPayloadAddContentCourse(data);
      const result = await this.$store.dispatch(
        `elearning/creating/creating-chapter/${actionTypes.ELEARNING_CREATING_CHAPTER.EDIT}`,
        payload
      );

      if (get(result, "success", false)) {
        this.$store.dispatch(`elearning/create/getContent`);
        this.$toasted.success(get(result, "message", "Thành công"));
        this.isEditChaperName = false;
        return;
      }

      this.$toasted.error(get(result, "message", "Có lỗi xảy ra"));
    },
  },
};
</script>

<style></style>
