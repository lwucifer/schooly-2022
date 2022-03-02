<template>
    <div class="home-mobile text-center">
        <div class="container">
          <div class="home-mobile__logo mb-4">
            <IconLogo width="245px" height="66px"/>
          </div>

          <h4 class="home-mobile__title">Hệ thống giáo dục và đào tạo trực <span>tuyến toàn diện</span></h4>

          <div class="home-mobile__download">
            <p class="intro mb-4">Tải ứng dụng trên điện thoại</p>

            <a href="https://apps.apple.com/vn/app/schoolly/id1488579731" target="_blank" class="appstore d-block mb-4"><img src="/images/appstore.png" alt=""></a>

            <a href="https://play.google.com/store/apps/details?id=vn.famtech.schoolly" target="_blank" class="d-block"><img src="/images/playstore.png" alt=""></a>
          </div>

          <div class="home-mobile__link">
            <a href @click="switchToDesktopView">Xem Schoolly phiên bản desktop</a>
          </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import IconLogo from "~/assets/svg/logo/schoolly.svg?inline";
import { setDesktopView } from "~/utils/common";

export default {
  name: "HomeMobile",

  components: {
    IconLogo
  },

  methods: {
    switchToDesktopView() {
      setDesktopView(1);
      this.$store.commit('setDesktopView', true);
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
@import "~assets/scss/components/home/_home-mobile.scss";
</style>