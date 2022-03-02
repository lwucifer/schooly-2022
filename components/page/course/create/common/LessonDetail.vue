<template>
  <div class="mb-4">
    <LessonDetailInfo
      v-if="isShowDetailLesson"
      @handleEditLesson="handleEditLesson"
      :lesson="lesson"
      :index="index"
    />

    <div v-else>
      <UpdateLessonChapter
        :lesson="lesson"
        @toggleShowAddLesson="toggleShowLesson"
        v-if="get(general, 'type', '') === 'COURSE'"
      />
      <UpdateLesson
        @toggleShowAddLesson="toggleShowLesson"
        :lesson="lesson"
        v-if="get(general, 'type', '') === 'LECTURE'"
      />
    </div>

    <!-- <app-divider class="my-4" /> -->

    <p
      class="mt-4 mb-3 heading-6"
      v-if="
        (lesson.lesson_docs && lesson.lesson_docs.length > 0) ||
          (lesson.lesson_videos && lesson.lesson_videos.length > 0)
      "
    >
      Tài liệu tham khảo
    </p>

    <DocumentDetail
      v-for="doc in get(lesson, 'lesson_docs', [])"
      :key="doc.id"
      :doc="doc"
    />

    <DocumentAdd
      :lesson="lesson"
      v-if="isShowFormAddDocument"
      @handleCloseAdd="handleCloseAdd"
    />

    <!-- <app-button
      size="sm"
      outline
      square
      class="font-weight-semi-bold clc-btn-add-docs"
      
    >
      
    </app-button> -->

    <button
      class="text-primary mt-3 d-flex align-content-center"
      v-if="isShowButtonAddDocument"
      @click="handleAddDocument"
    >
      <IconPlus class="mr-3"></IconPlus><span>Thêm tài liệu</span>
    </button>
  </div>
</template>

<script>
import IconEditAlt from "~/assets/svg/design-icons/edit-alt.svg?inline";
const IconTrashAlt = () =>
  import("~/assets/svg/design-icons/trash-alt.svg?inline");
import IconPlus from "~/assets/svg/v2-icons/add_green.svg?inline";
import { useEffect, getParamQuery } from "~/utils/common";
import * as actionTypes from "~/utils/action-types";
import { mapState } from "vuex";
const IconClose = () => import("~/assets/svg/icons/close.svg?inline");
import { get } from "lodash";
import DocumentAdd from "~/components/page/course/create/common/DocumentAdd";
import DocumentDetail from "~/components/page/course/create/common/DocumentDetail";
import UpdateLessonChapter from "~/components/page/course/create/course/AddLesson";
const IconFileBlank = () =>
  import("~/assets/svg/design-icons/file-blank.svg?inline");
import LessonDetailInfo from "~/components/page/course/create/common/LessonDetailInfo";
import UpdateLesson from "~/components/page/course/create/lecture/AddLesson";

export default {
  components: {
    IconEditAlt,
    IconTrashAlt,
    IconPlus,
    IconClose,
    DocumentAdd,
    IconFileBlank,
    DocumentDetail,
    UpdateLessonChapter,
    LessonDetailInfo,
    UpdateLesson,
  },

  data() {
    return {
      isShowFormAddDocument: false,
      isShowButtonAddDocument: true,
      isShowDetailLesson: true,
    };
  },

  mounted() {
    // console.log(this.lesson);
  },

  computed: {
    ...mapState("elearning/create", {
      general: "general",
    }),
    disabled_all() {
      return this.$store.getters["elearning/create/disabled_all"];
    },
  },

  props: {
    lesson: {
      type: Object,
      default: null,
    },
    index: {
      type: Number,
      default: null,
    },
  },

  methods: {
    toggleShowLesson() {
      if (this.disabled_all) return;
      this.isShowDetailLesson = !this.isShowDetailLesson;
    },

    handleCloseAdd() {
      if (this.disabled_all) return;
      this.isShowFormAddDocument = false;
      this.isShowButtonAddDocument = true;
    },

    handleAddDocument() {
      if (this.disabled_all) return;
      this.isShowFormAddDocument = true;
      this.isShowButtonAddDocument = false;
    },

    handleEditLesson() {
      if (this.disabled_all) return;
      this.isShowDetailLesson = false;
    },

    handleCancel() {
      //
    },

    get,
  },
};
</script>
