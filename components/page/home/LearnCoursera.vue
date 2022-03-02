<template>
  <div class="learn-coursera">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-5">
          <div class="learn-coursera__img">
            <IconPlayCircleFilled width="64px" height="64px" />
          </div>
        </div>

        <div class="col-12 col-md-7">
          <div class="learn-coursera__text">
            <div class="text-title">Nền tảng học tập trực tuyến toàn diện</div>

            <div
              class="content"
            >Schoolly là hệ thống E-learning duy nhất hiện nay đáp ứng đầy đủ và hiệu quả các nhu cầu của việc học trực tuyến tại trường Phổ thông cho nhiều đối tượng tham gia: học sinh, giáo viên, nhà trường.</div>

            <app-button
            size="md"
            color="primary"
            class="text-white"
            tag="a"
            target="_blank"
            :href="isLogin ? 'https://docs.google.com/forms/d/1KFVx4AUJ2sKBzp39BjYacbSbw-Fzi6PVhDMsrtlErek' :'/auth/signup'"
            >{{isLogin ? " Đăng ký giảng dạy" : "Tạo tài khoản"}}</app-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconPlayCircleFilled from "~/assets/svg/v2-icons/play_circle_filled.svg?inline";

export default {
  components: {
    IconPlayCircleFilled
  },

  props: ["isLogin"]
};
</script>

<style lang="scss">
@import "~/assets/scss/components/home/_learn-coursera.scss";
</style>