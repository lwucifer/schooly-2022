<template>
  <div class="bg-white shadow-1">
    <div class="d-flex align-items-center">
      <h1 class="heading-4 pa-4">Bài viết</h1>
    </div>
    <app-divider class="my-0" />
    <div
      class="px-4"
      v-for="(item, index) in searchSocialPostList"
      :key="index"
    >
      <SocialSearchPostItem :item="item" />
      <!-- <SocialSearchPostItem /> -->
    </div>
  </div>
</template>

<script>
import SocialSearchPostItem from "~/components/page/social/search/SocicalSearchPostItem";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  components: {
    SocialSearchPostItem,
  },

  computed: {
    ...mapState("social/searching", ["searchSocialPostList"]),
  },
};
</script>

<style></style>
