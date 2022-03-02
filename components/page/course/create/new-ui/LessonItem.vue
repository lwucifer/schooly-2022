<template>
  <div class="chapper-item">
    <div class="chapper-item__top">
      <div class="chapper-item__name">
        <!-- <template v-if="editNameToggle">
          <input
            ref="name"
            v-model="editedName"
            class="chapper-item__name-input"
            type="text"
          />
          <button
            class="chapper-item__btn chapper-item__btn--save"
            @click="handleEditChaperName"
          >
            <IconSave class="icon fill-opacity-1" />Lưu
          </button>
          <button
            class="chapper-item__btn chapper-item__btn--cancel"
            @click="editNameToggle = false"
          >
            <IconClear class="icon fill-opacity-1" />Huỷ
          </button>
        </template> -->

        <template>
          <h4 class="chapper-item__name-title">{{ name }}</h4>
          <button
            type="button"
            class="chapper-item__btn-edit-name"
          >
          </button>
        </template>
      </div>

    </div>

    <div class="chapper-item__content">
      <div
        class="chapper-item__learning-item"
      >
        <div class="chapper-item__learning-icon">
          <IconHeadset class="icon fill-opacity-1" v-if="lesson.type == 'AUDIO'" />
          <IconVideoCam
            class="icon fill-opacity-1"
            v-if="lesson.type == 'VIDEO'"
          />
          <IconFileCopy class="icon fill-opacity-1" v-if="lesson.type == 'DOCS'" />
          <IconViewList class="icon fill-opacity-1" v-else />
        </div>

        <div class="chapper-item__learning-text">
          <div class="chapper-item__learning-name">{{ lesson.name }}</div>
          <div class="chapper-item__learning-info">
            <span
              class="chapper-item__learning-info-item"
              v-for="(doc, index) in lesson.docs"
              :key="index"
            >
              Tên file:
              <span
                ><a :href="doc.url" target="_blank">{{ doc.name }}</a></span
              >
            </span>
            <span class="chapper-item__learning-info-item">
              Thời lượng:
              <span>{{ lesson.duration }}</span>
            </span>
          </div>
        </div>

        <div class="chapper-item__learning-right">
          <n-link to="/elearning/manager/exams" v-if="!!lesson.exercises"
            >{{ lesson.exercises }} Bài tập</n-link
          >
          <n-link :to="createExerciseUrl" v-else
            >Thêm bài tập</n-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconEdit from "~/assets/svg/v2-icons/edit_24px.svg?inline";
import IconArrowDropDownCircle from "~/assets/svg/v2-icons/arrow_drop_down_circle_24px.svg?inline";
import IconAddCircleOutline from "~/assets/svg/v2-icons/add_circle_outline_24px.svg?inline";
import IconClear from "~/assets/svg/v2-icons/clear_24px.svg?inline";
import IconSave from "~/assets/svg/v2-icons/save_24px.svg?inline";

import IconHeadset from "~/assets/svg/v2-icons/headset_24px.svg?inline";
import IconViewList from "~/assets/svg/v2-icons/view_list_24px.svg?inline";
import IconFileCopy from "~/assets/svg/v2-icons/file_copy_24px.svg?inline";
import IconVideoCam from "~/assets/svg/v2-icons/videocam_24px.svg?inline";

import { get } from "lodash";
import { mapActions } from 'vuex';
import * as actionTypes from "~/utils/action-types";
import { getParamQuery } from "~/utils/common";
import { createPayloadAddContentCourse } from "~/models/course/AddCourse";



export default {
  components: {
    IconEdit,
    IconArrowDropDownCircle,
    IconAddCircleOutline,
    IconHeadset,
    IconClear,
    IconSave,
    IconViewList,
    IconFileCopy,
    IconVideoCam
  },

  props: {
    lesson: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      collapsed: true,
      editNameToggle: false,
      editedName: '',
    };
  },

  computed: {
    name() {
      return get(this, "lesson.name", "");
    },
    createExerciseUrl() {
      const elearning_id = getParamQuery("elearning_id");
      return `/elearning/manager/exams/create-exercise?elearning_id=${elearning_id}`;
    }
    // lessons() {
    //   return [...get(this, "chapter.lessons", [])].sort(
    //     (a, b) => a.index - b.index
    //   );
    // }
  },

  methods: {
    ...mapActions("elearning/creating/creating-lesson", ["elearningCreatingLessonsList"]),

    async handleEditChaperName() {
      const data = {
        id: get(this, "chapter.id", ""),
        name: this.editedName,
      };

      const payload = createPayloadAddContentCourse(data);
      const result = await this.$store.dispatch(
        `elearning/creating/creating-chapter/${actionTypes.ELEARNING_CREATING_CHAPTER.EDIT}`,
        payload
      );

      if (get(result, "success", false)) {
        // this.$store.dispatch(`elearning/create/getContent`);
        this.$toasted.success(get(result, "message", "Thành công"));
        this.editNameToggle = false;

        const elearning_id = getParamQuery("elearning_id");
        this.elearningCreatingLessonsList({ elearning_id });
      } else {
        this.$toasted.error(get(result, "message", "Có lỗi xảy ra"));
      }

    },
    showEditName() {
      this.editNameToggle = true;
      this.editedName = this.name;
      const timeout = setTimeout(() => {
        this.$refs.name.focus();
        clearTimeout();
      });
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/create/_chapper-item.scss";
</style>
