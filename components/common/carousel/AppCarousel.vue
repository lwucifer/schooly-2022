<template>
  <div class="app-carousel-wrapper">
    <div v-swiper:mySwiper="localOptions" class="app-carousel">
      <div class="swiper-wrapper">
        <slot :classes="`swiper-slide`"></slot>
      </div>
      <div class="swiper-pagination" v-if="localOptions.pagination"></div>
    </div>

    <button
      v-if="prevShow"
      type="button"
      class="app-carousel-prev"
      :disabled="prevDisabled"
      @click="handleClickPrev"
    >
      <IconAngleLeft class="icon" />
    </button>
    <button
      v-if="nextShow"
      type="button"
      class="app-carousel-next"
      :disabled="nextDisabled"
      @click="handleClickNext"
    >
      <IconAngleRight class="icon" />
    </button>
  </div>
</template>

<script>
const IconAngleLeft = () =>
  import("~/assets/svg/design-icons/angle-left.svg?inline");
const IconAngleRight = () =>
  import("~/assets/svg/design-icons/angle-right.svg?inline");

const defaultOptions = {
  init: false,
  spaceBetween: 24,
  updateOnWindowResize: true,
  // navigation: {
    // nextEl: ".app-carousel-next",
    // prevEl: ".app-carousel-prev"
  // }
};

export default {
  components: {
    IconAngleLeft,
    IconAngleRight
  },

  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      localOptions: {
        ...defaultOptions,
        ...this.options
      },
      prevShow: false,
      prevDisabled: false,
      nextShow: false,
      nextDisabled: false,
      
    };
  },

  mounted() {
    this.mySwiper.on("init", () => this.setNavigationState());
    this.mySwiper.on("slideChange", () => this.setNavigationState());
    this.mySwiper.init();
  },

  watch: {
    options(newValue = {}) {
      this.localOptions = {
        ...defaultOptions,
        ...newValue
      };
      this.$nextTick(() => {
        this.mySwiper && this.mySwiper.update();
      });
    }
  },

  methods: {
    handleClickPrev() {
      this.mySwiper.slidePrev();
    },

    handleClickNext() {
      this.mySwiper.slideNext();
    },

    setNavigationState() {
      const {
        allowSlidePrev,
        allowSlideNext,
        isBeginning,
        isEnd
      } = this.mySwiper;
      this.prevDisabled = isBeginning;
      this.nextDisabled = isEnd;
      this.prevShow = !(isEnd && isBeginning) && allowSlidePrev;
      this.nextShow = !(isEnd && isBeginning) && allowSlideNext;
    }
  }
};
</script>

<style src="swiper/dist/css/swiper.css"></style>
<style lang="scss">
@import "~/assets/scss/components/app/_app-carousel.scss";
</style>