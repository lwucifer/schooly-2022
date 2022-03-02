<template>
  <div class="container">
    <breadcrumb />
    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide active="2" />
      </div>
      <div class="col-md-9">
        <sub-block-section :title="get(elearningInfo, 'name', '')" has-icon>
          <template v-slot:content>
            <div class="elearning-manager-content p-0">
              <div class="elearning-manager-content__title">
                <head-tabs
                  :tabs="tabs"
                  :active.sync="tab"
                  @selectedItem="changeTab"
                />
                <app-button
                  class="btn btn--size-sm btn--color-info btn--square btn-right"
                  @click="handleShowModalInvite"
                >
                  <IconPlusCircle class="fill-white mr-2 icon" />
                  <span class="color-white">Mời thêm học sinh</span>
                </app-button>
              </div>

              <div class="elearning-manager-content__main">
                <keep-alive>
                  <component v-bind:is="currentTabComponent"></component>
                </keep-alive>
              </div>
            </div>
          </template>
        </sub-block-section>
      </div>
    </div>
    <ModalInviteStudent
      v-if="showModalInvite"
      @close="closeModalInvite"
      :elearningInfo="elearningInfo"
    />
    <app-modal-notify
      v-if="showModalNotify"
      type="success"
      title="Gửi lời mời thành công"
      @close="closeModalNotify"
    />
  </div>
</template>

<script>
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import HeadTabs from "~/components/page/elearning/HeadTab";
import ModalInviteStudent from "~/components/page/elearning/manager/student/ModalInviteStudent";
import IconPlusCircle from "~/assets/svg/design-icons/plus-circle.svg?inline";
import { mapState } from "vuex";
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { redirectWithParams } from "~/utils/common";

const ListJoinedTab = () => import("./tabs/ListJoined");
const ListPendingTab = () => import("./tabs/ListPending");

const STORE_STUDY_INFO = "elearning/study/study-info";

export default {
  layout: "manage",

  components: {
    ElearningManagerSide,
    HeadTabs,
    ListJoinedTab,
    ListPendingTab,
    IconPlusCircle,
    ModalInviteStudent,
  },

  data() {
    return {
      showModalInvite: false,
      showModalNotify: false,
      tab: "joined",
      tabs: [
        {
          key: "joined",
          text: "Danh sách học sinh tham gia",
        },
        {
          key: "pending",
          text: "Danh sách học sinh chờ duyệt",
        },
      ],
      pagination: {
        total_elements: 0,
        total_pages: 1,
        number_of_elements: 0,
        last: false,
        size: 10,
        number: 0,
        first: true,
      },
      params: {
        page: 1,
        size: 10,
      },
      list: [],
      loading: false,
    };
  },

  fetch({ params, query, store }) {
    const elearningId = query.elearning_id;
    const listQuery = {
      params: {
        elearning_id: elearningId,
      },
    };
    Promise.all([
      store.dispatch(
        `${STORE_STUDY_INFO}/${actionTypes.ELEARNING_STUDY_INFO.LIST}`,
        listQuery
      ),
    ]);
  },

  computed: {
    ...mapState("elearning/detail", {
      elearningInfo: "info",
    }),
    currentTabComponent: function() {
      const MATCHED_TABS = {
        joined: "ListJoinedTab",
        pending: "ListPendingTab",
      };
      return MATCHED_TABS[this.tab];
    },
  },

  created() {
    this.tab =
      this.$route.query && this.$route.query.type == "pending"
        ? "pending"
        : "joined";
  },

  methods: {
    get,
    changeTab(key) {
      this.tab = key;
      this.$route.query && this.$route.query.type && redirectWithParams({type: key})
    },
    handleShowModalInvite() {
      this.showModalInvite = true;
    },
    closeModalInvite(close) {
      this.showModalInvite = close;
    },
    closeModalNotify() {
      this.showModalNotify = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/manager/_elearning-manager-content.scss";
</style>
