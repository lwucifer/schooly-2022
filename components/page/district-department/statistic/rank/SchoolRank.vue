<template>
  <div>
    <div class="filter-form--tab--tab px-4">
      <div class="filter-form--tab__item">
        <label for="">Sắp xếp</label>
        <app-vue-select
          class="app-vue-select filter-form--tab__item__selection"
          v-model="filter.order"
          :options="[{ text: 'Toàn thời gian', value: 0 }, { text: 'Bán thời gian', value: 1 } ]"
          label="text"
          placeholder="Chọn"
          searchable
          clearable
        >
        </app-vue-select>
      </div>
    </div>

    <!--Detail-->
    <div>
      <div
        v-for="(item, index) in list"
        :key="index"
      >
        <rank-item
          :title="item.title"
          :list="item.data"
          :matched-key="item.matchedKey"
        >
        </rank-item>
        <div v-if="index < (list.length - 1)" class="px-4 my-3"><hr /></div>
      </div>
    </div><!--Detail-->
  </div>
</template>

<script>
  import RankItem from "./RankItem"

  export default {
    name: "SchoolRank",
    components: {
      RankItem
    },
    props: {
      list: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        filter: {}
      }
    }
  }
</script>

<style scoped>

</style>