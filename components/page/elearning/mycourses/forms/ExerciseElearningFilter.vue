<template>
  <filter-form>
    <div class="mb-4">
      <div class="d-flex-center">
        <div
          class="filter-form__item filter-form__item--search border-0 ml-0"
          style="max-width: 36rem; min-width: 30rem;"
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
        <div class="filter-form__item">
          <filter-button
            @click="clickSubmit"
            :color="filterSelect ? 'primary': 'white'"
          >
          </filter-button>
        </div>
      </div>

      <div v-if="filterSelect" class="d-flex-center mt-15">
        <div class="filter-form__item my-0 ml-0">
          <app-vue-select
            style="width: 11rem"
            class="app-vue-select  filter-form__item__selection"
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
        <div class="filter-form__item my-0">
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
        </div>
        <div class="filter-form__item my-0">
          <app-vue-select
            style="width: 13.5rem"
            class="app-vue-select filter-form__item__selection"
            v-model="filters.group_id"
            label="text"
            placeholder="Nhóm học tập"
            :reduce="(item) => item.value"
            @input="handleSelectGroup"
            :options="groupsOpt"
            has-border
            :all-opt="allOpt"
          ></app-vue-select>
        </div>
    </div>
    </div>
  </filter-form>
</template>

<script>
  import IconFilter from "~/assets/svg/icons/filter.svg?inline"
  import { ELEARNING_TYPES, ELEARNING_STATUSES } from '~/utils/constants'
  import {mapState} from "vuex"
  import * as actionTypes from "~/utils/action-types"
import { get } from "lodash";

  export default {
    components: {
      IconFilter,
    },
    data() {
      return {
        allOpt: {
          value: null,
          text: 'Tất cả'
        },
        filterSelect:false,
        filters: {
          type: null,
          query: '',
          rate: null,
          class_id: null,
          group_id: null,
        },
        types: [
          {
            value: ELEARNING_TYPES.LECTURE,
            text: 'Bài giảng'
          },
          {
            value: ELEARNING_TYPES.COURSE,
            text: 'Khóa học'
          },
        ],
        rates: [
          {
            value: ELEARNING_STATUSES.PASSED,
            text: 'Đạt'
          },
          {
            value: ELEARNING_STATUSES.FAILED,
            text: 'Không đạt'
          },
          {
            value: ELEARNING_STATUSES.PENDING,
            text: 'Chưa chấm'
          },
        ],
        initStatus: true
      }
    },
    watch: {
      filters: {
        handler(val, old){
          this.initStatus = false
          this.$emit("changedFilter", val)
        },
        deep: true
      }
    },
    mounted() {
      const payload = {
        size: 999
      }
      this.$store.dispatch(
        `elearning/study-group/group/${actionTypes.STUDY_GROUP.LIST}`, payload
      );
      this.$store.dispatch("elearning/study-group/group/getClasses", payload);

    },
    computed: {
      ...mapState("elearning/study-group/group", {
        groups: "groups",
        classes: "classes"
      }),

      classesOpt() {
        let data = get(this, 'classes.content', []).map((item) => ({
          value: item.id,
          text: item.name,
        }));
        return [this.allOpt, ...data]
      },
      groupsOpt() {
        let data = get(this, 'groups.content', []).map((item) => ({
          value: item.id,
          text: item.name,
        }));
        return [this.allOpt, ...data]
      },

      typeOpts() {
        return [this.allOpt, ...this.types]
      },
      rateOpts() {
        return [this.allOpt, ...this.rates]
      }
    },
    methods: {
      get,
      submit() {
        if (!this.initStatus) {
          this.$emit('submitFilter', this.filters)
        }
      },
      handleSelectRate(val) {
        this.$emit('changedRate', val)
      },
      handleSelectClass(val) {
        this.$emit('changedClass', val)
      },
      handleSelectGroup(val) {
        this.$emit('changedGroup', val)
      },
      handleSelectType(val) {
        this.$emit('changedType', val)
      },
      handleChangedSearch(val) {
        this.$emit('changedQuery', val)
      },
      handleSubmitSearch(e) {
        this.$emit('submitSearch', e.target.value)
      },
      clickSubmit() {
        if (this.filterSelect) {
          this.resetForm()
          this.filterSelect = false
          if (!this.initStatus) {
            this.$emit('submitFilter', this.filters)
          }
        } else {
          this.filterSelect = true
        }
      },
      resetForm() {
        this.filters.rate = null
        this.filters.type = null
        this.filters.query = ''
      }
    }
  }
</script>

<style scoped lang="scss">
</style>