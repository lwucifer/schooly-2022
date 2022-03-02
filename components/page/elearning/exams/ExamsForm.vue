<template>
  <div class="manager-exams">
    <ExamsMenuTab @changeTab="handleChangeTab" />
    <div class="manager-exams__search">
      <app-search
        class="w-100"
        :placeholder="'Nhập để tìm kiếm'"
        bordered
        :size="'sm'"
        v-model="payload.query"
        @input="handleChangeQuery"
      />
    </div>
    <div class="d-flex">
      <filter-button
        @click="clickFilterSubmit"
        size="sm"
        class="btn-filter"
        :color="filterSelect ? 'primary' : 'white'"
      ></filter-button>
      <div class="d-flex w-100" v-if="filterSelect">
        <app-vue-select
          class="app-vue-select w-100 mx-4"
          label="name"
          placeholder="Khối"
          has-border
          :options="gradesAll"
          :all-opt="allFilter"
          v-model="selectedGrade"
          @input="handleChangeGrade"
        />
        <app-vue-select
          class="app-vue-select w-100 mx-4"
          label="text"
          placeholder="Lớp"
          has-border
          :options="classessAllOpts"
          v-model="selectedClass"
          @input="handleChangeClass"
        />
        <app-vue-select
          class="app-vue-select w-100 mr-4"
          label="text"
          placeholder="Môn học"
          has-border
          :options="subjectsAllOpts"
          v-model="selectedSubject"
          @input="handleChangeSubject"
        />
        <app-vue-select
          class="app-vue-select w-100 mr-4"
          label="text"
          placeholder="Nhóm học tập"
          has-border
          :options="groupsOpt"
          v-model="selectedGroup"
          @input="handleChangeGroup"
        />
        <!-- <app-vue-select
          class="app-vue-select w-100 mr-4"
          label="text"
          placeholder="Hiển thị"
          has-border
        /> -->
        <!-- <app-vue-select
          class="app-vue-select w-100"
          label="text"
          placeholder="Trạng thái"
          has-border
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import ExamsMenuTab from "~/components/page/elearning/exams/ExamsMenuTab";
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  components: {
    ExamsMenuTab
  },

  data() {
    return {
      filterSelect: false,
      payload: {
        grade_id: null,
        subject_id: null,
        group_id: null,
        class_id: null,
        status: "APPROVED",
        query: null,
        page: 1,
        limit: 10
      },
      selectedGrade: null,
      selectedSubject: null,
      selectedGroup: null,
      selectedClass: null,
      allFilter: { name: 'Tất cả', 'id': null}
    };
  },

  computed: {
    ...mapGetters("elearning/public/public-grades", ["gradesAllOpts","classessAllOpts"]),
    ...mapGetters("elearning/public/public-subject", ["subjectsAllOpts"]),
    ...mapGetters("elearning/study-group/group",["groupsOpt"]),
    ...mapState("elearning/create", {
      grades: "grades",
    }),
    gradesAll(){
      return [this.allFilter,...this.grades]
    }
    
  },
  methods: {
    handleChangeTab(tab) {
      this.payload.status = tab;
      this.$emit("search", this.payload);
    },

    handleChangeQuery(val) {
      this.payload.query = val;
      console.log("[handleChangeQuery]", this.payload);
      this.$emit("search", this.payload);
    },

    handleChangeGrade(val) {
      this.payload.grade_id = val.value;
      console.log("[handleChangeGrade]", this.payload);
      this.$emit("search", this.payload);
    },

    handleChangeSubject(val) {
      this.payload.subject_id = val.value;
      console.log("[handleChangeSubject]", this.payload);
      this.$emit("search", this.payload);
    },

    handleChangeGroup(val) {
      this.payload.group_id = val.value;
      console.log("[handleChangeGroup]", this.payload);
      this.$emit("search", this.payload);
    },

    handleChangeClass(val) {
      this.payload.class_id = val.value;
      console.log("[handleChangeClass]", this.payload);
      this.$emit("search", this.payload);
    },
    resetForm(){
      this.payload.subject_id = null;
      this.payload.grade_id = null;
      this.payload.class_id = null;
      this.payload.group_id = null;
      console.log(this.payload)
    },
    clickFilterSubmit() {
      this.filterSelect = !this.filterSelect;
      this.resetForm();
      this.$emit('search',this.payload)
    }
  }
};
</script>

<style lang="scss">
.manager-exams {
  &__search {
    max-width: 35.2rem;
  }
}
</style>
