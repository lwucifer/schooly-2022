<template>
  <div>
    <app-vue-select
      multiple
      class="app-vue-select w-100 h-100 app-select-elearnings"
      :options="groupClsOpts"
      label="text"
      :placeholder="placeholder"
      @input="onChange"
      has-border
    >
    </app-vue-select>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions, mapMutations } from "vuex"
  import * as actionTypes from "~/utils/action-types"
  import { get } from "lodash"
  import { allOptionSelect } from "~/utils/common";
  
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
        default: 'Lớp/Nhóm'
      }
    },
    
    data() {
      return {
        isLoadingContent: false,
        selectedItem: null,
        list: []
      }
    },
    
    computed: {
      groupClsOpts() {
        const allGroupCls = this.list;
        return allGroupCls;
        // const parsedData = allGroupCls.map(item => {
        //   item.value = item.id;
        //   item.text = item.name;
        //   return item;
        // });
        // return allOptionSelect(allGroupCls);
      }
    },
    
    methods: {
      ...mapActions('elearning', {
        getClsGroups: actionTypes.TEACHER_CLASS_GROUP.LIST
      }),
      onChange(val) {
        this.$emit('input', val)
      },

      async getList() {
        try {
          this.isLoadingContent = true;
          const params = {
              type: null,
              schoolyear_id: null
          };
          const res = await this.getClsGroups({ params: params });
          if (get(res, 'success', false)) {
            this.list = get(res, 'data', []);
          } else {
            this.$toasted.error(get(res, 'message', 'Lỗi lấy dữ liệu lớp/nhóm học tập'));
          }
        } catch (error) {
          this.$toasted.error('Lỗi lấy dữ liệu lớp/nhóm học tập');
        } finally {
          this.isLoadingContent = false;
        }
      },
      get
    },
    async created() {
      await Promise.all([
        this.getList()
      ]);
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