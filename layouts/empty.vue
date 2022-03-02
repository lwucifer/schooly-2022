<template>
  <div class="page-wrap">
    <nuxt class="page-content" />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { TITLE_PAGE_DEFAULT } from "~/utils/config";

export default {
  name: "Empty",

  head() {
    if (this.$device.isMobile) {
      return {
        titleTemplate:
          this.countSumNoti > 0
            ? this.titlePg
              ? `(${this.countSumNoti}) ${this.titlePg}`
              : `(${this.countSumNoti}) ${TITLE_PAGE_DEFAULT}`
            : this.titlePg
            ? this.titlePg
            : TITLE_PAGE_DEFAULT,
        meta: [
          {
            hid: "viewport",
            name: "viewport",
            // content: "width=1200, user-scalable=yes",
            content: "width=device-width, user-scalable=no, initial-scale=1"
          },
        ],
      };
    } else {
      const tmp =
        this.countSumNoti > 0
          ? this.titlePg
            ? `(${this.countSumNoti}) ${this.titlePg}`
            : `(${this.countSumNoti}) ${TITLE_PAGE_DEFAULT}`
          : this.titlePg
          ? this.titlePg
          : TITLE_PAGE_DEFAULT;
      return {
        titleTemplate: tmp,
      };
    }
  },

  computed: {
    ...mapState(["desktopView"]),
    ...mapGetters("common", ["titlePg"]),
    ...mapGetters("elearning/study/notifications", ["countSumNoti"]),
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/layouts/_create.scss";
</style>
