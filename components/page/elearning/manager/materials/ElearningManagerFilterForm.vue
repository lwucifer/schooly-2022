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
          v-model="filters.name"
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
        ></filter-button>
      </div>
      <div class="filter-form__item" v-if="filterSelect" style="min-width: 11rem;">
        <app-vue-select
          class="app-vue-select w-100"
          :options="fileTypeOpts"
          :reduce="item => item.value"
          v-model="filters.type"
          label="text"
          placeholder="Thể loại"
          @input="handleChangedType"
          :all-opt="allOpt"
          has-border
        >
        </app-vue-select>
      </div>
      <div class="filter-form__item" v-if="filterSelect" style="min-width: 12.5rem;">
        <app-vue-select
          class="app-vue-select w-100"
          :options="statusOpts"
          :reduce="item => item.value"
          v-model="filters.used"
          label="text"
          placeholder="Trạng thái"
          @input="handleChangedStatus"
          :all-opt="allOpt"
          has-border
        >
        </app-vue-select>
      </div>
      <!-- <div class="ml-auto">
        <app-button
          size="sm"
          color="primary"
          class="d-flex align-items-center"
          @click="$emit('showupload')"
        >
          <IconAdd24px class="icon mr-2"/>
          Thêm tài liệu mới
        </app-button>
      </div> -->
    </div>
  </filter-form>
</template>

<script>
  import IconFilter from "~/assets/svg/icons/filter.svg?inline"
  import IconSearch from "~/assets/svg/icons/search.svg?inline"
  import IconArrow from "~/assets/svg/icons/arrow.svg?inline"
  import IconAdd24px from '~/assets/svg/v2-icons/add_24px.svg?inline';
  export default {
    name: "ElearningManagerFilterForm",
    components: {
      IconFilter,
      IconSearch,
      IconArrow,
      IconAdd24px
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
          used: null,
          name: ''
        },
        statuses: [
          {
            value: true,
            text: 'Đã sử dụng'
          },
          {
            value: false,
            text: 'Chưa sử dụng'
          },
        ],
        fileTypes: [
          {
            value: 'audio',
            text: 'Audio'
          },
          {
            value: 'video',
            text: 'Video'
          },
          {
            value: 'docs',
            text: 'Văn bản'
          },
          {
            value: 'image',
            text: 'Hình ảnh'
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
      fileTypeOpts() {
        return [this.allOpt, ...this.fileTypes]
      },
      statusOpts() {
        return [this.allOpt, ...this.statuses]
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
      handleBlurSearchInput() {
        console.log('[Component] Elearning exam: blur searching ')
      },
      handleChangedSearch(val) {
        this.$emit('changedQuery', val)
      },
      handleChangedType(val) {
        this.$emit('changedType', val)
      },
      handleChangedStatus(val) {
        this.$emit('changedStatus', val)
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
          console.log('submit false')
          this.filterSelect = true
        }
      },
      resetForm() {
        this.filters.type = null
        this.filters.used = null
        this.filters.name = ''
      }
    }
  }
</script>

<style scoped lang="scss">
  /*@import "~/assets/scss/components/elearning/_elearning-filter-form.scss";*/
</style>