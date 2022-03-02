<template>
  <div v-swiper:mySwiper="swiperOptions" class="slider-banner">
    <div class="swiper-wrapper">
      <div class="swiper-slide slider-banner-container" v-for="(image, index) in images" :key="index">
        <img :src="image" />
      </div>
    </div>
    <div class="slider-banner-container swiper-arrow-wrapper">
      <div class="swiper-button-prev">
        <IconChevronLeft />
      </div>
      <div class="swiper-button-next">
        <IconChevronRight />
      </div>
    </div>
  </div>
</template>

<script>
import IconChevronLeft from "~/assets/svg/icons/chevron-left.svg?inline";
import IconChevronRight from "~/assets/svg/icons/chevron-right.svg?inline";

export default {
  components: {
    IconChevronLeft,
    IconChevronRight
  },

  props: {
    images: {
      type: Array,
      default: () => [],
      required: true
    },

    swiperOptions: {
      type: Object,
      default: () => ({
        loop: true,
        slidesPerView: "auto",
        centeredSlides: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      })
    }
  },
};
</script>

<style src="swiper/dist/css/swiper.css"></style>

<style lang="scss">
@import "~/assets/scss/components/UI/_slider-banner.scss";
</style>