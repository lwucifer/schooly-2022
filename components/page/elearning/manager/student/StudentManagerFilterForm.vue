<template>
  <filter-form>
    <div class="d-flex">
      <div
        class="filter-form__item filter-form__item--search"
        style="max-width: 36rem; min-width: 30rem;"
      >
        <app-search
          class="w-100"
          size="sm"
          bordered
          placeholder="Nhập để tìm kiếm"
          v-model="filters.keyword"
          @input="handleChangedSearch"
          @keyup.enter.native="submit"
          @submit="submit"
          color="primary"
        ></app-search>
      </div>
      <div class="filter-form__item">
        <filter-button @click="submitShowFilter" :color="showFilter ? 'primary' : 'default'" :outline="!showFilter">Lọc kết quả</filter-button>
      </div>
     <div class="filter-form__item" v-if="showFilter" style="min-width: 11rem;" >
        <app-vue-select
          class="app-vue-select w-100"
          :options="filterSelectClass"
          :reduce="item => item.value"
          v-model="filters.class"
          label="text"
          placeholder="Theo lớp"
          searchable
          has-border
          @input="handleSelectType"
        />
      </div>
    </div>
  </filter-form>
</template>

<script>
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import IconFilter from "~/assets/svg/icons/filter.svg?inline";
import { ELEARNING_TYPES, ELEARNING_STATUSES } from "~/utils/constants";
import { mapState } from "vuex";

const STORE_SCHOOL_CLASSES = "elearning/teaching/classes";

export default {
  components: {
    IconFilter
  },
  data() {
    return {
      filterSelect: false,
      filters: {
        class: null,
        keyword: "",
      },
      initStatus: true,
      classList: []
    };
  },
  props:{
    showFilter:{
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(STORE_SCHOOL_CLASSES, {
      stateSchoolClasses: "teachingClasses"
    }),
    filterSelectClass() {
      const dataFilter = this.classList ? this.classList : [];
      const data = dataFilter.map(item => {
        return {
          value: item.id,
          text: item.name
        };
      });
      data.push({
        value: "Khác",
        text: "Khác"
      });
      data.push({
        value: null,
        text: "Tất cả"
      });
      return data;
    }
  },
  watch: {
    filters: {
      handler(val, old) {
        this.initStatus = false;
        this.$emit("changedFilter", val);
      },
      deep: true
    }
  },
  methods: {
    get, 
    async getClass() {
      try {
        let params = {
          size: 9999
        };
        await this.$store.dispatch(
          `${STORE_SCHOOL_CLASSES}/${actionTypes.ELEARNING_TEACHING_CLASS.LIST}`, {params}
        );
        this.classList = this.get(this.stateSchoolClasses, "content", []);
      } catch (e) {
      } finally {
      }
    },

    submit() {
      if (this.filters.keyword != "") {
        this.$emit("submitFilter", this.filters);
      }
    },
    handleSelectRate(val) {
      this.$emit("changedRate", val);
    },
    handleSelectType(val) {
      this.$emit("changedType", val);
    },
    handleChangedSearch(val) {
      this.$emit("changedQuery", val);
      if (val == "") {
        this.$emit("submitFilter", this.filters);
      }
    },
    clickSubmit() {
      // debugger;
      if (this.filters.keyword != "") {
        this.$emit("changedQuery", this.filters.keyword);
      }
    },
    resetForm() {
      this.filters.class = null;
      this.filters.keyword = "";
    },
    submitShowFilter(){
      this.$emit('submitShowFilter',!this.showFilter);
      if (this.filters.class != null) {
        this.filters.class = null;
        this.$emit("submitFilter", this.filters);
      }
    }
  },
  created () {
    this.getClass();
  },
};
</script>

<style lang="scss">
.app-search.app-search--bordered.app-input--size-sm .app-search__submit {
  height: calc(3.2rem - 1px);
}
</style>