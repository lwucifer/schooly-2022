<template>
  <filter-form class="">
    <div class="mb-4">
      <div class="d-flex-center">
        <div
          class="filter-form__item filter-form__item--search border-0 ml-0"
          style="min-width: 35rem;"
        >
          <app-search
            class="w-100 my-0"
            size="sm"
            placeholder="Nhập để tìm kiếm"
            bordered
            v-model="filters.query"
            @input="handleChangedSearch"
            @keyup.enter.native="handleSubmitSearch"
            @submit="submit"
            color="primary"
          >
          </app-search>
        </div>
        <!-- <div class="filter-form__item">
          <filter-button
            @click="clickSubmit"
            :color="filterSelect ? 'primary': 'white'"
          ></filter-button>
        </div> -->
      </div>

      <div class="d-flex-center mt-15">
        <div class="filter-form__item ml-0" style="min-width: 12.5rem;">
          <app-vue-select
            class="app-vue-select w-100"
            :options="typeOpts"
            :reduce="item => item.value"
            v-model="filters.type"
            label="text"
            placeholder="Thể loại"
            @input="handleSelectType"
            :all-opt="allOpt"
            has-border
          />
        </div>
        <div class="filter-form__item" style="min-width: 11rem;">
          <app-vue-select
            class="app-vue-select w-100"
            :options="rateOpts"
            :reduce="item => item.value"
            v-model="filters.status"
            label="text"
            placeholder="Trạng thái"
            @input="handleSelectRate"
            :all-opt="allOpt"
            has-border
          />
        </div>
        <div class="filter-form__item" style="min-width: 13.7rem;">
          <app-vue-select
            class="app-vue-select w-100"
            :options="optionOpts"
            :reduce="item => item.value"
            v-model="filters.required"
            label="text"
            placeholder="Hình thức"
            @input="handleSelectOption"
            :all-opt="allOpt"
            has-border
          />
        </div>
        <!-- <div class="filter-form__item my-0">
          <app-vue-select
            style="width: 11rem"
            class="app-vue-select filter-form__item__selection"
            v-model="filters.class_id"
            label="text"
            placeholder="Lớp"
            :reduce="(item) => item.value"
            @input="handleSelectClass"
            :options="classesOpt"
            has-border
            :all-opt="allOpt"
          ></app-vue-select>
        </div> -->
        <div class="filter-form__item my-0">
          <app-vue-select
            style="width: 20rem"
            class="app-vue-select filter-form__item__selection"
            v-model="filters.group_id"
            label="text"
            placeholder="Lớp/ Nhóm học tập"
            :reduce="item => item.value"
            @input="handleSelectGroup"
            :options="groupClassOpt"
            has-border
            :all-opt="allOpt"
          ></app-vue-select>
        </div>
      </div>
    </div>
  </filter-form>
</template>

<script>
import IconFilter from "~/assets/svg/icons/filter.svg?inline";
import { ELEARNING_STATUSES, EXERCISE_TYPES } from "~/utils/constants";
import { mapState, mapGetters } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";

export default {
  components: {
    IconFilter
  },
  data() {
    return {
      allOpt: {
        value: null,
        text: "Tất cả"
      },
      filterSelect: false,
      filters: {
        type: null,
        query: "",
        status: null,
        required: null,
        class_id: null,
        group_id: null
      },
      types: [
        {
          value: EXERCISE_TYPES.CHOICE,
          text: "Trắc nghiệm"
        },
        {
          value: EXERCISE_TYPES.ESSAY,
          text: "Tự luận"
        },
        {
          value: EXERCISE_TYPES.MIX,
          text: 'Hỗn hợp'
        },
      ],
      rates: [
        {
          value: ELEARNING_STATUSES.PASSED,
          text: "Đạt"
        },
        {
          value: ELEARNING_STATUSES.FAILED,
          text: "Không đạt"
        },
        {
          value: ELEARNING_STATUSES.NONE,
          text: "Chưa làm"
        },
        {
          value: ELEARNING_STATUSES.PENDING,
          text: "Chưa chấm"
        }
      ],
      options: [
        {
          value: true,
          text: "Bắt buộc"
        },
        {
          value: false,
          text: "Không bắt buộc"
        }
      ],
      initStatus: true
    };
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
  async mounted() {
    const payload = {
      size: 999,
      sorted_by: 'OLDEST'
    };

    await Promise.all([
      // this.$store.dispatch(
      //   `elearning/study-group/group/${actionTypes.STUDY_GROUP.LIST}`, payload
      // ),

      this.$store.dispatch("elearning/study-group/group/getListGroupClass", payload)
    ]);
  },
  computed: {
    ...mapState("elearning/study-group/group", ["groupClasses"]),
    ...mapGetters("elearning/study-group/group", ["groupClassOpt"]),

    typeOpts() {
      return [this.allOpt, ...this.types];
    },
    rateOpts() {
      return [this.allOpt, ...this.rates];
    },
    optionOpts() {
      return [this.allOpt, ...this.options];
    }
  },
  methods: {
    get,
    submit() {
      if (!this.initStatus) {
        this.$emit("submitFilter", this.filters);
      }
    },
    handleSelectClass(val) {
      this.$emit("changedClass", val);
    },
    handleSelectGroup(group_id) {
      const groupClasses = get(this, "groupClasses.content", []);
      const groupObj = groupClasses.find(g => g.id == group_id);
      if (groupObj) {
        if (groupObj.type == "CLASS") {
          this.filters.class_id = group_id;
          this.$emit("changedClass", group_id);
        } else if (groupObj.type == "GROUP") {
          this.$emit("changedGroup", group_id);
        }
      } else {
        this.$emit("changedClass", null);
      }
      // this.$emit("changedGroup", val);
    },
    handleSelectRate(val) {
      this.$emit("changedRate", val);
    },
    handleSelectType(val) {
      this.$emit("changedType", val);
    },
    handleChangedSearch(val) {
      this.$emit("changedQuery", val);
    },
    handleSelectOption(val) {
      this.$emit("changedOption", val);
    },
    handleSubmitSearch(e) {
      this.$emit("submitSearch", e.target.value);
    },
    clickSubmit() {
      if (this.filterSelect) {
        this.resetForm();
        this.filterSelect = false;
        if (!this.initStatus) {
          this.$emit("submitFilter", this.filters);
        }
      } else {
        this.filterSelect = true;
      }
    },
    resetForm() {
      this.filters.status = null;
      this.filters.type = null;
      this.filters.required = null;
      this.filters.query = "";
    }
  }
};
</script>

<style scoped lang="scss"></style>
