<template>
  <div class="chapter-item">
    <div
      class="d-flex align-items-center justify-content-between mb-3 ce-item--modifer"
    >
      <EditChapterName :chapter="chapter" :index="index" />

      <div class="ce-item__right d-flex align-items-center">
        <a @click.prevent="toggleShowAddLesson">Thêm bài học</a>
        <button
          class="cc-box__btn cc-box__btn-collapse"
          @click="isShowLesson = !isShowLesson"
        >
          <IconAngleDown
            class="fill-primary"
            width="20px"
            height="20px"
            v-if="!isShowLesson"
          />
          <IconAngleUp class="fill-primary" width="20px" height="20px" v-else />
        </button>
      </div>
    </div>

    <AddLesson
      v-if="isShowCreateLessonOfChapter"
      :chapter="chapter"
      @toggleShowAddLesson="toggleShowAddLesson"
    />

    <div v-if="isShowLesson">
      <LessonDetail
        class="list-lesson"
        v-for="(lesson, index) in lessons"
        :key="lesson.id"
        :index="index"
        :lesson="lesson"
      />
    </div>

    <!-- <app-divider class="my-0" /> -->
  </div>
</template>

<script>
import IconEditAlt from "~/assets/svg/design-icons/edit-alt.svg?inline";
import { getParamQuery } from "~/utils/common";
const IconTrashAlt = () =>
  import("~/assets/svg/design-icons/trash-alt.svg?inline");
import { get, toNumber, cloneDeep, orderBy } from "lodash";
import * as actionTypes from "~/utils/action-types";
import AddLesson from "~/components/page/course/create/course/AddLesson";
import EditChapterName from "~/components/page/course/create/course/EditChapterName";
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import IconAngleUp from "~/assets/svg/design-icons/angle-up.svg?inline";
import LessonDetail from "~/components/page/course/create/common/LessonDetail";
import { mapState } from "vuex";

export default {
  components: {
    IconEditAlt,
    IconTrashAlt,
    AddLesson,
    IconAngleDown,
    IconAngleUp,
    LessonDetail,
    EditChapterName,
  },

  data() {
    return {
      isShowCreateLessonOfChapter: false,
      isShowLesson: true,
    };
  },

  computed: {
    ...mapState("elearning/create", {
      general: "general",
    }),
    disabled_all() {
      return this.$store.getters["elearning/create/disabled_all"];
    },
    lessons() {
      let lessons = cloneDeep(get(this, "chapter.lessons", []));
      lessons = orderBy(lessons, "index", "asc");
      return lessons;
    },
  },

  props: {
    index: {
      type: Number,
      default: 0,
    },
    chapter: {
      type: Object,
      default: null,
    },
  },

  methods: {
    get,

    setIndex(lessons) {
      let index = 0;
      lessons.map((lesson) => {
        if (toNumber(get(lesson, "index", 0)) > index) {
          index = toNumber(get(lesson, "index", 0));
        }
      });
      return index + 1;
    },

    toggleShowAddLesson() {
      if (this.disabled_all) return;
      this.isShowCreateLessonOfChapter = !this.isShowCreateLessonOfChapter;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/course/create/_chapter-item.scss";
</style>
