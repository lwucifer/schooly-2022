
<template>
  <div class="container">
    <breadcrumb />
    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide active="6" />
      </div>
      <div class="col-md-9">
        <sub-block-section
          title="Tạo thông báo"
          has-icon
        >
        <template v-slot:content>
        <div class="wrap-content-create-notify__ElearningManagerInteractive">
          <div class="notify-content">
            <div class="d-flex flex-column">
              <h5>Chọn bài giảng/ khóa học liên quan</h5>
              <!--
              <app-vue-select
                label="text"
                placeholder="Chọn"
                searchable
                class="content-select__ElearningManagerInteractive"
                @input="handleSelectElearning"
                :all-opt="allOpt"
                :options="lessonOpts"
              ></app-vue-select>
              -->
              <AppSelectIneractiveElearning
                @input="handleSelectElearning"
                placeholder="Chọn"
              />
            </div>

            <div class="form">
              <h5>Tiêu đề thông báo</h5>
              <app-input 
                placeholder="Nhập tiêu đề"
                v-model="params.title"
              />
            </div>

            <div class="form">
              <h5>Nội dung thông báo</h5>
              <app-input
                textarea
                placeholder="Xin chào..."
                class="textArea__ElearningManagerInteractive"
                v-model="params.content"
              />
            </div>

            <div class="d-flex justify-content-center">
              <app-button 
                square 
                size="sm"
                @click="handleSaveNotify"
              >
                Hoàn thành
                </app-button>
            </div>
          </div>
        </div>
        </template>
        </sub-block-section>
      </div>
    </div>

    <app-modal-notify
      v-if="showModal"
      type="success"
      title="Tạo thông báo thành công!"
      @close="handleCloseSuccess"
      @ok="handleOk"
    />
    <app-modal-notify
      v-if="showModalFail"
      type="error"
      title="Tạo thông báo thất bại!"
      @close="showModalFail = false"
      @ok="showModalFail = false"
    />
  </div>
</template>

<script>
import IconClose from "~/assets/svg/design-icons/multiply.svg?inline";
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import ArrowLeft from "~/assets/svg/v2-icons/arrow_left_black.svg?inline";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
const STORE_TEACHING_PUBLIC_LIST = "elearning/teaching/teaching-public";
const STORE_TEACHING_INTERACTIVE_ANNOUCONCEMENT = "elearning/teaching/interactive-announcement";
import { createInteract } from "~/models/elearning/Interacts";
import { get } from "lodash";
import AppSelectIneractiveElearning from "~/components/page/elearning/manager/interacts/AppSelectIneractiveElearning"
import { initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common";

export default {
  layout: "manage",
  components: {
    ElearningManagerSide,
    IconClose,
    ArrowLeft,
    AppSelectIneractiveElearning
  },
  data() {
    return {
      tab: 1,
      isAuthenticated: true,
      showModal: false,
      showModalFail:false,
      allOpt: {
          value: null,
          text: 'Tất cả'
      },
      params:{
        elearning_id: null,
        title: null,
        content: null
      }
    };
  },
  computed: {
    ...mapState("auth", ["loggedUser"]),
    ...mapState(STORE_TEACHING_PUBLIC_LIST, ["teachingPublicList"]),
    filterListLesson() {
      const data = this.teachingPublicList ? this.teachingPublicList : [];
      const filterData = data.map(item => {
        return {
          value: item.id,
          text: item.name
        };
      });
      return filterData;
    },
    lessonOpts() {
        return [this.allOpt, ...this.filterListLesson]
      }
  },
  created(){
    this.fetchElearning()
  },
  methods: {
    async fetchElearning() {
      let params = { ...this.params }
      const userId = this.$store.state.auth.token ? this.$store.state.auth.token.id : "";
      this.$store.dispatch(
          `${STORE_TEACHING_PUBLIC_LIST}/${actionTypes.TEACHING_PUBLIC_LIST.LIST}`,
          {
            params: {
              teacher_id: userId
            }
          }
        )
    },
    async handleSaveNotify(){
      const payload = createInteract(this.params)
      const result = await this.$store.dispatch(
        `${STORE_TEACHING_INTERACTIVE_ANNOUCONCEMENT}/${actionTypes.TEACHING_INTERACTIVE_ADD_ANNOUNCEMENT.ADD}`,
        payload
      );
      if (get(result, "success", false)) {
        this.showModal= true;
        return
      }
      this.showModalFail = true;
    },
    handleSelectElearning(val){
      this.params.elearning_id = val;
    },
    handleOk(){
      this.showModal = false;
      this.$router.push('/elearning/manager/interacts#notify')
    },
    handleCloseSuccess(){
      this.showModal = false;
      this.$router.push('/elearning/manager/interacts#notify')
    },
    setBreadcrumb() {
      const breadcrumb = [
        {
          title: 'Quản lý E-learning',
          to: '/elearning/manager'
        },
        {
          title: 'Tương tác với học sinh',
          to: '/elearning/manager/interacts'
        },
        {
          title: `Tạo thông báo`,
          to: ''
        },
      ]
      initBreadcrumb(this, breadcrumb);
      initPageTitle(this, createPageTitle('Quản lý tương tác với học sinh'));
    }
  },
  mounted() {
    this.setBreadcrumb()
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/manager/_elearning-interactive.scss";
</style>