<template>
  <div class="wrapFilterBar__ElearningManagerRC">
    <div>
      <button class="btnFitlerSummit__ElearningManagerFilterTable" @click="submit">
        <IconFilter/>
        <span>Lọc kết quả</span>
      </button>
    </div>
    <div>
      <app-checkbox
        v-model="filters.cmt"
        @change="handleChangedCmt"
      >
        Có bình luận
      </app-checkbox>
    </div>
    <div>
      <app-vue-select
        class="selectComment__ElearningManagerRC"
        :options="rates"
        v-model="filters.rate"
        :reduce="item => item.value"
        label="text"
        placeholder="Đánh giá"
        searchable
        @input="handleChangedRate"
        has-border
      >
      </app-vue-select>
    </div>
    <div>
      <app-vue-select
        class="selectClass__ElearningManagerRC"
        :options="classes"
        v-model="filters.class"
        :reduce="item => item.value"
        label="text"
        placeholder="Lớp"
        searchable
        @input="handleChangedClass"
        has-border
      >
      </app-vue-select>
    </div>
    <div>
      <app-vue-select
        class="selectClass__ElearningManagerRC"
        style="min-width: 170px"
        :options="classes"
        v-model="filters.class"
        :reduce="item => item.value"
        label="text"
        placeholder="Bài giảng/khóa học"
        searchable
        @input="handleChangedClass"
        has-border
      >
      </app-vue-select>
    </div>
  </div>
</template>

<script>
  import IconFilter from "~/assets/svg/icons/filter.svg?inline"

  export default {
    name: "ElearningManagerFilterForm",
    components: {
      IconFilter,
    },
    data() {
      return {
        filters: {
          cmt: null,
          rate: null,
          class: null
        },
        classes: [
          {
            value: 1,
            text: '10B'
          },
          {
            value: 2,
            text: '10C'
          },
        ],
        rates: [
          {
            value: '1',
            text: '1 sao'
          },
          {
            value: '2',
            text: '2 sao'
          },
          {
            value: '3',
            text: '3 sao'
          },
          {
            value: '4',
            text: '4 sao'
          },
          {
            value: '5',
            text: '5 sao'
          }
        ],
      }
    },
    watch: {
      filters: {
        handler(val, old){
          this.$emit("changedFilter", val)
        },
        deep: true
      }
    },
    methods: {
      submit() {
        this.$emit('submit', this.filters)
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
      handleChangedCmt(val) {
        console.log('cmt change: ', val)
        this.$emit('changedCmt', val)
      },
    }
  }
</script>

<style scoped>

</style>