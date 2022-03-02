<template>
  <div class="d-md-flex">
    <app-select-school-year
      :class="classYearName"
      :style="yearStyle"
      @input="changedSchoolYear"
    />
  
    <div :class="className" :style="classStyle">
      <app-vue-select
        :disabled="!get(this, 'params.school_year_id', false)"
        class="app-vue-select w-100"
        :options="list"
        searchable
        append-to-body
        v-model="selectedClass"
        :reduce="item => item.id"
        label="name"
        :placeholder="placeholder"
        @input="onChange"
        @open="onOpen"
        @close="onClose"
        :all-opt="allOpt"
        has-border
      >
        <template slot="list-footer" v-if="hasMoreClasses">
          <li ref="load" class="loader text-center">
            <app-spin
              size="sm"
            />
          </li>
        </template>
      </app-vue-select>
    </div>
  </div>
</template>

<script>
  import { useEffect } from "~/utils/common"
  import { mapState } from "vuex"
  import * as actionTypes from "~/utils/action-types"
  import { get } from "lodash"
  
  const STORE_NAMESPACE = 'elearning/teaching/teaching-class'
  
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
        default: 'Lớp học'
      },
      classStyle: {
        type: Object,
        default: () => {}
      },
      className: {
        type: String,
        default: ''
      },
      yearStyle: {
        type: Object,
        default: () => {}
      },
      classYearName: {
        type: String,
        default: ''
      }
    },
    
    data() {
      return {
        allOpt: {
          id: null,
          name: 'Tất cả'
        },
        observer: null,
        params: {
          page: 1,
          size: 10,
          school_year_id: null,
        },
        list: [],
        selectedClass: null
      }
    },
    
    computed: {
      ...mapState(STORE_NAMESPACE, {
        detailInfo: "classes",
      }),
      hasMoreClasses: function() {
        return this.get(this.detailInfo, 'data.total_elements', 0) > this.get(this.detailInfo, 'data.number_of_elements', 0)
      },
    },
    
    watch: {
      params: {
        handler: function(val) {
          const tmpSchoolId = get(val, 'school_year_id', null)
          if (tmpSchoolId == null || tmpSchoolId == '') {
            this.selectedClass = null
            this.onChange(null)
          }
        },
        deep: true
      }
    },
    
    methods: {
      async onOpen() {
        if (this.hasMoreClasses) {
          await this.$nextTick();
          this.observer.observe(this.$refs.load)
        }
      },
      onChange(val) {
        this.$emit('input', val)
        this.$emit('changedClass', val)
      },
      async getList() {
        try {
          let params = { ...this.params }
          
          await this.$store.dispatch(
            `${STORE_NAMESPACE}/${actionTypes.ELEARNING_TEACHING_CLASS.LIST}`, { params }
          )
          this.list = [this.allOpt, ...this.get(this.detailInfo, 'data.content', [])]
        } catch (e) {
          console.log('Get teaching classes ', e)
        } finally {
        }
      },
      onClose() {
        this.observer.disconnect();
      },
      onSearch(search, loading) {
        loading(true)
      },
      async infiniteScrollClass ([{isIntersecting, target}]) {
        if (isIntersecting) {
          const ul = target.offsetParent
          const scrollTop = target.offsetParent.scrollTop
          this.params.size += 10
          await this.getList()
          await this.$nextTick()
          ul.scrollTop = scrollTop
        }
      },
      changedSchoolYear(val) {
        this.params.school_year_id = val
        if (val != null && val != '') {
          this.getList()
        }
      },
      get
    },
    mounted () {
      this.observer = new IntersectionObserver(this.infiniteScrollClass.bind(this));
    },
    created() {
      // this.getList()
    },
  };
</script>

<style lang="scss">
</style>