<template>
  <div class="school-lesson-slider">
    <h3 class="school-lesson-slider__title" v-if="title">{{ title }}</h3>
    <div>
      <app-carousel :options="defaultSwiperOptions">
        <template slot="default" slot-scope="{ classes }">
          <div
            v-for="(lesson, index) in lessons"
            :key="index"
            :class="classes"
          >
            <school-lesson-item :lesson="lesson" />
          </div>
        </template>
      </app-carousel>
    </div>
  </div>
</template>

<script>
import { assignIn } from "lodash";
import SchoolLessonItem from "~/components/page/school/SchoolLessonItem";
import IconChevronLeft from "~/assets/svg/icons/chevron-left.svg?inline";
import IconChevronRight from "~/assets/svg/icons/chevron-right.svg?inline";

export default {
  components: {
    IconChevronLeft,
    IconChevronRight,
    SchoolLessonItem
  },

  props: {
    lessons: {
      type: Array,
      default: () => []
    },

    swiperOptions: {
      type: Object,
      default: () => {}
    },
    title: { type: String }
  },

  data() {
    const defaultSwiperOptions = {
      slidesPerView: 4,
      spaceBetween: 24,
      breakpoints: {
        1366: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
      },
      navigation: true,
      pagination: false,
      showName: false
    };

    return {
      defaultSwiperOptions,
      currentSwiperOptions: assignIn(defaultSwiperOptions, this.swiperOptions)
    };
  },

  methods: {
    showAll() {
      console.log("[Component] SchoolLessonSlider: click `Xem tat ca`");
      this.$emit("showAll");
    }
  },

  created() {}
};
</script>

<style lang="scss">
@import "~/assets/scss/components/school/_school-lesson-slider.scss";
</style>
