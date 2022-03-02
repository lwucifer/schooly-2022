<template>
  <div class="container">
    <component :is="errorPage" :error="error" />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import error404 from "~/components/layout/error/404.vue";
import { TITLE_PAGE_DEFAULT } from "~/utils/config";
export default {
  name: "page-error",
  layout: "default", // optional
  props: {
    error: {
      type: Object,
      default: () => {},
    },
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

    errorPage() {
      if (this.error.statusCode === 404) {
        return error404;
      }
    },
  },
};
</script>

<style></style>
