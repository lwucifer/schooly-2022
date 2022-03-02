<template>
  <div class="page-wrap layout-default">
    <HeaderDoExam />

    <nuxt class="page-content" />

    <Footer />

    <portal-target name="modal" multiple></portal-target>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import HeaderDoExam from "~/components/layout/header/HeaderDoExam";
import Footer from "~/components/layout/footer/Footer";
import { TITLE_PAGE_DEFAULT } from "~/utils/config";

export default {
  middleware: ["authenticated"],

  components: {
    HeaderDoExam,
    Footer,
  },

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
            content: "user-scalable=no"
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

  methods: {
    ...mapMutations("event", ["setIsVisibility"]),
  },

  mounted() {
    console.log("[exams]");

    const self = this;
    document &&
      document.addEventListener("visibilitychange", (event) => {
        // console.log("[exams] visibilitychange", document.visibilityState);
        const isVisible = document.visibilityState == "visible";
        self.setIsVisibility(isVisible);
      });
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/layouts/_default.scss";
</style>
