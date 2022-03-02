<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <SchoolAccountSide active="1" />
      </div>
      <div class="col-md-9">
        <div class="school-account__main">
          <block-section title="Thông tin tài khoản">
            <template v-slot:content>
              <div class="acc-tab">
                <a @click="activeTab = 1" :class="{active: activeTab == 1}">THÔNG TIN CÁ NHÂN</a>
                <a
                  @click="activeTab = 2"
                  :class="{active: activeTab == 2}"
                  v-if="filterLinkList"
                >THÔNG TIN LIÊN KẾT</a>
              </div>
              <PersonalInfo v-if="activeTab == 1" />
              <LinkInfo v-if="activeTab == 2 && filterLinkList" />
            </template>
          </block-section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SchoolAccountSide from "~/components/page/school/SchoolAccountSide";
import AccountInfoStudent from "~/components/page/account/Info/AccountInfoStudent";
import PersonalInfo from "~/components/page/account/Info/PersonalInfo";
import LinkInfo from "~/components/page/account/Info/LinkInfo";
import SchoolInfo from "~/components/page/account/Info/SchoolInfo";
import DepartmentInfo from "~/components/page/account/Info/DepartmentInfo";
import AccountChangePasswordModal from "~/components/page/account/AccountChangePasswordModal";
import AccountLinkModal from "~/components/page/account/Info/AccountLinkModal";
import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions, mapGetters } from "vuex";
import IconPhoto from "~/assets/svg/icons/photo.svg?inline";
import IconPlus from "~/assets/svg/design-icons/plus.svg?inline";
import { get } from "lodash";
import { getDateBirthDay, getDateFormat } from "~/utils/moment";

// Import faked data
import { SCHOOL } from "~/server/fakedata/school/test";

export default {
  layout: "account-info",

  components: {
    IconPhoto,
    IconPlus,
    SchoolAccountSide,
    AccountInfoStudent,
    AccountChangePasswordModal,
    AccountLinkModal,
    PersonalInfo,
    LinkInfo,
    SchoolInfo,
    DepartmentInfo
  },
  async fetch({ params, query, store, route }) {
    const userId = params.id;
    await Promise.all([
      store.dispatch(`account/${actionTypes.ACCOUNT_PERSONAL.LIST}`),
      store.dispatch(`account/${actionTypes.ACCOUNT_LINK.LIST}`)
    ]);
  },
  data() {
    return {
      isAuthenticated: true,
      name: "",
      phone: "",
      email: "",
      sex: "",
      birthday: "",
      showChangePass: false,
      accountLink: {
        showModal: false,
        list: ""
      },
      profileInfo: "",
      activeTab: 1
    };
  },
  watch: {
    profileList: {
      handler: function() {
        this.name = get(this, "profileList.fullname", "");
        this.phone = get(this, "profileList.phone", "");
        this.email = get(this, "profileList.email", "");
        this.address = get(this, "profileList.address", "");
        this.sex = get(this, "profileList.sex", "") === "MALE" ? "Nam" : "Nữ";
        this.birthday = getDateBirthDay(get(this, "profileList.birthday", ""));
        this.accountLink.list = get(this, "linkList.data", {});
        this.profileInfo = get(this, "profileList", {});
      }
    }
  },
  methods: {
    async fetchProfile() {
      await Promise.all([
        this.$store.dispatch(`account/${actionTypes.ACCOUNT_PROFILE.LIST}`),
        this.$store.dispatch(`account/${actionTypes.ACCOUNT_LINK.LIST}`)
      ]);
    },
    closeNotify() {
      this.notify.showNotify = false;
    },
    closeLinkModal() {
      this.accountLink.showModal = false;
    },
    async handleRefresh() {
      this.fetchProfile();
    }
  },
  computed: {
    ...mapState("account", {
      profileList: "profileList"
    }),
    ...mapState("account", {
      linkList: "linkList"
    }),
    ...mapGetters("auth", ["isTeacherRole", "isStudentRole"]),
    filterLinkList() {
      return this.linkList.data &&
        this.linkList.data.linked &&
        this.linkList.data.linked == true
        ? true
        : false;
    }
  },
  created() {
    this.fetchProfile();
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/school/_school-account.scss";
@import "~/assets/scss/components/account/_account-info.scss";
</style>