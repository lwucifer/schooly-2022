<template>
  <app-modal
    centered
    :width="600"
    :component-class="{ 'invite-student-modal': true }"
    :footer="false"
    @close="close"
    title="Sửa nhóm học tập"
  >
    <div slot="content">
      <div class="row mx-3 d-flex align-items-center mb-4">
        <span class="col-md-3 text-dark" style="font-size:1.6rem"
          >Tên nhóm</span
        >
        <app-input class="col-md-9 mb-0" v-model="payload.name" />
      </div>
      <div class="row mx-3 d-flex align-items-center mb-4">
        <span class="col-md-3 text-dark" style="font-size:1.6rem"
          >Số thành viên</span
        >
        <app-input class="col-md-9 mb-0" disabled v-model="members" />
      </div>
      <!-- <div class="row mx-3 d-flex align-items-center mb-3">
        <span class="col-md-3 text-dark" style="font-size:1.6rem"
          >Thời gian mở đề</span
        >
        <app-date-picker
            class="col-md-7"
            square
            placeholder="yyyy-mm-dd"
            valueFormat="YYYY-MM-DD"
          ></app-date-picker>
      </div> -->
      <div class="add-student__action">
        <app-button
          class="mr-4 pl-5 pr-5"
          outline
          square
          @click="$emit('close')"
        >
          Huỷ
        </app-button>
        <app-button
          class="pl-5 pr-5"
          :loading="loading"
          @click="handleEditGroup"
        >
          Xác nhận
        </app-button>
      </div>
    </div>
  </app-modal>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { get, isEqual, pickBy, identity } from "lodash";
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
      loading: false,
      payload: {
        name: ""
      },
      members: 0
    };
  },

  mounted() {
    this.payload.name = this.groupName;
    this.members = this.groupMembers;
  },

  computed: {
    ...mapState("elearning/study-group/group", ["detailGroup"]),
    groupName() {
      return get(this, "detailGroup.name", "");
    },
    groupMembers() {
      return get(this, "detailGroup.members", 0);
    },
    groupId() {
      return get(this, "detailGroup.id", null);
    }
  },

  methods: {
    ...mapActions("elearning/study-group/group", [
      "editStudyGroup",
      "getListStudyGroup"
    ]),

    async handleEditGroup() {
      console.log("[handleEditGroup]");

      if (!this.payload.name) {
        this.$toasted.error("Tên nhóm không hợp lệ");
        return;
      }
      this.loading = true;
      const result = await this.editStudyGroup({
        id: this.groupId,
        name: this.payload.name
      });
      if (result.success == RESPONSE_SUCCESS) {
        this.$emit("close");
        this.$toasted.success("Cập nhật nhóm học tập thành công");
        this.getListStudyGroup();
      } else {
        this.$toasted.error("Cập nhật nhóm học tập thất bại");
      }

      this.loading = false;
    },

    close() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/students/_add-student.scss";
</style>
