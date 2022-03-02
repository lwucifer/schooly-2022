<template>
  <h3 class="container">Đang chuyển hướng, vui lòng chờ...</h3>
</template>

<script>
import { RESPONSE_SUCCESS } from "~/utils/config";
import * as constants from "~/utils/constants";
import { mapGetters, mapActions } from "vuex";
import { setFirebaseToken } from "~/utils/auth";
import { createRegisterDeviceModel } from "~/models/notifications/RegisterDevice";

export default {
  data() {
    return {
      prevRoute: null
    };
  },

  beforeRouteEnter(to, from, next) {
    console.log("[beforeRouteEnter]", { to, from, next });
    next(vm => {
      vm.prevRoute = from.path;
    });
  },

  computed: {
    ...mapGetters("auth", ["userId"])
  },

  async mounted() {
    console.log("[mounted]", this.$route.query);
    const { code } = this.$route.query;
    if (!code) return;

    const loginGg = () => this.$store.dispatch("auth/loginGoogle", { code });
    const result = await loginGg();

    console.log("[loginGg] mounted", result);
    if (result.success == RESPONSE_SUCCESS) {
      if (!this.prevRoute || constants.PREV_ROUTE.includes(this.prevRoute)) {
        this.$router.push("/");
      } else if (this.prevRoute != `/${this.userId}/info`) {
        this.$router.push(`/${this.userId}/info`);
      } else {
        this.$router.go(-1);
      }
    } else {
      this.$toasted.error(`${result.message}`);
      this.$router.push("/auth/signin");
    }
  },

  methods: {
    ...mapActions("notifications", ["registerDevice"]),

    getFirebaseToken(callback) {
      console.log("[getFirebaseToken]");
      this.$fireMess
        .requestPermission()
        .then(granted => {
          console.log("[Messaging] have permission", granted);
          return this.$fireMess.getToken();
        })
        .then(token => {
          console.log("[Messaging] token", token);
          setFirebaseToken(token);

          // register notification here
          const deviceRegReq = createRegisterDeviceModel();
          callback(deviceRegReq);
        })
        .catch(err => {
          console.log("[Messaging] Error occured ", err);
        });
    }
  }
};
</script>

<style></style>
