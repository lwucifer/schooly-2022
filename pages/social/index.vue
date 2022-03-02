<template>
  <div class="page-social container">
    <div class="row">
      <div class="col page-social__col-menu">
        <div
          v-sticky
          sticky-offset="{ top: 101 }"
          :sticy-z-index="9"
          class="page-social__aside-wrapper"
        >
          <SocialMenu />
        </div>
      </div>

      <div class="col page-social__col-content">
        <nuxt-child
          keep-alive
          :keep-alive-props="{ exclude: ['PagePostDetail', 'PageAccountIndex'] }"
        />
      </div>

      <div class="col-md-3">
        <AsideBox
          v-show="friendBirthdays.length > 0"
          class="page-social__aside-birthday"
          title="Sinh nhật"
        >
          <FriendsBirthday />
        </AsideBox>

        <AsideBox
          v-show="friendOnlines.length > 0"
          class="page-social__aside-friends-list"
          title="Bạn bè đang trực tuyến"
        >
          <FriendsOnline />
        </AsideBox>

        <AsideBox
          v-show="friendSuggestions.length > 0"
          class="page-social__aside-friends-list"
          title="Gợi ý kết bạn"
        >
          <FriendsSuggestion />
        </AsideBox>

        <div v-sticky sticky-offset="{ top: 101 }" :sticy-z-index="9">
          <AsideBox title="Bài giảng khóa học nổi bật">
            <HighlightCourses />
          </AsideBox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SocialMenu from "~/components/page/social/SocialMenu";
import AsideBox from "~/components/layout/asideBox/AsideBox";
import FriendsBirthday from "~/components/page/social/aside/FriendsBirthday";
import FriendsOnline from "~/components/page/social/aside/FriendsOnline";
import FriendsSuggestion from "~/components/page/social/aside/FriendsSuggestion";
import HighlightCourses from "~/components/page/social/aside/HighlightCourses";

export default {
  layout: "default",
  middleware: "authenticated",

  components: {
    SocialMenu,
    AsideBox,
    FriendsBirthday,
    FriendsOnline,
    FriendsSuggestion,
    HighlightCourses,
  },

  computed: {
    ...mapState("social/friend", [
      "friendOnlines",
      "friendSuggestions",
      "friendBirthdays",
      "cancelFriend",
    ]),
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/pages/social/_social-index.scss";
</style>
