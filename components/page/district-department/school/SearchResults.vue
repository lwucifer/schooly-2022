<template>
  <div class="search-result">
    <!--Search title-->
    <div class="search-result__title">
      <slot name="title">
        <span class="text-primary">{{ list.length }} kết quả</span> cho từ "{{ searchQuery }}"
      </slot>
    </div><!--Search title-->

    <!--List-->
    <div class="search-result__list">
      <div class="wrapper">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="custom-col-lg-5 col-sm-6 col-xs-12"
        >
          <school-item :school="item" />
        </div>
      </div>
    </div><!--List-->

    <!--Pagination-->
    <div>
      <app-pagination
        :pagination="pagination"
        @pagechange="onPageChange"
        class="mt-3"
      />
    </div><!--Pagination-->
  </div>
</template>

<script>
  import SchoolItem from "~/components/page/school/SchoolItem"

  export default {
    name: "SearchResults",
    components: {
      SchoolItem
    },
    props: {
      list: {
        type: Array,
        required: true
      },
      pagination: {
        type: Object,
        required: false,
        default: () => {}
      },
      searchQuery: {
        type: String,
        default: ''
      }
    },
    data() {
      return {

      }
    },
    methods: {
      onPageChange(e) {
        this.$emit("changedSearchPage", e);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~/assets/scss/components/district-department/school/_search-result.scss";
</style>