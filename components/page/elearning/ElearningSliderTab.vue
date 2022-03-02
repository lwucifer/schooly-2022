<template>
  <div class="elearning-slider-tab">
    <h3 class="elearning-slider-tab__title mb-3" v-if="title">{{ title }}</h3>

    <div
      v-show="content.length"
      v-swiper:mySwiper="currentSwiperOptions"
      class="post-slider elearning-slider"
      v-on="$listeners"
    >
      <div class="swiper-wrapper">
        <div
          class="swiper-slide elearning-slider-tab-container"
          v-for="(item, index) in content"
          :key="index"
        >
          <div class="slider-item" @click="$emit('click-item', item, index)">
            <CourseItem2 size="sm" :item="item" />
          </div>
        </div>
      </div>

      <div class="swiper-button-prev" v-if="currentSwiperOptions.navigation">
        <IconChevronLeft class="icon" />
      </div>
      <div class="swiper-button-next" v-if="currentSwiperOptions.navigation">
        <IconChevronRight class="icon" />
      </div>
      <div
        class="swiper-pagination"
        v-if="currentSwiperOptions.pagination"
      ></div>
    </div>

    <div v-show="!content.length" class="text-center text-sub">
      Không có dữ liệu
    </div>
  </div>
</template>

<script>
import { get, assignIn } from "lodash";
import CourseItem2 from "~/components/page/course/CourseItem2.vue";
import IconChevronLeft from "~/assets/svg/icons/chevron-left.svg?inline";
import IconChevronRight from "~/assets/svg/icons/chevron-right.svg?inline";
import IconBooks from "~/assets/svg/icons/books.svg?inline";
import IconNote from "~/assets/svg/icons/note.svg?inline";

export default {
  components: {
    IconChevronLeft,
    IconChevronRight,
    IconBooks,
    IconNote,
    CourseItem2,
  },

  props: {
    content: {
      type: Array,
      default: () => [],
    },
    swiperOptions: {
      type: Object,
      default: () => ({}),
    },
    title: { type: String },
  },

  data() {
    const defaultSwiperOptions = {
      slidesPerView: "auto",
      spaceBetween: 4,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: false,
    };

    return {
      defaultSwiperOptions,
      currentSwiperOptions: assignIn(defaultSwiperOptions, this.swiperOptions),
      tab: 1,
      list: [],
    };
  },

  methods: {
    get,
  },
};
</script>

<style src="swiper/dist/css/swiper.css"></style>
<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-slider-tab.scss";
</style>
