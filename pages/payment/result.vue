<template>
  <div></div>
</template>

<script>
import { getParamQuery } from "~/utils/common";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import qs from "qs";

export default {
  async mounted() {
    const payload = get(this, "$router.history.current.query", {});
    console.log("[payload]", qs.stringify(payload));
    const res = await this.$store.dispatch(
      `payment/${actionTypes.PAYMENT.VALIDATE_TRANSACTION}`,
      { params: qs.stringify(payload) }
    );
    localStorage.setItem("res_payment", JSON.stringify(res));
    if (res.success) {
      this.$router.push("/payment/success");
      return;
    }
    this.$router.push("/payment/fail");
  }
};
</script>
