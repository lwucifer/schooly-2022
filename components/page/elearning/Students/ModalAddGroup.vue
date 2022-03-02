<template>
  <div class="ml-auto">
    <app-button class="ml-auto" @click="showModal = true">
      <IconAdd24px height="16" />
      Thêm mới
    </app-button>
    <app-modal
      centered
      :width="600"
      :component-class="{ 'invite-student-modal': true }"
      :footer="false"
      @close="showModal = false"
      title="Thêm nhóm học tập"
      v-if="showModal"
    >
      <div slot="content">
        <div class="row mx-3 d-flex align-items-center mb-5">
          <span class="col-md-2 text-dark" style="font-size:1.6rem"
            >Tên nhóm</span
          >
          <app-input class="col-md-10 mb-0" v-model="payloadAddGroup.name" />
        </div>
        <div class="add-student__menu-tab">
          <div class="wrap-menu-tab">
            <button
              class="btn-tab"
              @click="changeTab(1)"
              :class="tab == 1 ? 'active' : ''"
            >
              Danh sách học sinh trong trường
            </button>
            <button
              class="btn-tab"
              @click="changeTab(2)"
              :class="tab == 2 ? 'active' : ''"
            >
              Danh sách học sinh ngoài
            </button>
          </div>
        </div>
        <div class="add-student__content" v-show="tab == 1">
          <div style="height:6rem">
            <p>
              Gửi lời mời tham gia nhóm học tập đến các học sinh trong trường của
              bạn
            </p>
            <div class="d-flex align-items-center mt-3">
              <app-search 
                  placeholder="Tìm kiếm tên, số điện thoại và email"
                  bordered 
                  class="mb-0 mr-4"
                  style="width:36rem"
                  @submit="handleSearchStudent"
              />
              <strong>Chọn lớp</strong>
              <app-vue-select
                :options="classesOpt"
                placeholder="Lớp"
                has-border
                class="add-student__select-class"
                :reduce="item => item.id"
                label="name"
                @input="class_id => (paramsGetStudents.class_id = class_id)"
              />
            </div>
          </div>
          <div class="add-student__wrap-checkbox">
            <div class="select-all row align-items-center">
              <AppCheckbox
                label="Chọn tất cả danh sách"
                v-model="allStudentSelected"
                @change="check => handleSelectAll(check, 1)"
                class="col-md-4"
              />
              <div class="col-md-4">Tên đăng nhập</div>
              <div class="col-md-1">Lớp</div>
              <div class="col-md-3">Trạng thái</div>
            </div>
            <div v-for="(item, index) in students" :key="index" class="mt-3 row align-items-center">
              <div class="col-md-4 d-flex align-items-center">
                <AppCheckbox
                  :checked="selectedSItems.includes(item)"
                  @change="handleCheckBox($event, item, 1)"
                  class="mr-3"
                />
                <span :class="selectedSItems.includes(item) ? 'text-success':''">{{get(item,"student",get(item,"name",''))}}</span>
              </div>
              <div class="col-md-4">
                <v-popover
                  trigger="hover"
                >
                  <div class="nowrap">
                    <span v-if="item.email">{{item.email | truncStrFilter(20)}}</span>
                    <span v-else>{{item.phone}}</span>
                  </div>
                  <template slot="popover" class="tooltip-detail">
                    <div class="">
                      <span v-if="item.email">{{item.email}}</span>
                      <span v-else>{{item.phone}}</span>
                    </div>
                  </template>
                </v-popover>
              </div>
              <div class="col-md-1">{{ get(item,"class_name","") }}</div>
              <div class="col-md-3" v-if="!item.joined">Chưa vào nhóm</div>
            </div>
          </div>
        </div>
        <div class="add-student__content" v-show="tab == 2">
          <p style="height:6rem">
            Gửi lời mời tham gia nhóm học tập đến các học sinh đã tham gia các
            bài giảng/khoá học của bạn nhưng không phải là học sinh của {{organizationName}}
          </p>
          <app-search 
              placeholder="Tìm kiếm tên, số điện thoại và email"
              bordered 
              class="mb-0"
              style="width:36rem"
              @submit="handleSearchParticipants"
          />
          <div class="add-student__wrap-checkbox">
            <div class="select-all row align-items-center">
              <AppCheckbox
                label="Chọn tất cả danh sách"
                v-model="allParticipantSelected"
                @change="check => handleSelectAll(check, 2)"
                class="col-md-5"
              />
              <div class="col-md-4 pr-3">Tên đăng nhập</div>

              <div class="col-md-3">Trạng thái</div>
            </div>
            <div
              v-for="(item, index) in participants"
              :key="index"
              class="mt-3 row align-items-center"
            >
              <div class="col-md-5 d-flex align-items-center">
                <AppCheckbox
                  :checked="selectedPItems.includes(item)"
                  @change="handleCheckBox($event, item, 2)"
                  class="mr-3"
                />
                <span :class="selectedPItems.includes(item) ? 'text-success':''">{{get(item,"student",get(item,"name",''))}}</span>
              </div>
              <div class="col-md-4">
                <v-popover
                  trigger="hover"
                >
                  <div class="nowrap">
                    <span v-if="item.email">{{item.email | truncStrFilter(20)}}</span>
                    <span v-else>{{item.phone}}</span>
                  </div>
                  <template slot="popover" class="tooltip-detail">
                    <div class="">
                      <span v-if="item.email">{{item.email}}</span>
                      <span v-else>{{item.phone}}</span>
                    </div>
                  </template>
                </v-popover>
              </div>
              <div class="col-md-3">Chưa vào nhóm</div>
            </div>
          </div>
        </div>
        <div class="add-student__action">
          <app-button class="mr-3" outline square @click="showModal = false">
            Huỷ
          </app-button>
          <app-button class="" :loading="loading" @click="handleAddGroup">
            Xác nhận
          </app-button>
        </div>
      </div>
    </app-modal>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { get, isEqual, pickBy, identity,sortBy } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { useEffect, getParamQuery } from "~/utils/common";
import IconAdd24px from "~/assets/svg/v2-icons/add_24px.svg?inline";

import { ELEARNING_TEACHING_GROUPS } from "~/utils/endpoints";
import { RESPONSE_SUCCESS } from "~/utils/config";
import { allOptionSelect } from "~/utils/common";

export default {
  components: {
    IconAdd24px
  },

  data() {
    return {
      showModal: false,
      tab: 1,
      selectedSItems: [],
      selectedPItems: [],
      paramsGetStudents: {
        linked: true,
        class_id: null,
        keyword:null
      },
      paramsGetParticipants:{
        keyword:null
      },
      payloadAddGroup: {
        name: null,
        description: null
        // id: null
      },
      loading: false,
      checkAll:false
    };
  },

  mounted() {
    useEffect(this, this.getStudents.bind(this), ["paramsGetStudents"]);
    useEffect(this, this.getParticipants.bind(this), ["paramsGetParticipants"]);
    //this.$store.dispatch("elearning/study-group/group/getParticipants");
  },

  computed: {
    ...mapState("elearning/study-group/group", [
      "classes",
      "students",
      "participants",
    ]),

    ...mapGetters("elearning/study-group/group", [
      "classesOpt"
    ]),
    ...mapGetters("auth", ["organizationName"]),

    selectedItems() {
      return [...this.selectedSItems, ...this.selectedPItems];
    },

    allStudentSelected: {
      set(value) {
        return value;
      },
      get() {
        return this.selectedSItems && isEqual(sortBy(this.students,['user_id']),sortBy(this.selectedSItems,'user_id'));
      }
    },
    allParticipantSelected: {
      set(value) {
        return value;
      },
      get() {
        // const ptcs = this.participants.map(it => {
        //   return {
        //     user_id: it.user_id
        //   };
        // });
        // return ptcs && isEqual(this.selectedPItems, ptcs);
        return this.selectedPItems && isEqual(sortBy(this.participants,['user_id']),sortBy(this.selectedPItems,'user_id'));
      }
    }
  },

  methods: {
    ...mapActions("elearning/study-group/group", [
      "getStudents",
      "addStudyGroup",
      "getListStudyGroup",
      "getParticipants"
    ]),

    async handleAddGroup() {
      const userIds = this.selectedItems.map(item => {
        return item.user_id;
      });
      const payload = { ...this.payloadAddGroup, user_ids: userIds };
      console.log("[handleAddGroup] payload", payload);
      if(!this.isValidPayload(payload)){
        return;
      }

      this.loading = true;
      const result = await this.addStudyGroup(payload);
      if (result.success == RESPONSE_SUCCESS) {
        this.getListStudyGroup();
        this.showModal = false;
        this.payloadAddGroup.name = "";
        this.$toasted.success("Thêm mới nhóm thành công");
      } else {
        this.$toasted.error("Thêm mới nhóm học tập thất bại");
      }

      this.loading = false;
      this.selectedSItems = [];
      this.selectedPItems = [];
    },

    handleSelectAll(checked, tab) {
      console.log("[handleSelectAll]", checked);
      if (checked) {
        tab == 1 && (this.selectedSItems = this.students);
        tab == 2 && (this.selectedPItems = this.participants);
      } else {
        // this.selectedItems = [];
        if(tab == 1 && this.selectedSItems.length != (this.students.length-1)){
          this.selectedSItems = [];
        }
        if(tab == 2 && this.selectedPItems.length != (this.participants.length-1)){
          this.selectedPItems = [];
        }
      }
    },

    handleCheckBox(checked, item, tab) {
      if (checked) {
        tab == 1 &&
          this.selectedSItems.findIndex(s => s.user_id == item.user_id) == -1 &&
          this.selectedSItems.push(item);
        tab == 2 &&
          this.selectedPItems.findIndex(s => s.user_id == item.user_id) == -1 &&
          this.selectedPItems.push(item);
      } else {
        tab == 1 &&
          (this.selectedSItems = this.selectedSItems.filter(
            s => s.user_id != item.user_id
          ));
        tab == 2 &&
          (this.selectedPItems = this.selectedPItems.filter(
            s => s.user_id != item.user_id
          ));
      }
      console.log("[handleCheckBox]", this.selectedItems, checked, item);
    },

    isValidPayload(payload) {
      if(!payload.name) {
        this.$toasted.error("Tên nhóm học tập chưa đúng");
        return false;
      }
      if(!payload.user_ids || payload.user_ids.length < 1) {
        this.$toasted.error("Bạn chưa chọn học sinh cho nhóm học tập");
        return false;
      }

      return true;
    },

    changeTab(tab) {
      this.tab = tab;
    },

    handleSearchStudent(val){
      this.paramsGetStudents.keyword = val;
    },

    handleSearchParticipants(val){
      this.paramsGetParticipants.keyword = val;
    },
    get
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/students/_add-student.scss";
</style>
