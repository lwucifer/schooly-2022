<template>
  <div>
    <filter-form>
      <div class="d-flex">
        <div
          class="filter-form__item filter-form__item--search border-0"
          style="max-width: 30rem; min-width: 25rem;"
        >
          <app-search
            class="w-100"
            size="sm"
            bordered
            placeholder="Nhập để tìm kiếm"
            v-model="filters.query"
            @input="handleChangedSearch"
            @keyup.enter.native="handleSubmitSearch"
            @submit="submit"
            color="primary"
            has-border
          >
          </app-search>
        </div>
        <div class="filter-form__item">
          <filter-button
            @click="clickSubmit"
            :color="filterSelect ? 'primary': 'white'"
          ></filter-button>
        </div>
        <app-select-class
          v-if="filterSelect"
          style="margin-left: 0.6rem;"
          class-name="filter-form__item"
          :class-style="{ 'min-width': '8.5rem', 'margin-right': '0.6rem' }"
          class-year-name="filter-form__item"
          :year-style="{ 'min-width': '11.5rem' }"
          @changedClass="handleChangedClass"
          placeholder="Lớp"
        />
        <app-select-submission-result
          v-if="filterSelect"
          style="min-width: 12.5rem;"
          v-model="filters.result"
          @input="handleChangedResult"
          class="filter-form__item"
          placeholder="Trạng thái"
        >
        </app-select-submission-result>
      </div>
    </filter-form>
  </div>
  
</template>

<script>
  import IconFilter from "~/assets/svg/icons/filter.svg?inline"
  import IconSearch from "~/assets/svg/icons/search.svg?inline"
  import IconArrow from "~/assets/svg/icons/arrow.svg?inline"

  export default {
    name: "ElearningManagerFilterForm",
    components: {
      IconFilter,
      IconSearch,
      IconArrow
    },
    data() {
      return {
        filterSelect:false,
        filters: {
          query: null,
          class_id: null,
          result: null
        },
        types: [
          {
            value: 1,
            text: 'Trắc nghiệm'
          },
          {
            value: 2,
            text: 'Tự luận'
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
    methods: {
      submit() {
        if (!this.initStatus) {
          this.$emit('submitFilter', this.filters)
        }
      },
      handleChangedClass(val) {
        this.$emit('changedClass', val)
      },
      handleChangedSearch(val) {
        this.$emit('changedQuery', val)
      },
      handleChangedResult(val) {
        this.filters.result = val
        this.$emit('changedResult', val)
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
        this.filters.query = null
        this.filters.class_id = null
        this.filters.result = null
      }
    }
  }
</script>

<style scoped>

</style>