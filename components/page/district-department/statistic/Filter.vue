<template>
  <div class="filter-form d-md-flex">
    <div class="filter-form__item">
      <app-button
        color="primary"
        @click="submit"
        rounded
        size="sm"
        normal
        class="school-filter__btn-submit"
      >
        <IconFilter/>
        <span>Lọc kết quả thống kê</span>
      </app-button>
    </div>

    <div class="filter-form__item">
      <app-vue-select
        class="app-vue-select"
        v-model="filter.ward"
        :options="[{ name: 'Dịch Vọng', value: 0 }, { name: 'Mai Dịch', value: 1}]"
        label="name"
        placeholder="Theo xã/phường"
        searchable
        clearable
      >
      </app-vue-select>
    </div>

    <div class="filter-form__item">
      <app-vue-select
        class="app-vue-select"
        v-model="filter.level"
        :options="[{ name: 'Cấp 1', value: 0 }, { name: 'Cấp 2', value: 1}]"
        label="name"
        placeholder="Theo cấp học"
        searchable
        clearable
      >
      </app-vue-select>
    </div>

    <div class="filter-form__item">
      <app-vue-select
        class="app-vue-select"
        v-model="filter.school"
        :options="[{ name: 'Trường 01', value: 0 }, { name: 'Trường 02 THCS Nguyễn Trãi', value: 1}]"
        label="name"
        placeholder="Theo trường"
        searchable
        clearable
      >
      </app-vue-select>
    </div>

    <div class="school-filter__form--right">
    </div>
  </div>
</template>

<script>
  import IconFilter from "~/assets/svg/icons/filter.svg?inline";

  export default {
    components: {
      IconFilter
    },
    data() {
      return {
        filter: {
          ward: null
        }
      }
    },
    methods: {
      submit() {

      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~/assets/scss/components/district-department/statistic/_filter.scss";
</style>