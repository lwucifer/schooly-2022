<template>
  <div class="bg-white shadow-1">
    <div class="d-flex align-items-center">
      <h1 class="heading-4 pa-4">Mọi người</h1>
      <a class="ml-auto pa-4">Xem tất cả</a>
    </div>
    <app-divider class="my-0" />
    <div
      class="px-4 py-4"
      v-for="(item, index) in searchSocialUserList"
      :key="index"
    >
      <SocialSearchFriendItem :item="item" />
    </div>
  </div>
</template>

<script>
import SocialSearchFriendItem from "~/components/page/social/search/SocialSearchFriendItem";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  components: {
    SocialSearchFriendItem,
  },

  computed: {
    ...mapState("social/searching", ["searchSocialUserList"]),
  },
};
</script>

<style></style>
