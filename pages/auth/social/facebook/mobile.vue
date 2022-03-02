<template> <h3 class="container">Đang chuyển hướng, vui lòng chờ...</h3></template>

<script>

export default {
  data() {
    return {};
  },

  async mounted() {
    console.log("[mounted]", this.$route.query);
    const { code } = this.$route.query;
    if (!code) return;
    window.location.href = `schoolly://?code=${code}`;
  }
};
</script>

<style></style>
