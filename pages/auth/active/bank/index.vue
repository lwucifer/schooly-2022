<template>
  <div>{{ error }}</div>
</template>

<script>
import { get } from "lodash";
import { mapState } from "vuex";

export default {
  data() {
    return {
      error: "",
    };
  },

  computed: {
    ...mapState("auth", {
      token: "token",
    }),
  },

  async mounted() {
    if (!get(this, "token.id", true)) {
      this.error = "User not found";
      return;
    }
    let data = get(this, "$router.history.current.query", {});
    data.user_bank_id = data.ub_id;
    delete data.ub_id;
    const res = await this.$axios({
      url: "user/account/banks/active",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data,
    });
    if (get(res, "data.success", false)) {
      this.$router.push(`/${get(this, "token.id", "")}/info/setting?tab=payment`);
      return;
    }
    this.error = get(res, "data.message", "Có lỗi xảy ra");
  },
};
</script>
