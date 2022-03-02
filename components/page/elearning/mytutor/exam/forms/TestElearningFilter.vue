<template>
  <filter-form>
    <div class="d-flex">
      <div
        class="filter-form__item filter-form__item--search border-0 ml-0"
        style="max-width: 36rem; min-width: 30rem;"
      >
        <app-search
          class="w-100"
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
      <div class="filter-form__item" v-if="filterSelect" style="min-width: 17rem;">
        <app-vue-select
          class="app-vue-select w-100"
          :options="rateOpts"
          :reduce="item => item.value"
          v-model="filters.rate"
          label="text"
          placeholder="Tỷ lệ hoàn thành"
          @input="handleSelectRate"
          :all-opt="allOpt"
          has-border
        />
      </div>
      <div class="filter-form__item" v-if="filterSelect" style="min-width: 11rem;">
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
    </div>
  </filter-form>
</template>

<script>
  import IconFilter from "~/assets/svg/icons/filter.svg?inline"
  import { ELEARNING_TYPES, ELEARNING_STATUSES } from '~/utils/constants'
  
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
    computed: {
      typeOpts() {
        return [this.allOpt, ...this.types]
      },
      rateOpts() {
        return [this.allOpt, ...this.rates]
      }
    },
    methods: {
      submit() {
        if (!this.initStatus) {
          this.$emit('submitFilter', this.filters)
        }
      },
      handleSelectRate(val) {
        this.$emit('changedRate', val)
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