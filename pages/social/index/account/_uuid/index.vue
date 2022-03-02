<template>
  <div>
    <section class="bg-white mb-3 shadow-1">
      <AccountCover :fetchingInfo="$fetchState.pending" />
      <AccountMenu :menu="menu" menu-layout="fixed" />
    </section>

    <div v-if="$fetchState.error" class="text-center pa-3">{{ $fetchState.error.message }}</div>

    <nuxt-child v-else keep-alive />
  </div>
</template>

<script>
import {
  SOCIAL_ACCOUNT_PROFILE as ACTION_SOCIAL_ACCOUNT_PROFILE,
  ACCOUNT_PERSONAL,
} from "~/utils/action-types";
import AccountCover from "~/components/page/social/account/AccountCover.vue";
import AccountMenu from "~/components/page/social/account/AccountMenu.vue";

export default {
  name: "PageAccountIndex",

  components: {
    AccountCover,
    AccountMenu,
  },

  async fetch() {
    try {
      const getSocialProfile = async () =>
        await this.$store.dispatch(
          `social/account/profile/${ACTION_SOCIAL_ACCOUNT_PROFILE.GET_SOCIAL_PROFILE}`,
          { uuid: this.$route.params.uuid }
        );
      const getAccountProfile = async () =>
        await this.$store.dispatch(
          `social/account/profile/${ACTION_SOCIAL_ACCOUNT_PROFILE.GET_ACCOUNT_PROFILE}`,
          {
            uuid:
              this.$route.params.uuid == this.$store.getters["auth/uuidUser"]
                ? null
                : this.$route.params.uuid,
          }
        );

      const getProfiles = await Promise.all([
        getSocialProfile(),
        getAccountProfile(),
      ]);

      if (getProfiles[0].error || getProfiles[1].error) {
        throw new Error("User not found");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },

  fetchOnServer: false,

  computed: {
    menu() {
      const UUID = this.$route.params.uuid;
      return [
        {
          routePath: `/social/account/${UUID}`,
          exact: true,
          title: "Dòng thời gian",
        },
        {
          routePath: `/social/account/${UUID}/about`,
          title: "Giới thiệu",
        },
        {
          routePath: `/social/account/${UUID}/friends`,
          title: "Bạn bè",
          match: [
            "friends",
            "friends_recent",
            "friends_birthday",
            "friends_request",
          ],
        },
        {
          routePath: `/social/account/${UUID}/photos`,
          title: "Ảnh",
          match: ["photos", "photos_tagged", "videos"],
        },
      ];
    },
  },

  watch: {
    "$route.params.uuid": function (newValue) {
      if (newValue) {
        this.$fetch();
      }
    },
  },
};
</script>
