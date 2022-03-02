<template>
  <div>
    <app-vue-select
      class="app-vue-select w-100 h-100 app-select-elearnings"
      :options="list"
      searchable
      v-model="selectedItem"
      label="name"
      :reduce="item => item.id"
      :placeholder="placeholder"
      :all-opt="allFilter"
      @input="onChange"
      has-border
    >
    </app-vue-select>
  </div>
</template>

<script>
  import { useEffect } from "~/utils/common"
  import { mapState, mapGetters, mapActions } from "vuex"
  import * as actionTypes from "~/utils/action-types"
  import { get } from "lodash"
  
  const STORE_NAMESPACE = "elearning/teaching/elearning";
  
  export default {
    
    components: {
    },
    
    model: {
      prop: "value",
      event: "input"
    },
    
    props: {
      placeholder: {
        type: String,
        default: 'Bài giảng/khóa học'
      },
      value: {
        type: [String, Number, Object], 
        default: null
      }
    },
    
    data() {
      return {
        allFilter: { name: 'Tất cả', 'id': null},
        list: [],
        selectedItem: this.value,
      }
    },
    
    computed: {
      ...mapGetters(STORE_NAMESPACE, {
        stateElearnings: "elearningsTeacher"
      }),
    },
    
    watch: {
      value(newVal) {
        this.selectedItem = newVal;
      }
    },
    
    methods: {
      ...mapActions(STORE_NAMESPACE, {
        getElearnings: actionTypes.TEACHING_ELEARNINGS.OWNER_ELEARNINGS_LIST
      }),
      onChange(val) {
        this.$emit('input', val)
        this.$emit('changedCourse', val)
      },
      async getList() {
        try {
          const res = await this.getElearnings();
          this.list = [this.allFilter, ...this.get(this, 'stateElearnings', [])]
        } catch (e) {
        } finally {
        }
      },
      onSearch(search, loading) {
        loading(true)
      },
      get
    },
    mounted () {
    },
    created() {
      this.getList()
    },
  };
</script>

<style lang="scss">
.app-select-elearnings {
  .vs__dropdown-toggle {
    height: 100% !important;
  }
}
</style>