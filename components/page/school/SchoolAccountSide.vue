<template>
  <div class="school-side menu-side" v-sticky sticky-offset="{ top: 88 }" :sticy-z-index="9">
    <!--
    <aside-menu :selected-item="active" :items="menuItems"></aside-menu>
    -->
    <div
      class="aside-menu__item"
      :class="active == 1 ? 'active' : ''"
      v-if="checkMenuGuard(MENU.ACCOUNT_INFO)"
    >
      <n-link class="link-gray" :to="'/'+token.id+'/info'">
        <span>
          <IconAccountCircle24px class="icon" />
        </span>
        <span>Thông tin tài khoản</span>
      </n-link>
    </div>
    <div
      class="aside-menu__item"
      :class="active == 3 ? 'active' : ''"
      v-if="checkMenuGuard(MENU.REVENUE)"
    >
      <n-link class="link-gray" :to="'/'+token.id+'/info/revenues'">
        <span>
          <IconMonetizationOn24px class="icon" />
        </span>
        <span>Thống kê doanh thu</span>
      </n-link>
    </div>
    <div
      class="aside-menu__item"
      :class="active == 4 ? 'active' : ''"
      v-if="checkMenuGuard(MENU.TRANSACTION)"
    >
      <n-link class="link-gray" :to="'/'+token.id+'/info/transactions'">
        <span>
          <IconAttachMoney24px class="icon" />
        </span>
        <span>Lịch sử giao dịch</span>
      </n-link>
    </div>
    <div
      class="aside-menu__item"
      :class="active == 5 ? 'active' : ''"
      v-if="checkMenuGuard(MENU.NOTIFICATION)"
    >
      <n-link class="link-gray" :to="'/'+token.id+'/info/announcement'">
        <span>
          <IconNotifications24px class="icon" />
        </span>
        <span>Thông báo</span>
      </n-link>
    </div>
    <div
      class="aside-menu__item"
      :class="active == 6 ? 'active' : ''"
      v-if="checkMenuGuard(MENU.SETTINGS)"
    >
      <n-link class="link-gray" :to="'/'+token.id+'/info/setting'">
        <span>
          <IconSettings24px class="icon" />
        </span>
        <span>Cài đặt chung</span>
      </n-link>
    </div>
    <div
      class="aside-menu__item"
      :class="active == 7 ? 'active' : ''"
      v-if="checkMenuGuard(MENU.SUPPORT)"
    >
      <a class="link-gray" href="https://hotro.schoolly.vn/hc/vi-vn/requests/new" target="_blank">
        <span>
          <IconHeadsetMic24px class="icon" />
        </span>
        <span>Trợ giúp</span>
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { USER_ROLES, ACCOUNT_PROFILE_MENU } from "~/utils/constants";
import { isCommonElementIn2Array } from "~/utils/common";
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import IconAccountCircle24px from "~/assets/svg/v2-icons/account_circle_24px.svg?inline";
import IconMonetizationOn24px from "~/assets/svg/v2-icons/monetization_on_24px.svg?inline";
import IconSettings24px from "~/assets/svg/v2-icons/settings_24px.svg?inline";
import IconHeadsetMic24px from "~/assets/svg/v2-icons/headset_mic_24px.svg?inline";
import IconAttachMoney24px from "~/assets/svg/v2-icons/attach_money_24px.svg?inline";
import IconNotifications24px from "~/assets/svg/v2-icons/notifications_24px.svg?inline";

export default {
  components: {
    IconAccountCircle24px,
    IconMonetizationOn24px,
    IconSettings24px,
    IconHeadsetMic24px,
    IconAttachMoney24px,
    IconNotifications24px
  },
  data() {
    return {
      menuItems: [],
      MENU: ACCOUNT_PROFILE_MENU
    };
  },
  props: {
    active: {
      type: [String, Number]
    }
  },
  computed: {
    ...mapState("account", { profile: "profileList" }),
    ...mapState("auth", ["token"]),
    userRoles() {
      return this.get(this, "profile.role.authority", false) || [];
    }
    /*
    getConstantMenu() {
      const accountObj = this.token;
      if (!!accountObj) {
        return [
          {
            label: "Thông tin tài khoản",
            key: 1,
            icon: "user.svg",
            link: `/${accountObj.id}/info`
          },
          {
            label: "Thông báo",
            key: 5,
            icon: "bell.svg",
            link: `/${accountObj.id}/info/announcement`
          },
          {
            label: "Cài đặt chung",
            key: 6,
            icon: "cog.svg",
            link: `/${accountObj.id}/info/setting`
          },
          {
            label: "Trợ giúp",
            key: 7,
            icon: "exclamation.svg",
            link: `/${accountObj.id}/info/support`
          }
        ];
      }
    },

    getAuthMenu() {
      const accountObj = this.token;
      if (!!accountObj) {
        return [
          {
            label: "Lịch sử giao dịch",
            key: 4,
            icon: "history.svg",
            link: `/${accountObj.id}/info/transactions`,
            roles: [
              USER_ROLES.ROLE_USER,
              USER_ROLES.ROLE_STUDENT,
              USER_ROLES.ROLE_TEACHER,
              USER_ROLES.ROLE_PARENT
            ]
          },
          {
            label: "Thống kê doanh thu",
            key: 3,
            icon: "exclamation.svg",
            link: `/${accountObj.id}/info/revenues`,
            roles: [USER_ROLES.ROLE_TEACHER]
          }
        ];
      }
    }
    */
  },
  methods: {
    async fetchProfile() {
      await Promise.all([
        this.$store.dispatch(`account/${actionTypes.ACCOUNT_PROFILE.LIST}`)
      ]);
    },
    /*
    genMenuItem() {
      const data = [];
      const currentRole = this.get(this, "profile.role.authority", false);
      if (currentRole) {
        const menuLeng = this.getAuthMenu ? this.getAuthMenu.length : 0;
        for (let i = 0; i < menuLeng; i++) {
          const tmp = this.getAuthMenu[i];
          if (tmp.roles.includes(currentRole)) {
            data.push(tmp);
          }
        }
      }
      this.menuItems = this.getConstantMenu.concat(data);
    },
    */
    checkMenuGuard(_menuActive) {
      let isValidMenu = true;
      switch (_menuActive) {
        case this.MENU.ACCOUNT_INFO:
          isValidMenu = isCommonElementIn2Array(this.userRoles, [
            USER_ROLES.ROLE_USER,
            USER_ROLES.ROLE_STUDENT,
            USER_ROLES.ROLE_TEACHER,
            USER_ROLES.ROLE_PARENT
          ]);
          break;

        case this.MENU.REVENUE:
          isValidMenu = isCommonElementIn2Array(this.userRoles, [
            USER_ROLES.ROLE_TEACHER
          ]);
          break;

        case this.MENU.TRANSACTION:
          isValidMenu = isCommonElementIn2Array(this.userRoles, [
            USER_ROLES.ROLE_USER,
            USER_ROLES.ROLE_TEACHER,
            USER_ROLES.ROLE_STUDENT
          ]);
          break;

        case this.MENU.NOTIFICATION:
          isValidMenu = isCommonElementIn2Array(this.userRoles, [
            USER_ROLES.ROLE_USER,
            USER_ROLES.ROLE_STUDENT,
            USER_ROLES.ROLE_TEACHER,
            USER_ROLES.ROLE_PARENT
          ]);
          break;

        case this.MENU.SETTINGS:
          isValidMenu = isCommonElementIn2Array(this.userRoles, [
            USER_ROLES.ROLE_USER,
            USER_ROLES.ROLE_STUDENT,
            USER_ROLES.ROLE_TEACHER,
            USER_ROLES.ROLE_PARENT
          ]);
          break;

        case this.MENU.SUPPORT:
          isValidMenu = isCommonElementIn2Array(this.userRoles, [
            USER_ROLES.ROLE_USER,
            USER_ROLES.ROLE_STUDENT,
            USER_ROLES.ROLE_TEACHER,
            USER_ROLES.ROLE_PARENT
          ]);
          break;

        default:
          isValidMenu = true;
          break;
      }

      return isValidMenu;
    },
    get
  },
  async created() {
    await this.fetchProfile();
    /*
    this.genMenuItem();
    */
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/school/_school-account.scss";
@import "~/assets/scss/components/menu/_aside-menu.scss";
</style>