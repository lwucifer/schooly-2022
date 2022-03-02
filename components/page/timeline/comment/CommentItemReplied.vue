<template>
  <div class="comment-item-replied" v-on="$listeners">
    <app-avatar
      :src="get(data, 'author.avatar.low', null)"
      size="3rem"
      class="comment-item-replied__avatar"
    />
    <span class="comment-item-replied__text">
      <span class="comment-item-replied__name">{{ get(data, 'author.fullname', '') }}</span>
      <span class="comment-item-replied__status">Replied - {{ total }} Reply</span>
    </span>
  </div>
</template>

<script>
import { get } from "lodash";

export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    total: Number
  },

  methods: {
    get
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/comment/_comment-item-replied.scss";
</style>