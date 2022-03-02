<template>
  <div class="elearning-home-banner">
    <div class="container">
      <div class="row">
        <div class="col-md-7 align-self-center py-5">
          <h1 class="elearning-home-banner__title">
            <div>Học tập mọi lúc, mọi nơi</div>với Schoolly.
          </h1>

          <p class="elearning-home-banner__subtitle">Nền tảng học tập trực tuyến toàn diện <br>dành cho học sinh, giáo viên, nhà trường và các đơn vị giáo dục.</p>
        </div>

        <div class="col-md-5 align-self-end">
          <BannerImage class="elearning-home-banner__img" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BannerImage from "~/assets/svg/images/elearing-home-banner.svg?inline";

export default {
  components: {
    BannerImage
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/home/_elearning-home-banner.scss";
</style>