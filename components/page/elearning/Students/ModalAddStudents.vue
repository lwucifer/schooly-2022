<template>
  <div>
    <app-modal
      centered
      :width="600"
      :component-class="{ 'invite-student-modal': true }"
      :footer="false"
      @close="$emit('close', false)"
      title="Thêm mới học sinh"
    >
      <div slot="content">
        <div class="add-student__menu-tab">
          <div class="wrap-menu-tab">
            <button
              class="btn-tab"
              @click="handleClickTab(1)"
              id="tab1"
              :class="tab == 1 ? 'active' : ''"
            >
              Danh sách học sinh trong trường
            </button>
            <button
              class="btn-tab"
              @click="handleClickTab(2)"
              :class="tab == 2 ? 'active' : ''"
            >
              Danh sách học sinh ngoài
            </button>
          </div>
        </div>
        <div class="add-student__content" v-show="tab == 1">
          <p>
            Gửi lời mời tham gia nhóm học tập đến các học sinh trong trường của
            bạn
          </p>
          <div class="d-flex align-items-center mt-3">
            <app-search 
              placeholder="Tìm kiếm tên, số điện thoại và email"
              bordered 
              class="mb-0 w-100 pr-4"
              @submit="handleSearchStudents"
            />
            <strong class="w-90">Chọn lớp</strong>
            <app-vue-select
              :options="classList"
              placeholder="Lớp"
              has-border
              class="add-student__select-class"
              :reduce="item => item.id"
              label="name"
              @input="class_id => (paramsGetStudents.class_id = class_id)"
            />
          </div>
          <div class="add-student__wrap-checkbox">
            <div class="select-all row align-items-center">
              <AppCheckbox
                label="Chọn tất cả danh sách"
                v-model="allStudentSelected"
                @change="check => handleSelectAll(check, 1)"
                :checked="selectedSItems == this.students.filter(s=> s.joined == false)"
                class="col-md-4 px-0"
              />
              <div class="col-md-4">Tên đăng nhập</div>
              <div class="col-md-1">Lớp</div>
              <div class="col-md-3">Trạng thái</div>
            </div>
            <div v-for="(item, index) in students" :key="index" class="mt-3 row align-items-center">
              <div class="col-md-4 px-0 d-flex align-items-center">
                <AppCheckbox
                  :disabled="item.joined"
                  :checked="selectedSItems.includes(item)"
                  @change="handleCheckBox($event, item, 1)"
                  class="mr-3"
                />
                <span :class="selectedSItems.includes(item) ? 'text-success':''">{{item.student}}</span>
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
              <div class="col-md-1">{{item.class_name}}</div>
              <div class="col-md-3 text-info" 
                v-if="item.joined"
                @change="handleCheckBox($event, item, 1)">
                Đã vào nhóm
              </div>
              <div class="col-md-3" v-else>Chưa vào nhóm</div>
            </div>
          </div>
        </div>
        <div class="add-student__content" v-show="tab == 2">
          <p>
            Gửi lời mời tham gia nhóm học tập đến các học sinh đã tham gia các
            bài giảng/khoá học của bạn nhưng không phải là học sinh của
            {{organizationName}}
          </p>
          <app-search 
              placeholder="Tìm kiếm tên, số điện thoại và email"
              bordered 
              class="mb-0 mt-4"
              style="width:36rem"
              @submit="handleSearchParticipants"
          />
          <div class="add-student__wrap-checkbox">
            <div class="select-all row align-items-center">
              <AppCheckbox
                label="Chọn tất cả danh sách"
                v-model="allParticipantSelected"
                @change="check => handleSelectAll(check, 2)"
                class="col-md-5 px-0"
              />
              <div class="col-md-4">Tên đăng nhập</div>
              <div class="col-md-3">Trạng thái</div>
            </div>
            <div
              v-for="(item, index) in participants"
              :key="index"
              class="mt-3 row align-items-center"
            >
              <div class="col-md-5 px-0 d-flex align-items-center">
                <AppCheckbox
                  :disabled="item.joined"
                  :checked="selectedPItems.includes(item)"
                  @change="handleCheckBox($event, item, 2)"
                  class="mr-3"
                />
                <span :class="selectedPItems.includes(item) ? 'text-success':''">{{get(item,"student",get(item,"name",''))}}</span>
              </div>
              <div class="col-md-4 px-0">
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
              <div class="col-md-3 text-info" 
                v-if="item.joined">
                Đã vào nhóm</div>
              <div class="col-md-3" v-else>Chưa vào nhóm</div>
            </div>
          </div>
        </div>
        <div class="add-student__action">
          <app-button
            class="mr-3"
            outline
            square
            @click="$emit('close', false)"
          >
            Huỷ
          </app-button>
          <app-button class="" @click="handleAddGroupMember" :loading="loading">
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
import { addAllOptionSelect } from "~/utils/common";

export default {
  components: {
    IconAdd24px
  },

  props: {
    group_id: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      tab: 1,
      selectedSItems: [],
      selectedPItems: [],
      paramsGetStudents: {
        linked: true,
        class_id: null,
        keyword:null,
        group_id:this.$route.params.id
      },
      paramsGetParticipants:{
        group_id:this.$route.params.id,
        keyword: null
      },
      loading: false
    };
  },

  mounted() {
    // useEffect(this, this.getStudents.bind(this), ["paramsGetStudents"]);
    //useEffect(this, this.getParticipants.bind(this), ["paramsGetParticipants"],true);
    //this.$store.dispatch("elearning/study-group/group/getParticipants");

    // set selectedItems if selected
    this.selectedSItems = [...this.memberUserIds];
    console.log("[mounted] modal show", this.selectedSItems);
    this.$nextTick(() => {
      this.handleClickTab(1);
    });
    setTimeout(() => {
      this.handleClickTab(1);
    }, 100);
  },

  computed: {
    ...mapState("elearning/study-group/group", {
      classes: "classes",
      students: "students",
      participants: "participants"
    }),
    ...mapState("elearning/study-group/member", ["memberGroups"]),
    ...mapGetters("auth", ["organizationName"]),

    selectedItems() {
      return [...this.selectedSItems, ...this.selectedPItems];
    },
    memberUserIds() {
      const memberUserIds =
        !this.memberGroups && !this.memberGroups.content
          ? []
          : this.memberGroups.content.map(item => {
              return {
                user_id: item.user_id,
                disabled: true
              };
            });
      // this.selectedSItems = [...memberUserIds];
      return memberUserIds;
    },

    classList() {
      console.log("[classList]", this.classes);
      return !this.classes ? [] : addAllOptionSelect(this.classes, "lớp");
    },

    allStudentSelected: {
      set(value) {
        return value;
      },
      get() {
        const stds =  this.students.filter(s=> s.joined == false)
        return this.selectedSItems && isEqual(sortBy(this.selectedSItems,'user_id'), sortBy(stds,'user_id'));
      }
    },

    allParticipantSelected: {
      set(value) {
        return value;
      },
      get() {
        const ptcs = this.participants.filter(s=> s.joined == false);
        return this.selectedPItems && isEqual(sortBy(this.selectedPItems,'user_id'), sortBy(ptcs,'user_id'));
      }
    }
  },

  methods: {
    ...mapActions("elearning/study-group/group", ["getStudents","getParticipants"]),

    ...mapActions("elearning/study-group/member", [
      "getListStudyGroupMember",
      "addStudyGroupMember"
    ]),

    async handleAddGroupMember() {
      const userIds = this.selectedItems
        .filter(f => !f.disabled)
        .map(item => {
          return item.user_id;
        });
      const payload = { group_id: this.group_id, user_ids: userIds };
      console.log("[handleAddGroupMember] payload", payload);
      if (!this.isValidPayload(payload)) {
        return;
      }
      this.loading = true;

      const result = await this.addStudyGroupMember(payload);
      if (result.success == RESPONSE_SUCCESS) {
        this.$toasted.success("Thêm mới học sinh vào nhóm thành công");
        this.$emit("search");
        this.$emit("close", false);
      } else {
        this.$toasted.error("Thêm mới học sinh vào nhóm học tập thất bại");
      }
      this.loading = false;
      this.selectedSItems = [];
      this.selectedPItems = [];
    },

    handleSelectAll(checked, tab) {
      console.log("[handleSelectAll]", checked);
      if (checked) {
        tab == 1 && (this.selectedSItems = this.students.filter(s=> s.joined == false));
        tab == 2 && (this.selectedPItems = this.participants.filter(s=> s.joined == false));
      } else {
        // this.selectedItems = [];
        const stds =  this.students.filter(s=> s.joined == false)
        const ptcs = this.participants.filter(s=> s.joined == false);
        if(tab == 1 && this.selectedSItems.length != (stds.length-1)){
          this.selectedSItems = [];
        }
        if(tab == 2 && this.selectedPItems.length != (ptcs.length-1)){
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
      if (!payload.user_ids || payload.user_ids.length < 1) {
        this.$toasted.error("Bạn chưa chọn học sinh cho nhóm học tập");
        return false;
      }

      return true;
    },
    async fetchStudent(){
      await this.getStudents(this.paramsGetStudents)
    },
    async handleSearchStudents(val){
      this.paramsGetStudents.keyword = val;
      await this.fetchStudent();
    },
    async fetchParticipants(){
      await this.getParticipants(this.paramsGetParticipants);
    },
    async handleSearchParticipants(val){
      this.paramsGetParticipants.keyword = val;
      await this.fetchParticipants();
    },
    handleClickTab(tab) {
      this.tab = tab;

      // set selectedItems if selected when change tab
      this.selectedSItems = [...this.memberUserIds];
      this.selectedPItems = [...this.memberUserIds];
    },
    get
  },
  created(){
    this.fetchParticipants();
    this.fetchStudent();
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/students/_add-student.scss";
</style>
