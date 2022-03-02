<template>
  <section class="elearning-id-box elearning-view__content">
    <h4 class="mb-4">Nội dung {{ title }}</h4>
    <div class="row flex-wrap info body-4">
      <div class="col-auto">
        Trình độ:
        <strong class="color-primary">{{ get(info, "level.name", "") }}</strong>
      </div>
      <div class="col-auto">
        Môn học:
        <strong class="color-primary">
          {{ get(info, "subject.name", "") }}
        </strong>
      </div>
      <div class="col-auto">
        Số bài học:
        <strong class="color-primary">{{ get(info, "lessons", "0") }}</strong>
      </div>
      <div class="col-auto">
        Thời lượng:
        <strong class="color-primary">{{
          get(info, "duration", "01:00")
        }}</strong>
      </div>
    </div>

    <ElearningContentLecture v-if="get(info, 'type', '') === 'LECTURE'" />

    <div v-if="get(info, 'type', '') === 'COURSE'">
      <div
        v-for="(chapter, index_chapter) in program"
        :key="chapter.chapter_id"
      >
        <ElearningContentCourse :index="index_chapter" :chapter="chapter" />
      </div>
    </div>
  </section>
</template>

<script>
const IconFileAlt = () =>
  import("~/assets/svg/design-icons/file-alt.svg?inline");
import IconDownload from "~/assets/svg/icons/download.svg?inline";
import IconBooks from "~/assets/svg/icons/books.svg?inline";
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
const IconPlayCircle = () =>
  import("~/assets/svg/design-icons/play-circle.svg?inline");
import { get } from "lodash";
import { useEffect } from "~/utils/common";
import * as actionTypes from "~/utils/action-types";
import ElearningContentLecture from "~/components/page/elearning/ElearningContentLecture";
import ElearningContentCourse from "~/components/page/elearning/ElearningContentCourse";
import { mapState } from "vuex";

export default {
  components: {
    IconFileAlt,
    IconDownload,
    IconBooks,
    IconAngleDown,
    IconPlayCircle,
    ElearningContentLecture,
    ElearningContentCourse,
  },

  computed: {
    title() {
      switch (get(this, "info.type", "")) {
        case "LECTURE":
          return "bài giảng";
          break;
        case "COURSE":
          return "khoá học";
          break;
        default:
          break;
      }
    },
    ...mapState("elearning/detail", {
      info: "info",
      program: "program",
    }),
  },
  methods: {
    get,
  },
};
</script>
