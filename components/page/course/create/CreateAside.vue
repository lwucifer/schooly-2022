<template>
  <aside class="course-create-aside bg-white">
    <h4 class="cca-title">Đề mục</h4>

    <ul class="cca-checkbox-list">
      <li
        v-for="item in menu"
        :key="item.key"
        :class="{ active: item.checked }"
        @click="handleClickMenuItem(item)"
      >
        <app-checkbox-circle
          :value="item.key"
          :checked="item.checked"
          :disabled="false"
        >
          {{ item.title }}
          <span v-if="item.optional" class="cca-sub-text text-sub"
            >(Tùy chọn)</span
          >
        </app-checkbox-circle>
      </li>
    </ul>

    <div class="cca-action">
      <app-button
        :disabled="!is_submit"
        @click="handlePublishCourse"
        square
        full-width
        >Gửi lên</app-button
      >
    </div>

    <app-modal-confirm
      v-if="showModalConfirm"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      description="Bạn có chắc chắn là muốn gửi bài giảng này lên để kiểm duyệt?"
    />
  </aside>
</template>

<script>
import { mapState } from "vuex";
import { useEffect, getParamQuery } from "~/utils/common";
import { get, toBoolean } from "lodash";
import * as actionTypes from "~/utils/action-types";

const menu = [
  {
    key: "general",
    title: "Thông tin chung",
    optional: false,
    checked: false,
  },
  {
    key: "content",
    title: "Nội dung học tập",
    optional: false,
    checked: false,
  },
  {
    key: "settings",
    title: "Cài đặt",
    optional: false,
    checked: false,
  },
  {
    key: "exercise",
    title: "Bài tập",
    optional: true,
    checked: false,
  },
  {
    key: "exam",
    title: "Bài kiểm tra",
    optional: true,
    checked: false,
  },
];

export default {
  data() {
    return {
      menu,
      active: this.formActive,
      showModalConfirm: false,
      confirmLoading: false,
    };
  },

  mounted() {
    useEffect(this, this.handleChangeProgress.bind(this), ["progress"]);
  },

  props: {
    formActive: String,
  },

  computed: {
    ...mapState("elearning/create", {
      general: "general",
      progress: "progress",
      lessons_lecture: "lessons_lecture",
      chapters: "chapters",
      setting: "setting",
      lessons: "lessons",
      exams: "exams",
    }),
    is_submit() {
      if (get(this, "progress.elearning_status", "") === "APPROVED") {
        return false;
      }
      return (
        get(this, "progress.general_status", -1) == 1 &&
        get(this, "progress.content_status", -1) == 1 &&
        get(this, "progress.setting_status", -1) == 1
      );
    },
  },

  watch: {
    formActive: {
      handler: function() {
        if (this.formActive === "content-lecture") {
          this.active = "content";
          return;
        }
        if (this.formActive === "content-course") {
          this.active = "content";
          return;
        }
        this.active = this.formActive;
      },
      deep: true,
    },
  },

  methods: {
    handleChangeProgress() {
      let checked = get(this, "progress.general_status", false) == 1;
      this.menu[0]["checked"] = checked;
      checked = get(this, "progress.content_status", false) == 1;
      this.menu[1]["checked"] = checked;
      checked = get(this, "progress.setting_status", false) == 1;
      this.menu[2]["checked"] = checked;
      checked = get(this, "progress.exercise_status", false) == 1;
      this.menu[3]["checked"] = checked;
      checked = get(this, "progress.test_status", false) == 1;
      this.menu[4]["checked"] = checked;
    },
    handlePublishCourse() {
      this.showModalConfirm = true;
    },

    async handleOk() {
      this.confirmLoading = true;

      const elearning_id = getParamQuery("elearning_id");
      const data = {
        elearning_id,
      };

      const res = await this.$store.dispatch(
        `elearning/creating/creating-publish/${actionTypes.ELEARNING_CREATING_PUBLISH.POST}`,
        data
      );

      this.handleCancel();

      if (get(res, "success", false)) {
        this.$toasted.success("success");
        this.$router.push("/elearning/manager/courses");
        return;
      }

      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },

    handleCancel() {
      this.showModalConfirm = false;
      this.confirmLoading = false;
    },

    handleClickMenuItem({ key }) {
      if (key === "general") {
        this.active = key;
        this.$emit("click-item", key);
        return;
      }

      if (get(this, "progress.general_status", false) != 1) return;

      if (key === "content") {
        this.active = key;
        if (get(this, "general.type", "") === "LECTURE") {
          this.$emit("click-item", "content-lecture");
          return;
        }
        if (get(this, "general.type", "") === "COURSE") {
          this.$emit("click-item", "content-course");
          return;
        }
        return;
      }

      if (get(this, "progress.content_status", false) != 1) return;

      if (key === "settings") {
        this.active = key;
        this.$emit("click-item", key);
        return;
      }

      if (get(this, "progress.setting_status", false) != 1) return;

      this.active = key;
      this.$emit("click-item", key);
    },
  },
};
</script>
