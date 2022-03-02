<template>
  <nav class="social-menu">
    <n-link class="social-menu__item" to="/social" exact>
      <span class="social-menu__icon">
        <IconHomeAlt />
      </span>
      Dòng thời gian
    </n-link>
    <n-link class="social-menu__item" to="/elearning" exact>
      <span class="social-menu__icon">
        <IconSocialMenuBookOpen />
      </span>
      Bài giảng khóa học
    </n-link>
    <n-link class="social-menu__item" to="/school" exact>
      <span class="social-menu__icon">
        <IconSocialMenuBuilding />
      </span>
      Trường học
    </n-link>
    <n-link class="social-menu__item" to="/social/notifications" exact>
      <span class="social-menu__icon social-menu__icon--outline">
        <IconSocialMenuNoti />
        <client-only>
          <span class="social-menu__count" v-if="countNotiSocial > 0">{{ countNotiSocial }}</span>
        </client-only>
      </span>
      Thông báo
    </n-link>
    <n-link class="social-menu__item" to="/messages/t" exact>
      <span class="social-menu__icon social-menu__icon--outline">
        <IconSocialMenuChat />
        <!-- <span class="social-menu__count">2</span> -->
      </span>
      Tin nhắn
    </n-link>
    <n-link class="social-menu__item" :to="`/social/account/${$store.getters['auth/uuidUser']}`">
      <span class="social-menu__icon social-menu__icon--outline">
        <IconSocialMenuUser />
      </span>
      Hồ sơ cá nhân
    </n-link>
  </nav>
</template>

<script>
import IconHomeAlt from "~/assets/svg/design-icons/home-alt.svg?inline";
import IconSocialMenuBookOpen from "~/assets/svg/icons/social-menu-book-open.svg?inline";
import IconSocialMenuBuilding from "~/assets/svg/icons/social-menu-building.svg?inline";
import IconSocialMenuNoti from "~/assets/svg/icons/social-menu-noti.svg?inline";
import IconSocialMenuChat from "~/assets/svg/icons/social-menu-chat.svg?inline";
import IconSocialMenuUser from "~/assets/svg/icons/social-menu-user.svg?inline";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";

export default {
  components: {
    IconHomeAlt,
    IconSocialMenuBookOpen,
    IconSocialMenuBuilding,
    IconSocialMenuNoti,
    IconSocialMenuChat,
    IconSocialMenuUser
  },

  computed: {
    ...mapState("elearning/study/notifications", [
      "countNotiSocial",
    ]),
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/social/_social-menu.scss";
</style>