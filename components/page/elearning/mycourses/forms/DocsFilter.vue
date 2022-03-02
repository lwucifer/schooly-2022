<template>
  <div class="page-filter mb-4 pt-2">
    <div class="d-flex-center">
      <app-search
        class="mb-0 mr-3"
        style="max-width: 36rem; min-width: 30rem;"
        placeholder="Nhập để tìm kiếm"
        bordered
        size="sm"
        v-model="payload.keyword"
        @submit="handleChangeQuery"
        @keyup.enter.native="handleChangeQuery"
      />
      <filter-button
        @click="toggleFilter"
        :color="showFilter ? 'primary' : 'white'"
      ></filter-button>
    </div>

    <div v-if="showFilter" class="mt-15 d-flex-center">
      <app-vue-select
        class="mr-4"
        style="width: 13.5rem"
        placeholder="Môn học"
        label="text"
        has-border
        :options="subjectsOpt"
        @input="handleChangeSubject"
        :all-opt="allOpt"
      />

      <app-vue-select
        class="mr-4"
        style="width: 16.9rem"
        placeholder="Bài giảng/khoá học"
        label="text"
        has-border
        :options="elearningsOpt"
        @input="handleChangeElearning"
        :all-opt="allOpt"
      />

      <app-vue-select
        class="w-120 mr-4"
        placeholder="Thời gian"
        label="text"
        has-border
        :options="[allOpt, ...times]"
        @input="handleChangeTimes"
        :all-opt="allOpt"
      />

      <!-- <app-vue-select
                class="w-120 mr-4"
                placeholder="Lớp"
                label="text"
                has-border
                :options="classesOpt"
                @input="handleChangeClass"
                :all-opt="allOpt"
            /> -->

      <app-vue-select
        style="width: 20rem"
        placeholder="Lớp/ Nhóm học tập"
        label="text"
        has-border
        :options="groupClassOpt"
        v-model="payload.group_id"
        :reduce="item => item.value"
        @input="handleChangeGroup"
        :all-opt="allOpt"
      />
    </div>
  </div>
</template>

<script>
import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";

import { mapActions, mapGetters, mapState } from "vuex";
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";

const basePayload = {
    grade_id: null,
    subject_id: null,
    elearning_id: null, 
    keyword: null,
    time: null,
    page: 1,
    size: 10,
    class_id: null,
    group_id: null,
}

export default {
    data() {
      return {
        allOpt: {
            value: null,
            text: 'Tất cả'
        },
        times: [
            {value: 'yesterday', text: 'Hôm qua'},
            {value: 'today', text: 'Hôm nay'},
            {value: '7days', text: '7 ngày qua'},
            {value: '30days', text: '30 ngày qua'},
            {value: '90days', text: '90 ngày qua'},
        ],
        showFilter: false,
        payload: {...basePayload},
      }
  },

  components: {
    IconHamberger
  },

  mounted() {
    const userId = this.$store.state.auth.token
      ? this.$store.state.auth.token.id
      : "";
    this.$store.dispatch(
      `elearning/public/public-search/${actionTypes.ELEARNING_PUBLIC_ELEARNING.LIST}`,
      { params: { teacher_id: userId, status: "APPROVED" } }
    );

    const payload = {
      size: 999,
      sorted_by: 'OLDEST'
    }
    this.$store.dispatch("elearning/study-group/group/getListGroupClass", payload);
  },

  computed: {
    ...mapState("elearning/study-group/group", ["groupClasses"]),
    ...mapState("elearning/public/public-search", {
      elearnings: "Elearnings"
    }),
    ...mapGetters("elearning/public/public-subject", ["subjectsAllOpts"]),
    ...mapGetters("elearning/study-group/group", ["groupClassOpt"]),

    elearningsOpt() {
      console.log("elearningsOpt", this.elearnings);
      let data = get(this, "elearnings.data", []).map(item => ({
        value: item.id,
        text: item.name
      }));
      return [this.allOpt, ...data];
    },
    subjectsOpt() {
      let data = this.subjectsAllOpts.filter(item => !item.id);
      return [this.allOpt, ...data];
    }
  },

  methods: {
    get,

    checkPayload() {
        if (this.payload.subject_id) return true
        if (this.payload.elearning_id) return true
        if (this.payload.time) return true
        if (this.payload.class_id) return true
        if (this.payload.group_id) return true
        return false
    },
    toggleFilter() {
        this.showFilter = !this.showFilter;
        if (this.checkPayload() && !this.showFilter) {
            this.payload = {...this.payload, ...basePayload};
            this.$emit("search", this.payload);
        }
    },

    handleChangeGroup(group_id) {
      this.payload.page = 1;

      const groupClasses = get(this, "groupClasses.content", []);
      const groupObj = groupClasses.find(g => g.id == group_id);
      if (groupObj) {
        if (groupObj.type == "CLASS") {
          this.payload.group_id = null;
          this.payload.class_id = group_id;
        } else if (groupObj.type == "GROUP") {
          this.payload.class_id = null;
          this.payload.group_id = group_id;
        }
      } else {
        this.payload.class_id = null;
        this.payload.group_id = null;
      }
      this.$emit("search", this.payload);
    },

    handleChangeTimes(val) {
      this.payload.page = 1;
      this.payload.time = val.value;
      this.$emit("search", this.payload);
    },

    handleChangeSubject(val) {
      this.payload.page = 1;
      this.payload.subject_id = val.value;
      this.$emit("search", this.payload);
    },

    handleChangeElearning(val) {
      this.payload.page = 1;
      this.payload.elearning_id = val.value;
      this.$emit("search", this.payload);
    },

    handleChangeQuery(val) {
      if (val.length > 0) {
        this.payload.page = 1;
        this.payload.keyword = val;
        this.$emit("search", this.payload);
      }
    }
  }
};
</script>

<style></style>
