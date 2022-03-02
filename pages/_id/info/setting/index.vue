<template>
  <div class="container" v-if="isTeacherRole">
    <div class="row">
      <div class="col-md-3">
        <SchoolAccountSide :active="6" />
      </div>
      <div class="col-md-9 cc-panel">
        <block-section title="Cài đặt chung">
          <template v-slot:content>
            <sub-block-section :title-cls="{ 'pb-0': true, 'border-0': true }">
              <template v-slot:title>
                <div class="elearning-manager-content p-0">
                  <div class="elearning-manager-content__title">
                    <head-tabs
                      :tabs="tabs"
                      :active.sync="tab"
                      @selectedItem="changeTab"
                    />
                  </div>
                </div>
              </template>
              <template v-slot:content>
                <keep-alive>
                  <div v-if="loading">
                    <vcl-list />
                    <vcl-list />
                  </div>
                  <div v-else>
                    <Notify
                      v-if="tab === 'notify'"
                      title-elearning="E-LEARNING - HỌC TẬP"
                      title-social="MẠNG XÃ HỘI"
                    />
                    <PaymentList v-if="tab === 'payment'" />
                  </div>
                </keep-alive>
              </template>
            </sub-block-section>
          </template>
        </block-section>
      </div>
    </div>
  </div>
  <SettingRoleStudent v-else />
</template>

<script>
import SchoolAccountSide from "~/components/page/school/SchoolAccountSide";
import { VclList } from "vue-content-loading";
import HeadTabs from "~/components/page/elearning/HeadTab";
import * as actionTypes from "~/utils/action-types";
import Notify from "~/components/page/profile/setting/tabs/notify";
import PaymentList from "~/components/page/profile/setting/tabs/PaymentList";
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";
import SettingRoleStudent from "~/components/page/profile/setting/tabs/SettingRoleStudent";
import { getParamQuery, redirectWithParams } from "~/utils/common";

export default {
  layout: "account-info",

  components: {
    SchoolAccountSide,
    Notify,
    PaymentList,
    HeadTabs,
    VclList,
    SettingRoleStudent,
  },

  data() {
    return {
      loading: true,
      tab: "notify",
      isAuthenticated: true,
      tabs: [
        {
          key: "notify",
          text: "Cài đặt thông báo",
        },
        {
          key: "payment",
          text: "Cài đặt thanh toán",
        },
      ],
    };
  },

  async mounted() {
    const tab = getParamQuery("tab");
    if (tab) {
      this.tab = tab;
    }
    this.loading = true;
    await this.$store.dispatch(`setting/getSetting`);
    const options = {
      params: { token: "true" },
    };
    await this.$store.dispatch(`setting/getBanks`, options);
    await this.$store.dispatch(`setting/getAccountBanks`, {
      params: { status: "ACTIVE" },
    });
    this.loading = false;
  },

  computed: {
    currentTabComponent: function() {
      const MATCHED_TABS = {
        notify: "Notify",
        payment: "PaymentList",
      };
      return MATCHED_TABS[this.tab];
    },
    ...mapGetters("auth", ["isTeacherRole"]),
  },

  methods: {
    changeTab(key) {
      this.tab = key;
      redirectWithParams({ tab: key });
    },
    getCurrentContent() {
      const tab = get(this, "$route.query.tab", false);
      if (tab && ["payment", "notify"].includes(tab)) {
        this.tab = tab;
      }
    },
    get,
  },
  created() {
    this.getCurrentContent();
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/manager/_elearning-manager-content.scss";
@import "~/assets/scss/components/account/_account-info-setting.scss";
</style>
