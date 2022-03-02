<template>
  <div class="school-course-slider">
    <h3 class="school-course-slider__title" v-if="title">{{ title }}</h3>
    <div>
      <app-carousel :options="defaultSwiperOptions">
        <template slot="default" slot-scope="{ classes }">
          <div
            v-for="(cource, index) in cources"
            :key="index"
            :class="classes"
          >
            <school-course-item :cource="cource" />
          </div>
        </template>
      </app-carousel>
    </div>
  </div>
</template>

<script>
import { assignIn } from "lodash";
import SchoolCourseItem from "~/components/page/school/SchoolCourseItem";
import IconChevronLeft from "~/assets/svg/icons/chevron-left.svg?inline";
import IconChevronRight from "~/assets/svg/icons/chevron-right.svg?inline";

export default {
  components: {
    IconChevronLeft,
    IconChevronRight,
    SchoolCourseItem
  },

  props: {
    cources: {
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
          spaceBetween: 24,
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
      currentSwiperOptions: assignIn(this.defaultSwiperOptions, this.swiperOptions)
    };
  },

  methods: {
    showAll() {
      console.log("[Component] SchoolCourseSlider: click `Xem tat ca`");
      this.$emit("showAll");
    }
  },

  created() {}
};
</script>

<style lang="scss">
@import "~/assets/scss/components/school/_school-course-slider.scss";
</style>
