<template>
  <filter-form class="">
    <div class="d-flex">
      <div
        class="ml-0 filter-form__item filter-form__item--search border-0"
        style="max-width: 35rem; min-width: 34rem;"
      >
        <app-search
          class="w-100"
          size="sm"
          placeholder="Nhập để tìm kiếm"
          bordered
          v-model="filters.keyword"
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
          Lọc kết quả
        </filter-button>
      </div>
      <div class="filter-form__item" v-if="filterSelect" style="min-width: 11.5rem;">
        <app-vue-select
          class="app-vue-select w-100"
          :options="optsRate"
          v-model="filters.rate"
          :reduce="item => item.value"
          label="text"
          placeholder="Đánh giá"
          :searchable="false"
          @input="handleChangedRate"
          :all-opt="{ value: null, text: 'Tất cả'}"
          has-border
        >
        </app-vue-select>
      </div>
      <!--<app-select-class-->
        <!--v-if="filterSelect"-->
        <!--style="margin-left: 0.6rem;"-->
        <!--class-name="filter-form__item"-->
        <!--:class-style="{ 'min-width': '7.5rem !important', 'margin-right': '0.6rem' }"-->
        <!--class-year-name="filter-form__item"-->
        <!--:year-style="{ 'min-width': '11.5rem' }"-->
        <!--@changedClass="handleChangedClass"-->
        <!--placeholder="Lớp"-->
      <!--/>-->
      <app-select-voted-elearnings
        v-if="filterSelect"
        class="filter-form__item"
        style="min-width: 18.5rem; max-width: 20rem;"
        @input="handleChangedElearning"
        v-model="filters.elearning_id"
      />
    </div>
  </filter-form>
</template>

<script>
  import IconFilter from "~/assets/svg/icons/filter.svg?inline"
  import { truncStrFilter } from "~/plugins/filters.js"

  export default {
    components: {
      IconFilter,
    },
    data() {
      return {
        filterSelect:false,
        filters: {
          has_cmt: null,
          rate: null,
          class_id: null,
          elearning_id: null,
          keyword: null
        },
        rates: [
          {
            value: 1,
            text: '1 sao'
          },
          {
            value: 2,
            text: '2 sao'
          },
          {
            value: 3,
            text: '3 sao'
          },
          {
            value: 4,
            text: '4 sao'
          },
          {
            value: 5,
            text: '5 sao'
          }
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
      optsRate() {
        return [{ value: null, text: 'Tất cả'},...this.rates]
      }
    },
    methods: {
      submit() {
        if (!this.initStatus) {
          this.$emit('submitFilter', this.filters)
        }
      },
      handleFocusSearchInput() {
        console.log('[Component] Elearning exam: focus searching ')
      },
      handleChangedRate(val) {
        this.$emit('changedRate', val)
      },
      handleChangedClass(val) {
        this.$emit('changedClass', val)
      },
      handleChangedSearch(val) {
        this.$emit('changedQuery', val)
      },
      handleChangedElearning(val) {
        this.$emit('changedElearning', val)
      },
      handleChangedCmt(val) {
        this.$emit('changedCmt', val)
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
        this.filters.has_cmt = null
        this.filters.rate = null
        this.filters.class_id = null
        this.filters.elearning_id_id = null
      },
      truncStrFilter
    }
  }
</script>

<style lang="scss">
  @import "~/assets/scss/components/elearning/_elearning-filter-form.scss";
</style>