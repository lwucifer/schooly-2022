<template>
  <div class="course-slider-tab">
    <div class="toolbar">
      <h3 v-if="title">{{ title }}</h3>
      <app-button
        @click="changeTab(1)"
        :color="tab === 1 ? 'primary' : 'info'"
        square
      >
        <IconNote />
        Bài giảng
      </app-button>
      <app-button
        @click="changeTab(2)"
        :color="tab === 2 ? 'primary' : 'info'"
        square
      >
        <IconBooks />
        Khóa học
      </app-button>
    </div>
    <div style="position: relative;">
      <div
        ref="swiper"
        v-swiper="currentSwiperOptions"
        v-on="$listeners"
        :instanceName="sliderName"
      >
        <div class="swiper-wrapper">
          <div
            class="swiper-slide"
            v-for="(item, index) in list"
            :key="index"
          >
            <course-item2 :item="item" />
          </div>
        </div>

        <div
          class="swiper-pagination"
          v-if="currentSwiperOptions.pagination"
        ></div>
      </div>

      <div
        class="swiper-button-custom swiper-button-prev--circle"
        v-if="currentSwiperOptions.navigation"
        slot="button-prev"
        @click="swiper.slidePrev()"
      >
        <IconChevronLeft />
      </div>
      <div
        class="swiper-button-custom swiper-button-next--circle"
        v-if="currentSwiperOptions.navigation"
        slot="button-next"
        @click="swiper.slideNext()"
      >
        <IconChevronRight />
      </div>
    </div>
  </div>
</template>

<script>
import { assignIn } from "lodash";
import CourseItem2 from "~/components/page/course/CourseItem2";
import IconChevronLeft from "~/assets/svg/icons/chevron-left.svg?inline";
import IconChevronRight from "~/assets/svg/icons/chevron-right.svg?inline";
import IconBooks from "~/assets/svg/icons/books.svg?inline";
import IconNote from "~/assets/svg/icons/note.svg?inline";
import { get } from "lodash";
import Loading from "~/components/common/contentBox/Loading";

export default {
  components: {
    IconChevronLeft,
    IconChevronRight,
    IconBooks,
    IconNote,
    CourseItem2,
    Loading,
  },

  props: {
    elearnings: {
      // type: Object,
      default: null,
    },

    swiperOptions: {
      type: Object,
      default: () => {},
    },

    title: { type: String },
  },

  computed: {
    sliderName() {
      return "slider-" + new Date().getTime();
    },
    swiper: {
      get() {
        return this.$refs.swiper.swiper;
      },
      set() {},
    },
  },

  data() {
    const defaultSwiperOptions = {
      slidesPerView: "auto",
      spaceBetween: 4,
      navigation: true,
      pagination: false,
      showName: false,
      loop: true,
      breakpoints: {
        1366: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 4,
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
    };

    return {
      defaultSwiperOptions,
      currentSwiperOptions: assignIn(defaultSwiperOptions, this.swiperOptions),
      tab: 1,
      list: [],
    };
  },

  methods: {
    changeTab(tab) {
      this.tab = tab;
      this.list =
        tab === 1
          ? get(this, "elearnings.lectures", [])
          : get(this, "elearnings.courses", []);
    },
  },

  watch: {
    elearnings: {
      handler: function() {
        this.list =
          this.tab === 1
            ? get(this, "elearnings.lectures", [])
            : get(this, "elearnings.courses", []);
      },
      deep: true,
    },
  },

  mounted() {
    this.list = get(this, "elearnings.lectures", []);
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/_course-slider-tab.scss";
</style>

<style src="swiper/dist/css/swiper.css" scoped></style>
