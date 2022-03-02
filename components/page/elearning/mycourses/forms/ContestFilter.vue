<template>
  <div class="page-filter mb-4 pt-2">
    <div class="d-flex-center">
      <app-search
        class="mb-0 mr-3"
        style="max-width: 36rem; min-width: 30rem;"
        placeholder="Nhập để tìm kiếm"
        bordered
        size="sm"
        v-model="payload.query"
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
        class="w-120 mr-4"
        placeholder="Khối"
        label="text"
        has-border
        :options="[allOpt, ...grades]"
        @input="handleChangeGrades"
        :all-opt="allOpt"
      />

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
        class="w-120 mr-4"
        placeholder="Trạng thái"
        label="text"
        has-border
        :options="[
          allOpt,
          { value: 'ENABLE', text: 'Hoạt động' },
          { value: 'DIABLE', text: 'Không hoạt động' }
        ]"
        @input="handleChangeStatus"
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
        :reduce="item => item.value"
        @input="handleChangeGroup"
        v-model="payload.group_id"
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

export default {
  data() {
    return {
      allOpt: {
        value: null,
        text: "Tất cả"
      },
      showFilter: false,
      payload: {
        grade_id: null,
        subject_id: null,
        status: null,
        query: null,
        page: 1,
        size: 999,
        class_id: null,
        group_id: null
      }
    };
  },

  components: {
    IconHamberger
  },

  mounted() {
    const payload = {
      size: 999,
      sorted_by: 'OLDEST'
    };
    this.$store.dispatch("elearning/study-group/group/getListGroupClass", payload);
    // this.$store.dispatch(
    //   `elearning/teaching/classes/${actionTypes.ELEARNING_TEACHING_CLASS.LIST}`,
    //   { params: payload }
    // );
  },

  computed: {
    ...mapState("elearning/study-group/group", ["groupClasses"]),
    ...mapState("elearning/create", ["grades"]),
    ...mapGetters("elearning/public/public-subject", ["subjectsAllOpts"]),
    ...mapGetters("elearning/study-group/group", ["groupClassOpt"]),

    subjectsOpt() {
      let data = this.subjectsAllOpts.filter(item => !item.id);
      return [this.allOpt, ...data];
    }
  },

  methods: {
    get,

    toggleFilter() {
      this.showFilter = !this.showFilter;
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

    handleChangeGrades(val) {
      this.payload.page = 1;
      this.payload.grade_id = val.value;
      this.$emit("search", this.payload);
    },

    handleChangeSubject(val) {
      this.payload.page = 1;
      this.payload.subject_id = val.value;
      this.$emit("search", this.payload);
    },

    handleChangeStatus(val) {
      this.payload.page = 1;
      this.payload.status = val.value;
      this.$emit("search", this.payload);
    },

    handleChangeQuery(val) {
      if (val.length > 0) {
        this.payload.page = 1;
        this.payload.query = val;
        this.$emit("search", this.payload);
      }
    }
  }
};
</script>

<style></style>
