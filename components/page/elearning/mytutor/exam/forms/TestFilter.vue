<template>
  <filter-form class="">
    <div class="d-flex">
      <div
        class="ml-0 filter-form__item filter-form__item--search border-0"
        style="min-width: 35rem;"
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
      <!-- <div class="filter-form__item">
        <filter-button
          @click="clickSubmit"
          :color="filterSelect ? 'primary': 'white'"
        ></filter-button>
      </div> -->

      <div class="ml-auto">
        <app-button
          size="sm"
          nuxt
          to="/elearning/mytutor/exams/create-test"
        >
          <IconPlusCircle class="icon--btn icon--btn--pre"/>
          <span>Tạo mới</span>
        </app-button>
      </div>
    </div>

    <div class="d-flex mb-4">
      <div class="filter-form__item ml-0" style="min-width: 15rem;">
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
      <div class="filter-form__item" style="min-width: 13rem;">
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

      <elearnings-selection
        class="filter-form__item"
        style="min-width: 17.5rem;"
        @input="handleSelectElearning"
      >
      </elearnings-selection>
      <!-- </div> -->
    </div>
  </filter-form>
</template>

<script>
  import ElearningsSelection from "~/components/page/elearning/manager/interacts/AppSelectIneractiveElearning"
  import IconFilter from "~/assets/svg/icons/filter.svg?inline"
  import IconPlusCircle from '~/assets/svg/design-icons/plus-circle.svg?inline'
  import { ELEARNING_STATUSES, EXERCISE_TYPES } from '~/utils/constants'
  
  export default {
    components: {
      ElearningsSelection,
      IconFilter,
      IconPlusCircle
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
          keyword: '',
          rate: null
        },
        types: [
          {
            value: EXERCISE_TYPES.CHOICE,
            text: 'Trắc nghiệm'
          },
          {
            value: EXERCISE_TYPES.ESSAY,
            text: 'Tự luận'
          },
          {
            value: EXERCISE_TYPES.MIX,
            text: 'Hỗn hợp'
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
        optionals: [
          {
            value: true,
            text: 'Bắt buộc'
          },
          {
            value: false,
            text: 'Không bắt buộc'
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
      typeOpts() {
        return [this.allOpt, ...this.types]
      },
      rateOpts() {
        return [this.allOpt, ...this.rates]
      },
      optOpts() {
        return [this.allOpt, ...this.optionals]
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
      handleSelectOptional(val) {
        this.$emit('changedRequired', val)
      },
      handleChangedSearch(val) {
        this.$emit('changedQuery', val)
      },
      handleSubmitSearch(e) {
        this.$emit('submitSearch', e.target.value)
      },
      handleSelectElearning(val) {
        this.$emit('changedElearning', val);
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
        this.filters.required = null
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
