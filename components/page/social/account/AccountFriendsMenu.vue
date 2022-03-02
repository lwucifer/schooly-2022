<template>
  <div class="account-friends-menu">
    <div class="account-friends-menu__title d-flex align-items-center">
      <h2 class="account-friends-menu__heading">
        Bạn bè
        <span
          class="account-friends-menu__heading-count"
          v-if="userTotalFriends > 0"
        >({{ userTotalFriends }})</span>
      </h2>

      <app-search
        class="account-friends-menu__search"
        placeholder="Nhập tên cần tìm"
        :button-props="{ color: '' }"
      />
    </div>

    <AccountMenu :menu="menu" />

    <slot name="content"></slot>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { SOCIAL_ACCOUNT_PROFILE as ACTION_SOCIAL_ACCOUNT_PROFILE } from "~/utils/action-types";
import { SOCIAL_ACCOUNT_PROFILE as MUTATION_SOCIAL_ACCOUNT_PROFILE } from "~/utils/mutation-types";
import AccountCover from "~/components/page/social/account/AccountCover.vue";
import AccountMenu from "~/components/page/social/account/AccountMenu.vue";

export default {
  components: {
    AccountCover,
    AccountMenu,
  },

  computed: {
    ...mapState("social/account/profile", ["userTotalFriends"]),

    menu() {
      const UUID = this.$route.params.uuid;
      const isCurrentUser = UUID === this.$store.getters["auth/uuidUser"];
      if (isCurrentUser) {
        return [
          {
            routePath: `/social/account/${UUID}/friends`,
            title: "Tất cả",
          },
          {
            routePath: `/social/account/${UUID}/friends_recent`,
            title: "Đã thêm gần đây",
          },
          {
            routePath: `/social/account/${UUID}/friends_birthday`,
            title: "Sinh nhật",
          },
          {
            routePath: `/social/account/${UUID}/friends_request`,
            title: "Lời mời kết bạn",
          },
        ];
      } else {
        return [
          {
            routePath: `/social/account/${UUID}/friends`,
            title: "Tất cả",
          },
        ];
      }
    },

    uuid() {
      return this.$route.params.uuid;
    },
  },

  activated() {
    this.$store.dispatch(
      `social/account/profile/${ACTION_SOCIAL_ACCOUNT_PROFILE.GET_USER_TOTAL_FRIENDS}`,
      { uuid: this.uuid }
    );
  },

  watch: {
    "$route.params.uuid": function (newValue) {
      this.$store.commit(
        `social/account/profile/${MUTATION_SOCIAL_ACCOUNT_PROFILE.SET_USER_TOTAL_FRIENDS}`,
        0
      );
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/social/account/_account-friends-menu.scss";
</style>