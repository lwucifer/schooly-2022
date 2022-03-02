<template>
  <div class="cc-box__bg-gray">
    <h3 class="heading-6 mb-2 mt-3">
      <!-- Chương {{ get(chapters, "length", 0) + 1 }} -->
      Tên chương
      <span class="text-base font-weight-normal">(Tối đa 80 ký tự)</span>
    </h3>
    <app-input :counter="80" placeholder="Tên chương" v-model="payload.name" />
    <app-error :error="error.name"></app-error>

    <div class="d-flex justify-content-end mt-4">
      <app-button
        class="clc-btn font-weight-semi-bold mr-4 text-secondary"
        size="md"
        color="default"
        outline
        @click="$emit('hide')"
      >Huỷ</app-button>
      <app-button
        class="clc-btn font-weight-semi-bold"
        size="md"
        @click="handleOk"
        :disabled="!submit"
        :loading="loadingAdd"
      >Thêm chương</app-button>
    </div>
  </div>
</template>

<script>
import { getParamQuery } from "~/utils/common";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      payload: {
        elearning_id: "",
        name: "",
      },
      error: {
        name: "",
      },
      loadingAdd: false,
    };
  },

  computed: {
    ...mapState("elearning/create", {
      chapters: "chapters",
    }),
    submit() {
      return !!this.payload.name;
    },
  },

  watch: {
    "payload.name": {
      handler: function () {
        if (!this.payload.name) {
          return (this.error.name = "Bạn cần nhập tên chương");
        }

        if (this.payload.name.length > 80) {
          return (this.error.name = "Tên chương chỉ được tối đa 80 ký tự");
        }

        return (this.error.name = "");
      },
      deep: true,
    },
  },

  methods: {
    ...mapActions("elearning/study/study-progress", [
      "elearningSudyProgressProgramList",
    ]),

    async handleOk() {
      this.loadingAdd = true;
      const elearning_id = getParamQuery("elearning_id");
      const options = {
        params: {
          elearning_id,
        },
      };
      this.payload.elearning_id = elearning_id;
      const res = await this.$store.dispatch(
        `elearning/creating/creating-chapter/${actionTypes.ELEARNING_CREATING_CHAPTER.ADD}`,
        this.payload
      );

      if (get(res, "success", false)) {
        this.$toasted.success(get(res, "message", "Thành công"));
        this.payload.name = "";
        this.$emit("hide");
        // this.$store.dispatch(`elearning/create/getContent`);
        // this.$store.dispatch(`elearning/study/study-progress/elearningSudyProgressProgramList`, { elearning_id });
        const elearning_id = getParamQuery("elearning_id");
        this.elearningSudyProgressProgramList({ elearning_id });
      } else {
        this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
      }

      this.loadingAdd = false;
    },

    get,
  },
};
</script>
