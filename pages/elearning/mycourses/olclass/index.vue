<template>
  <div class="container">    
    <div class="row">
      <div class="col-md-3">
        <MyCourseSide :active="8"/>
      </div>
      <div class="col-md-9">
        <h5 class="page-title">
          Lớp học online
        </h5>
        <div class="elearning-manager-content">
          <div class="elearning-manager-content__title">
            <div class="elearning-manager-content__title__nav">
              <a :class="tab == 1 ? 'active' : ''" @click="tab = 1">Đang diễn ra</a>
              <a :class="tab == 3 ? 'active' : ''" @click="tab = 3">Đã kết thúc</a>
            </div>
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
  import IconPlusCircle from '~/assets/svg/design-icons/plus-circle.svg?inline'
  import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide"
  import MyCourseSide from "~/components/page/elearning/mycourses/MyCourseSide"

  import { mapState } from "vuex"
  import * as actionTypes from "~/utils/action-types";
  import { initBreadcrumb, createPageTitle, initPageTitle, getParamQuery } from "~/utils/common";

  const STORE_PUBLIC_SEARCH = "elearning/public/public-search";

  const Tab1 = () => import("~/components/page/elearning/mycourses/olclass/streaming.vue")
  const Tab3 = () => import("~/components/page/elearning/mycourses/olclass/finished.vue")

  export default {
    components: {
      ElearningManagerSide,
      IconPlusCircle,
      MyCourseSide,
      Tab1,
      Tab3
    },

    data() {
      return {
        tab: 1,
      }
    },
    computed: {
      ...mapState("auth", ["loggedUser"]),
      currentTabComponent: function() {
        // List of tabs
        const MATCHED_TABS = ['Tab1', 'Tab2', 'Tab3', 'Tab4']
        return (this.tab > 0) ? MATCHED_TABS[this.tab - 1] : MATCHED_TABS[0]
      },
      ...mapState('elearning/study/study-elearning', {
        stateElearnings: "Elearnings"
      }),
    },

    // Get elearnings
    async fetch({ params, query, store, route }) {
      const userId = store.state.auth.token ? store.state.auth.token.id : "";
      await Promise.all([
        store.dispatch(`${STORE_PUBLIC_SEARCH}/${actionTypes.ELEARNING_PUBLIC_ELEARNING.LIST}`,
            { params: {teacher_id: userId, status: 'APPROVED'} }),
        
        store.dispatch(`elearning/study/study-elearning/myElearnings`),
      ]);
    },

    methods: {},
  };
</script>

<style lang="scss">
  @import "~/assets/scss/components/elearning/manager/_elearning-manager.scss";
  @import "~/assets/scss/components/elearning/manager/_elearning-manager-content.scss";
  .page-content .elearning-manager-content__title__nav a {
    font-size: 1.4rem;
  }
  .app-table .link{
    display: inline-block;
  }
</style>