<template>
  <div class="container">
    <breadcrumb />

    <div class="row">
      <div class="col-md-3">
        <!-- <ElearningManagerSide :group=2 :active=3 /> -->
        <ElearningManagerSide :active="3" />
      </div>
      <div class="col-md-9">
        <h5 class="page-title">Lịch học online</h5>
        <div class="elearning-manager-content">
          <div class="elearning-manager-content__title">
            <div class="elearning-manager-content__title__nav">
              <a
                :class="tab == 1 ? 'active' : ''"
                @click="$router.push({ path: $route.path, query: { tab: TABS[0] } })"
              >Đang diễn ra</a>
              <a
                :class="tab == 2 ? 'active' : ''"
                @click="$router.push({ path: $route.path, query: { tab: TABS[1] } })"
              >Đã lên lịch</a>
              <a
                :class="tab == 3 ? 'active' : ''"
                @click="$router.push({ path: $route.path, query: { tab: TABS[2] } })"
              >Đã kết thúc</a>
              <a
                :class="tab == 4 ? 'active' : ''"
                @click="$router.push({ path: $route.path, query: { tab: TABS[3] } })"
              >Đã hủy</a>
              <a
                :class="tab == 5 ? 'active' : ''"
                @click="$router.push({ path: $route.path, query: { tab: TABS[4] } })"
              >
                Xử lý yêu cầu
                <span v-if="scheduleListCounting > 0" class="badge">{{ scheduleListCounting }}</span>
              </a>
            </div>
            <n-link
              :to="'/elearning/manager/online-class/create'"
              class="btn btn--size-sm btn--color-info btn--square btn-right"
            >
              <IconPlusCircle class="fill-white mr-2" />
              <span class="color-white">Tạo phòng học online</span>
            </n-link>
          </div>

          <div class="elearning-manager-content__main">
            <keep-alive>
              <component v-bind:is="currentTabComponent"></component>
            </keep-alive>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconPlusCircle from "~/assets/svg/design-icons/plus-circle.svg?inline";
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import {
  initBreadcrumb,
  createPageTitle,
  initPageTitle,
  getParamQuery,
} from "~/utils/common";

const STORE_PUBLIC_SEARCH = "elearning/public/public-search";

const Tab1 = () =>
  import("~/components/page/elearning/manager/olclass/tabs/Streaming.vue");
const Tab2 = () =>
  import("~/components/page/elearning/manager/olclass/tabs/Scheduled.vue");
const Tab3 = () =>
  import("~/components/page/elearning/manager/olclass/tabs/Finished.vue");
const Tab4 = () =>
  import("~/components/page/elearning/manager/olclass/tabs/Deleted.vue");
const Tab5 = () =>
  import("~/components/page/elearning/manager/olclass/tabs/Request.vue");
const TABS = [
  "streaming",
  "scheduled",
  "finished",
  "canceled",
  "pending_request",
];

export default {
  middleware: ["teacher-role"],

  watchQuery: ["tab"],

  components: {
    ElearningManagerSide,
    IconPlusCircle,
    Tab1,
    Tab2,
    Tab3,
    Tab4,
    Tab5,
  },

  data() {
    const { tab = "" } = this.$route.query || {};
    const dataTab = tab ? TABS.indexOf(tab) + 1 : 1;

    return {
      tab: dataTab,
    };
  },

  computed: {
    ...mapState("auth", ["loggedUser"]),
    ...mapState('elearning/teaching/olclass-modify-schedule', ["scheduleListCounting"]),
    currentTabComponent: function () {
      // List of tabs
      const MATCHED_TABS = ["Tab1", "Tab2", "Tab3", "Tab4", "Tab5"];
      return this.tab > 0 ? MATCHED_TABS[this.tab - 1] : MATCHED_TABS[0];
    },
    ...mapState(STORE_PUBLIC_SEARCH, {
      stateElearnings: "Elearnings",
    }),
  },

  // Get elearnings
  async fetch({ params, query, store, route }) {
    const userId = store.state.auth.token ? store.state.auth.token.id : "";
    await Promise.all([
      // store.dispatch(
      //   `${STORE_PUBLIC_SEARCH}/${actionTypes.ELEARNING_PUBLIC_ELEARNING.LIST}`,
      //   { params: { teacher_id: userId, status: "APPROVED" } }
      // ),
      store.dispatch(
        `elearning/teaching/olclass-modify-schedule/${actionTypes.TEACHING_ONLINE_CLASS_MODIFY_SCHEDULE.LIST_COUTING}`,
        { params: { status: 0 } }
      ),
    ]);
  },

  created() {
    this.TABS = TABS;
    console.log('scheduleListCounting', this.scheduleListCounting)
  },

  mounted() {
    const breadcrumb = [
      {
        title: "Quản lý E-learning",
        to: "/elearning/manager",
      },
      {
        title: "Phòng học online",
        to: "",
      },
    ];
    initBreadcrumb(this, breadcrumb);
    initPageTitle(this, createPageTitle("Quản lý phòng học online"));
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/manager/_elearning-manager.scss";
@import "~/assets/scss/components/elearning/manager/_elearning-manager-content.scss";
</style>