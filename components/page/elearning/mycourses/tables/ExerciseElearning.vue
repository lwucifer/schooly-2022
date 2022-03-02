<template>
  <div>
    <app-table
      :heads="heads"
      :pagination="pagination"
      @pagechange="onPageChange"
      @sort="sortTable"
      :data="list"
    >
      <template v-slot:cell(name)="{row}">
        <td :title="get(row, 'name', '')">
          {{ get(row, 'name', '') | truncStrFilter(30) }}
        </td>
      </template>

      <template v-slot:cell(exercises)="{row}">
        <td>
          <div class="text-center">
            {{ get(row, 'exercises', 0) }}
          </div>
        </td>
      </template>

      <template v-slot:cell(missing)="{row}">
        <td>
          <div class="text-center text-warning">
            {{ get(row, 'missing', 0) }}
          </div>
        </td>
      </template>

      <template v-slot:cell(passed)="{row}">
        <td>
          <div class="text-center text-primary">
            {{ get(row, 'passed', 0) }}
          </div>
        </td>
      </template>

      <template v-slot:cell(failed)="{row}">
        <td>
          <div class="text-center text-pink-2">
            {{ get(row, 'failed', 0) }}
          </div>
        </td>
      </template>

      <template v-slot:cell(pending)="{row}">
        <td>
          <div class="text-center text-warning">
            {{ get(row, 'pending', 0) }}
          </div>
        </td>
      </template>
      
      <template v-slot:cell(action)="{row}">
        <td>
          <n-link
            class
            title="Chi tiết"
            :to="`/elearning/mycourses/exercises/${row.id}`">
            <IconArrow height="13"/>
          </n-link>
        </td>
      </template>
      
      <template v-slot:cell(type)="{row}">
        <td class="nowrap">
          {{ get(row, 'type', '') | exerciseTypeFilter }}
        </td>
      </template>
      
      <template v-slot:cell(created)="{row}">
        <td>
          {{ get(row, 'created', '') | moment("DD/MM/YYYY") }}
        </td>
      </template>
    </app-table><!--End table-->
  </div>
</template>

<script>
  import { get } from "lodash"
  import IconArrow from "~/assets/svg/v2-icons/arrow_forward_ios_24px.svg?inline"
  import RateStatus from "~/components/page/elearning/manager/exam/RateStatus"
  import { ELEARNING_TYPES } from "~/utils/constants"
  import { numeralFormat } from "~/plugins/filters";
  
  export default {
    components: {
      IconArrow,
      RateStatus
    },
    
    props: {
      list: {
        type: Array,
        default: () => []
      },
      pagination: {
        type: Object,
        default: () => {
          return {
            total: 0,
            size: 10,
            page: 1,
            total_elements: 0,
            first: 1,
            last: 1,
            number: 0
          }
        }
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    
    filters: {
      exerciseTypeFilter: function(val) {
        const MATCHED_DATA = {
          [ELEARNING_TYPES.COURSE]: 'Khóa học',
          [ELEARNING_TYPES.LECTURE]: 'Bài giảng'
        }
        if (MATCHED_DATA.hasOwnProperty(val))
          return MATCHED_DATA[val]
        return '-'
      },
    },
    
    data() {
      return {
        heads: [
          {
            name: "name",
            text: "Tiêu đề",
          },
          {
            name: "type",
            text: "Thể loại",
          },
          {
            name: "exercises",
            text: "Số bài tập",
          },
          {
            name: "missing",
            text: "Chưa nộp",
          },
          {
            name: "passed",
            text: "Đạt",
          },
          {
            name: "failed",
            text: "Không đạt",
          },
          {
            name: "pending",
            text: "Chưa chấm",
          },
          {
            name: "action",
            text: "",
          }
        ],
      }
    },
    
    computed: {
    },
    methods: {
      onPageChange(e) {
        this.$emit('changedPagination', e)
      },
      sortTable(info) {
        this.$emit('changedSort', info)
      },
      numeralFormat,
      get
    },
  }
</script>

<style lang="scss">
</style>