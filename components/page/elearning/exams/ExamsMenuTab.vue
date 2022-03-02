<template>
  <div class="elearning-manager__tab">
    <div class="nav">
      <a
        @click="changeTab('APPROVED')"
        :class="tab == 'APPROVED' ? 'active' : ''"
        >đã được duyệt</a
      >
      <a @click="changeTab('DOING')" :class="tab == 'DOING' ? 'active' : ''"
        >Đang soạn</a
      >
      <a @click="changeTab('PENDING')" :class="tab == 'PENDING' ? 'active' : ''"
        >Chờ duyệt</a
      >
      <a @click="changeTab('DENIED')" :class="tab == 'DENIED' ? 'active' : ''"
        >Bị từ chối</a
      >
      <a @click="changeTab('ENDED')" :class="tab == 'ENDED' ? 'active' : ''"
        >đã kết thúc</a
      >
    </div>
    <n-link
      :to="'/elearning/manager/semester/create'"
      class="btn btn--size-sm btn--color-primary btn--square btn-right"
    >
      <IconPlus class="fill-white mr-2" />
      <span class="color-white">Tạo kỳ thi</span>
    </n-link>
  </div>
</template>

<script>
import IconPlus from "~/assets/svg/v2-icons/add_24px.svg?inline";

export default {
  components: {
    IconPlus
  },

  data() {
    return {
      tab: "APPROVED"
    };
  },
  methods: {
    changeTab(val) {
      this.tab = val;
      this.$emit("changeTab", val);
      console.log("val", val);
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/manager/_elearning-manager.scss";
</style>
