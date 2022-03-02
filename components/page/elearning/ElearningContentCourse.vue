<template>
  <div>
    <div class="evlc-item mt-3 body-3">
      <div class="evlc-item__head">
        <div class="evlc-item__head-left mr-4">
          <b>Chương {{ index + 1 }}:</b> {{ get(chapter, "name", "") }}
        </div>

        <div
          class="evlc-item__head-right d-flex align-items-center ml-auto"
          @click="is_show_lesson = !is_show_lesson"
        >
          <span class="mr-3">{{ get(chapter, "lessons.length", 0) }} Bài</span>
          <button
            :class="{
              active: is_show_lesson,
              'evlc-item__btn': true,
              'evlc-item__btn-collapse': true,
            }"
          >
            <IconAngleDown class="icon fill-primary" />
          </button>
        </div>
      </div>

      <transition-group enter-active-class="animated faster fadeIn">
        <ElearningContentCourseItem
          v-for="lesson in get(chapter, 'lessons', [])"
          v-show="is_show_lesson"
          :key="lesson.id"
          :lesson="lesson"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
const IconFileAlt = () =>
  import("~/assets/svg/design-icons/file-alt.svg?inline");
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import { get } from "lodash";
import IconDownload from "~/assets/svg/icons/download.svg?inline";
import IconBooks from "~/assets/svg/icons/books.svg?inline";

import ElearningContentCourseItem from "~/components/page/elearning/ElearningContentCourseItem";
import { mapState } from "vuex";

export default {
  components: {
    IconFileAlt,
    IconAngleDown,
    IconBooks,
    IconDownload,
    ElearningContentCourseItem,
  },

  props: {
    index: {},
    chapter: {},
  },

  computed: {
    ...mapState("elearning/detail", {
      program: "program",
    }),
  },

  data() {
    return {
      is_show_lesson: false,
    };
  },

  methods: {
    get,
  },
};
</script>
