<template>
  <div class="the-header__user">
    <div @click.prevent="onClickUserHeader()" v-click-outside="handleClickOutside">
      <app-avatar
        class="the-header__user-avt"
        :src="personalList && personalList.avatar && personalList.avatar.low ? personalList.avatar.low : ''"
        :size="40"
      ></app-avatar>
    </div>
    <div class="the-header__user-menu" v-if="activeUserHeader">
      <!--      <div style="height: 2rem;"></div>-->
      <ul>
        <li class="the-header__user-menu__item" v-if="checkMenuGuard(MENU.ELEARNING)">
          <n-link to="/elearning/manager">
            <IconComputer24px class="fill-gray" />
            <span>Quản lý E-Learning</span>
          </n-link>
        </li>
        <li class="the-header__user-menu__item" v-if="checkMenuGuard(MENU.ONLINE_CLASS)">
          <n-link to="/elearning/mytutor/olclass">
            <IconAssignmentInd24px class="fill-gray" />
            <span>Lớp học online</span>
          </n-link>
        </li>
        <!-- <li class="the-header__user-menu__item" v-if="checkMenuGuard(MENU.STUDENT)">
          <n-link to="/privates/students">
            <IconSupervisorAccount24px class="fill-gray" />
            <span>Quản lý học sinh</span>
          </n-link>
        </li>-->
        <li class="the-header__user-menu__item" v-if="checkMenuGuard(MENU.ACCOUNT_INFO)">
          <n-link :to="getAccountInfoLink">
            <IconAccountCircle24px class="fill-gray" />
            <span>Thông tin tài khoản</span>
          </n-link>
        </li>
        <!-- <li class="the-header__user-menu__item" v-if="checkMenuGuard(MENU.REVENUE)">
          <n-link :to="getRevenueLink">
            <IconMonetizationOn24px class="fill-gray" />
            <span>Thống kê doanh thu</span>
          </n-link>
        </li>
        <li class="the-header__user-menu__item" v-if="checkMenuGuard(MENU.NOTIFICATION)">
          <n-link :to="getNotificationLink">
            <IconNotifications24px class="fill-gray" />
            <span>Thông báo</span>
          </n-link>
        </li>
        <li class="the-header__user-menu__item" v-if="checkMenuGuard(MENU.TRANSACTION)">
          <n-link :to="getTransactionLink">
            <IconAttachMoney24px class="fill-gray" />
            <span>Lịch sử giao dịch</span>
          </n-link>
        </li>
        <li class="the-header__user-menu__item" v-if="checkMenuGuard(MENU.SETTINGS)">
          <n-link :to="getSettingLink">
            <IconSettings24px class="fill-gray" />
            <span>Cài đặt chung</span>
          </n-link>
        </li>-->
        <li class="the-header__user-menu__item" v-if="checkMenuGuard(MENU.SUPPORT)">
          <a href="https://hotro.schoolly.vn/hc/vi-vn/requests/new" target="_blank">
            <IconHeadsetMic24px class="fill-gray" />
            <span>Trợ giúp</span>
          </a>
        </li>
        <li
          class="the-header__user-menu__item"
          @click.prevent="handleLogout"
          v-if="checkMenuGuard(MENU.SIGNOUT)"
        >
          <n-link to="/auth/signin">
            <IconPowerSettingsNew24px class="fill-gray" />
            <span>Đăng xuất</span>
          </n-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { USER_ROLES, ACCOUNT_PROFILE_MENU } from "~/utils/constants";
import { RESPONSE_SUCCESS, TIMEOUT } from "~/utils/config";
import { isCommonElementIn2Array } from "~/utils/common";
import { getToken, getDeviceId } from "~/utils/auth";
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";

import IconAccountCircle24px from "~/assets/svg/v2-icons/account_circle_24px.svg?inline";
import IconNotifications24px from "~/assets/svg/v2-icons/notifications_24px.svg?inline";
import IconSchool from "~/assets/svg/icons/school.svg?inline";
import IconAttachMoney24px from "~/assets/svg/v2-icons/attach_money_24px.svg?inline";
import IconMonetizationOn24px from "~/assets/svg/v2-icons/monetization_on_24px.svg?inline";
import IconHeadsetMic24px from "~/assets/svg/v2-icons/headset_mic_24px.svg?inline";
import IconPowerSettingsNew24px from "~/assets/svg/v2-icons/power_settings_new_24px.svg?inline";
import IconComputer24px from "~/assets/svg/v2-icons/computer_24px.svg?inline";
import IconSupervisorAccount24px from "~/assets/svg/v2-icons/supervisor_account_24px.svg?inline";
import IconSettings24px from "~/assets/svg/v2-icons/settings_24px.svg?inline";
import IconAssignmentInd24px from '~/assets/svg/v2-icons/assignment_ind_24px.svg?inline';
import { mapMutations, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      MENU: ACCOUNT_PROFILE_MENU,
      // notify logout
      notify: {
        redirectLink: "",
        message: "",
        showNotify: true,
      },
      activeUserHeader: false,
    };
  },

  components: {
    IconAccountCircle24px,
    IconNotifications24px,
    IconSchool,
    IconAttachMoney24px,
    IconMonetizationOn24px,
    IconHeadsetMic24px,
    IconPowerSettingsNew24px,
    IconComputer24px,
    IconSupervisorAccount24px,
    IconSettings24px,
    IconAssignmentInd24px
  },

  computed: {
    ...mapState("account", {
      profile: "profileList",
      personalList: "personalList",
    }),
    ...mapGetters("auth", ["roleNames"]),

    userRoles() {
      return this.get(this, "profile.role.authority", false) || [];
    },

    getAccountInfoLink() {
      const accountObj = getToken();
      if (!!accountObj) {
        return `/${accountObj.id}/info`;
      }
    },

    getRevenueLink() {
      const accountObj = getToken();
      if (!!accountObj) {
        return `/${accountObj.id}/info/revenues`;
      }
    },

    getTransactionLink() {
      const accountObj = getToken();
      if (!!accountObj) {
        return `/${accountObj.id}/info/transactions`;
      }
    },

    getNotificationLink() {
      const accountObj = getToken();
      if (!!accountObj) {
        return `/${accountObj.id}/info/announcement`;
      }
    },

    getSettingLink() {
      const accountObj = getToken();
      if (!!accountObj) {
        return `/${accountObj.id}/info/setting`;
      }
    },

    getSupportLink() {
      const accountObj = getToken();
      if (!!accountObj) {
        return `/${accountObj.id}/info/support`;
      }
    },
  },

  methods: {
    ...mapMutations("auth", ["removeToken"]),
    ...mapMutations("chat", ["setRoomList"]),
    ...mapActions("auth", ["logout"]),
    get,
    handleLogout() {
      console.log("[handleLogout]");
      const device_id = getDeviceId();

      this.logout({ device_id }).then((result) => {
        console.log("[handleLogout] result", result, device_id);
        if (result.success == RESPONSE_SUCCESS) {
          this.setRoomList({
            list_room: [],
          });
          this.$router.push("/auth/signin");
        }
      });
    },

    async fetchProfile() {
      await Promise.all([
        this.$store.dispatch(`account/${actionTypes.ACCOUNT_PROFILE.LIST}`),
        this.$store.dispatch(`account/${actionTypes.ACCOUNT_PERSONAL.LIST}`),
      ]);
    },

    checkMenuGuard(_menuActive) {
      let isValidMenu = true;
      // console.log("[checkMenuGuard]", _menuActive, this.roleNames);

      switch (_menuActive) {
        case this.MENU.ELEARNING:
          isValidMenu = isCommonElementIn2Array(this.roleNames, [
            USER_ROLES.ROLE_TEACHER,
          ]);
          break;

        case this.MENU.STUDENT:
          isValidMenu = isCommonElementIn2Array(this.roleNames, [
            USER_ROLES.ROLE_TEACHER,
          ]);
          break;

        case this.MENU.ACCOUNT_INFO:
          isValidMenu = isCommonElementIn2Array(this.roleNames, [
            USER_ROLES.ROLE_USER,
            USER_ROLES.ROLE_STUDENT,
            USER_ROLES.ROLE_TEACHER,
            USER_ROLES.ROLE_PARENT,
          ]);
          break;

        case this.MENU.REVENUE:
          isValidMenu = isCommonElementIn2Array(this.roleNames, [
            USER_ROLES.ROLE_TEACHER,
          ]);
          break;

        case this.MENU.TRANSACTION:
          isValidMenu = isCommonElementIn2Array(this.roleNames, [
            USER_ROLES.ROLE_USER,
            USER_ROLES.ROLE_TEACHER,
            USER_ROLES.ROLE_STUDENT,
          ]);
          break;

        case this.MENU.NOTIFICATION:
          isValidMenu = isCommonElementIn2Array(this.roleNames, [
            USER_ROLES.ROLE_USER,
            USER_ROLES.ROLE_STUDENT,
            USER_ROLES.ROLE_TEACHER,
            USER_ROLES.ROLE_PARENT,
          ]);
          break;

        case this.MENU.SETTINGS:
          isValidMenu = isCommonElementIn2Array(this.roleNames, [
            USER_ROLES.ROLE_USER,
            USER_ROLES.ROLE_STUDENT,
            USER_ROLES.ROLE_TEACHER,
            USER_ROLES.ROLE_PARENT,
          ]);
          break;

        case this.MENU.SUPPORT:
          isValidMenu = isCommonElementIn2Array(this.roleNames, [
            USER_ROLES.ROLE_USER,
            USER_ROLES.ROLE_STUDENT,
            USER_ROLES.ROLE_TEACHER,
            USER_ROLES.ROLE_PARENT,
          ]);
          break;

        case this.MENU.SIGNOUT:
          isValidMenu = true;
          break;

        case this.MENU.ONLINE_CLASS:
          isValidMenu = isCommonElementIn2Array(this.roleNames, [
            USER_ROLES.ROLE_TEACHER,
          ]);
          break;

        default:
          isValidMenu = true;
          break;
      }

      return isValidMenu;
    },
    onClickUserHeader() {
      this.activeUserHeader = !this.activeUserHeader;
    },
    handleClickOutside() {
      this.activeUserHeader = false;
    },
  },

  async mounted() {
    await this.fetchProfile();
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/app/_app-user-header.scss";
</style>