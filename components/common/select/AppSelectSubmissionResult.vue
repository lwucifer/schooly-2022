<template>
  <div class="">
    <app-vue-select
      class="app-vue-select filter-form__item__selection w-100"
      v-model="selectedItem"
      :options="options"
      :reduce="item => item.val"
      label="label"
      :placeholder="placeholder"
      :searchable="searchable"
      :clearable="clearable"
      @input="handleChangedResult"
      :all-opt="allOpt"
      has-border
    >
    </app-vue-select>
  </div>
</template>

<script>
import { get } from "lodash"
import { ELEARNING_STATUSES } from '~/utils/constants'

export default {
  
  components: {
  },

  model: {
    prop: "value",
    event: "change"
  },

  props: {
    placeholder: {
      type: String,
      default: 'Kết quả'
    },
    clearable: {
      type: Boolean,
      default: false
    },
    searchable: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => {
        return [
          {
            val: null,
            label: 'Tất cả'
          },
          {
            val: ELEARNING_STATUSES.PASSED,
            label: 'Đạt'
          },
          {
            val: ELEARNING_STATUSES.FAILED,
            label: 'Không đạt'
          },
          {
            val: ELEARNING_STATUSES.PENDING,
            label: 'Chưa chấm'
          },
        ]
      }
    }
  },

  data() {
    return {
      allOpt: {
        val: null,
        label: 'Tất cả'
      },
      selectedItem: null,
    }
  },

  computed: {
  
  },
  watch: {
  },

  methods: {
    handleChangedResult() {
      this.$emit('input', this.selectedItem)
    },
    get
  },
  mounted () {
  },
  created() {
  
  },
};
</script>

<style lang="scss">
</style>