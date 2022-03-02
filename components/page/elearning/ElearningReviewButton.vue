<template>
  <div class="elearning-review__nav mb-4">
    <app-button
      class="mr-4"
      color="primary"
      :outline="tabActive !== 'all'"
      size="sm"
      @click="changeTab('all')"
      >Tất cả</app-button
    >

    <app-button
      class="mr-4"
      color="primary"
      :outline="tabActive !== 5"
      size="sm"
      @click="changeTab(5)"
      >{{ `5 sao (${get(info, "voting.vote5_rate.votes", 0)})` }}</app-button
    >

    <app-button
      class="mr-4"
      color="primary"
      :outline="tabActive !== 4"
      size="sm"
      @click="changeTab(4)"
      >{{ `4 sao (${get(info, "voting.vote4_rate.votes", 0)})` }}</app-button
    >

    <app-button
      class="mr-4"
      color="primary"
      :outline="tabActive !== 3"
      size="sm"
      @click="changeTab(3)"
      >{{ `3 sao (${get(info, "voting.vote3_rate.votes", 0)})` }}</app-button
    >

    <app-button
      class="mr-4"
      color="primary"
      :outline="tabActive !== 2"
      size="sm"
      @click="changeTab(2)"
      >{{ `2 sao (${get(info, "voting.vote2_rate.votes", 0)})` }}</app-button
    >

    <app-button
      class="mr-4"
      color="primary"
      :outline="tabActive !== 1"
      size="sm"
      @click="changeTab(1)"
      >{{ `1 sao (${get(info, "voting.vote1_rate.votes", 0)})` }}</app-button
    >
  </div>
</template>

<script>
import { get } from "lodash";

export default {
  props: { info: {}, tabActive: {} },

  methods: {
    changeTab(key) {
      this.$emit("changeTab", key);
    },
    get,
  },
};
</script>
