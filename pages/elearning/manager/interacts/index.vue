
<template>
  <div class="container">
    <breadcrumb />

    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide :group=2 :active=6 />
      </div>
      <div class="col-md-9">
        <sub-block-section title="Tương tác với học sinh">
          <template #content>
            <div
              class="elearning-manager-content__title mb-4 justify-content-between align-items-center"
            >
              <div class="elearning-manager-content__title__nav">
                <a :class="tab == 1 ? 'active' : ''" @click="tab = 1">HỎI ĐÁP</a>
                <a :class="tab == 2 ? 'active' : ''" @click="tab = 2">THÔNG BÁO</a>
              </div>

              <app-button
                nuxt
                :to="'/elearning/manager/interacts/createnotify'"
                v-if="tab == 2"
                class="make-noti-button btn--color-info"
              >
                <IconPlusCircle class="mr-2" />Tạo thông báo
              </app-button>
            </div>

            <div class="elearning-manager-content__main">
              <keep-alive>
                <component :loading="loading" v-bind:is="currentTabComponent"></component>
              </keep-alive>
            </div>
          </template>
        </sub-block-section>
      </div>
    </div>
  </div>
</template>

<script>
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import IconPlusCircle from "~/assets/svg/design-icons/plus-circle.svg?inline";

import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
const QATab = () => import("~/components/page/elearning/manager/interacts/QA");
const NotifyTab = () => import("~/components/page/elearning/manager/interacts/notify");
const STORE_NAME_INTERACTS = "elearning/teaching/interactive-listquestion";
const STORE_PUBLIC_SEARCH = "elearning/public/public-search";
const STORE_TEACHING_PUBLIC_LIST = "elearning/teaching/teaching-public";
const STORE_NAMESPACE = "elearning/teaching/elearning";

import { initBreadcrumb, createPageTitle, initPageTitle, getParamQuery } from "~/utils/common";

export default {
  layout: "manage",

  components: {
    ElearningManagerSide,
    QATab,
    NotifyTab,
    IconPlusCircle
  },
  async fetch({ params, store, query }) {
    const userId = store.state.auth.token ? store.state.auth.token.id : "";
    await Promise.all([
      store.dispatch(
        `${STORE_NAME_INTERACTS}/${actionTypes.TEACHING_INTERACTIVE_LISTQUESTION.LIST}`
      ),
      // store.dispatch(
      //   `${STORE_PUBLIC_SEARCH}/${actionTypes.ELEARNING_PUBLIC_SEARCH.DETAIL}`,
      //   { userId }
      // )
      store.dispatch(
        `${STORE_TEACHING_PUBLIC_LIST}/${actionTypes.TEACHING_PUBLIC_LIST.LIST}`,
        {
          params: {
            teacher_id: userId
          }
        }
      )
    ]);
  },
  data() {
    return {
      tab: 1,
      isAuthenticated: true,
      loading: false
    };
  },
  computed: {
    ...mapState("auth", ["loggedUser"]),
    ...mapState(STORE_PUBLIC_SEARCH, ["Lessons"]),
    ...mapState(STORE_TEACHING_PUBLIC_LIST, ["teachingPublicList"]),
    ...mapState(STORE_NAMESPACE, {
      stateElearnings: "elearnings"
    }),
    currentTabComponent: function() {
      // List of tabs
      const MATCHED_TABS = ["QATab", "NotifyTab"];
      return this.tab > 0 ? MATCHED_TABS[this.tab - 1] : MATCHED_TABS[0];
    }
  },
  mounted(){
    const hash = this.$route.hash
    const type = hash ? hash.substring(1) : ''
    if(type == 'notify'){
      this.tab = 2;
      console.log('hello')
    }
    this.setBreadcrumb()
  },
  methods: {
    onPageChange(e) {
      const that = this;
      that.pagination = { ...that.pagination, ...e };
      console.log(that.pagination);
    },
    async fetchElearningCourses(){
      this.loading = true
      const payload = { 
        params:{
          status : "APPROVED",
          hide : false
        }
      }
      const result = await this.$store.dispatch(
        `${STORE_NAMESPACE}/${actionTypes.TEACHING_ELEARNINGS.LIST}`,
        payload
      )
      this.loading = false
    },
    setBreadcrumb() {
      const breadcrumb = [
        {
          title: 'Quản lý E-learning',
          to: '/elearning/manager'
        },
        {
          title: 'Tương tác với học sinh',
          to: ''
        },
      ]
      initBreadcrumb(this, breadcrumb);
      initPageTitle(this, createPageTitle('Quản lý tương tác với học sinh'));
    }
  },
  created(){
    this.fetchElearningCourses()
  }
};
</script>

<style lang="scss" scoped>
.make-noti-button {
  height: 32px;

  &:hover {
    background: #14bff4 !important;
  }
}
</style>