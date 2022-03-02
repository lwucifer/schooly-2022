<template>
  <div class="home-banner">
    <div class="container">
      <div class="home-banner__title">Học tập mọi lúc, mọi nơi <span>với Schoolly.</span></div>

      <div class="home-banner__text">Nền tảng học tập trực tuyến toàn diện <br>dành cho học sinh, giáo viên, nhà trường và các đơn vị giáo dục.</div>

      <app-button
        size="md"
        color="primary"
        class="home-banner__btn text-white"
        tag="a"
        target="_blank"
        :href="isLogin ? 'https://docs.google.com/forms/d/1KFVx4AUJ2sKBzp39BjYacbSbw-Fzi6PVhDMsrtlErek' :'/auth/signup'"
        >{{isLogin ? " Đăng ký giảng dạy" : "Tạo tài khoản"}}</app-button>
    </div>
  </div>
</template>

<script>

import BannerImage from "~/assets/svg/images/elearing-home-banner.svg?inline";

export default {
  components: {
    BannerImage
  },

  props: ["isLogin"]
};
</script>

<style lang="scss">
@import "~/assets/scss/components/home/_home-banner.scss";
</style>