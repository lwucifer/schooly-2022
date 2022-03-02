<template>
  <div class="container">
    <breadcrumb />
    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide active="3" />
      </div>
      <div class="col-md-9">
        <h5 class="page-title">
          {{get(stateClassInfo, 'data.name', '')}}
        </h5>
        <div class="elearning-manager-content">
          <div class="elearning-manager-content__title">
            <div class="elearning-manager-content__title__nav">
              <a :class="tab == 1 ? 'active' : ''" @click="tab = 1">Danh sách đã mời</a>
              <a :class="tab == 2 ? 'active' : ''" @click="tab = 2">Danh sách điểm danh</a>
            </div>
          </div>

          <div class="elearning-manager-content__main pt-3">
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
  import IconPlusCircle from '~/assets/svg/design-icons/plus-circle.svg?inline';
  import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
  import ModalInviteStudent from "~/components/page/elearning/manager/olclass/ModalInviteStudent"

  import { mapState } from "vuex"
  import * as actionTypes from "~/utils/action-types"
  import { get } from "lodash";
  import { initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common";

  const InvitedTab = () => import("./tabs/invited")
  const MusterTab = () => import("./tabs/muster")
  const STORE_NAMESPACE = "elearning/teaching/olclass";

  export default {    
    layout: "manage",
    
    components: {
      ElearningManagerSide,
      InvitedTab,
      MusterTab,
      IconPlusCircle,
      ModalInviteStudent
    },

    data() {
      return {
        tab: 1,
        openModal: false,
      }
    },

    computed: {
      ...mapState("auth", ["loggedUser"]),
      ...mapState(STORE_NAMESPACE, {
        stateClassInfo: "OnlineClassInfo"
      }),
      currentTabComponent: function() {
        // List of tabs
        const MATCHED_TABS = ['InvitedTab', 'MusterTab']
        return (this.tab > 0) ? MATCHED_TABS[this.tab - 1] : MATCHED_TABS[0]
      }
    },

    methods: {
      get,
      async getClassInfo() {
        await this.$store.dispatch(`${STORE_NAMESPACE}/${actionTypes.TEACHING_OLCLASSES.INFO}`, this.$route.params.id)
      },
      setBreadcrumb() {
        // const roomName = this.stateClassInfo && this.stateClassInfo.data ? this.stateClassInfo.data.name : '';
        const breadcrumb = [
          {
            title: 'Quản lý E-learning',
            to: '/elearning/manager'
          },
          {
            title: 'Phòng học online',
            to: '/elearning/manager/online-class'
          },
          {
            title: `Danh sách học sinh - ${get(this.stateClassInfo, 'data.name', '')}`,
            to: ``
          },
      
        ];
        initBreadcrumb(this, breadcrumb);
        initPageTitle(this, createPageTitle('Danh sách học sinh'));
      }
    },

    async created () {
      await this.getClassInfo();
      this.setBreadcrumb();
    },
    mounted() {
      // console.log('after get class ', this.stateClassInfo.data.name)
      // const roomName = this.stateClassInfo && this.stateClassInfo.data ? this.stateClassInfo.data.name : '';
      // const breadcrumb = [
      //   {
      //     title: 'Quản lý E-learning',
      //     to: '/elearning/manager'
      //   },
      //   {
      //     title: 'Phòng học online',
      //     to: '/elearning/manager/online-class'
      //   },
      //   {
      //     title: `Danh sách học sinh - ${roomName}`,
      //     to: ''
      //   },
    
      // ];
      // initBreadcrumb(this, breadcrumb);
      // initPageTitle(this, createPageTitle('Quản lý phòng học online'));
    }
  };
</script>

<style lang="scss">
  @import "~/assets/scss/components/elearning/manager/_elearning-manager-content.scss";
  @import "~/assets/scss/components/elearning/manager/_elearning-manager.scss";
</style>