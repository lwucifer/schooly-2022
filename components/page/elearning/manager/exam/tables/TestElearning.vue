<template>
  <div>
    <app-table
      :heads="heads"
      :pagination="pagination"
      @pagechange="onPageChange"
      @sort="sortTable"
      :data="list"
      :loading="loading"
    >
      <template v-slot:cell(name)="{row}">
        <td :title="get(row, 'name', '')">
          {{ get(row, 'name', '') | truncStrFilter(30) }}
        </td>
      </template>
      
      <template v-slot:cell(action)="{row}">
        <td>
          <n-link
            class
            title="Chi tiết"
            :to="`/elearning/manager/exams/test?elearning_id=${row.id}`">
            <IconArrow height="13"/>
          </n-link>
        </td>
      </template>
      
      <template v-slot:cell(type)="{row}">
        <td class="nowrap">
          {{ get(row, 'type', '') | exerciseTypeFilter }}
        </td>
      </template>
      
      <template v-slot:cell(rate)="{row}">
        <td>
          <v-popover
            offset="10"
            trigger="hover"
            placement="top"
            popover-class="tooltip--rate"
          >
            <div class="nowrap rate-result-wrapper">
              <span class="status-item status-item--success d-inline-block">
                {{ row | resultFigureRate('passed_percent') }}%
              </span>
              <span class="status-item status-item--fail d-inline-block">
                {{ row | resultFigureRate('failed_percent') }}%
              </span>
              <span class="status-item status-item--pending d-inline-block">
                {{ row | resultFigureRate('pending_percent') }}%
              </span>
            </div>
            
            <template slot="popover" class="tooltip-detail">
              <div>
                <rate-status
                  :total="get(row, 'total_students', 0)"
                  :passed="get(row, 'passed', 0)"
                  :failed="get(row, 'failed', 0)"
                  :pending="get(row, 'pending', 0)"
                >
                </rate-status>
              </div>
            </template>
          
          </v-popover>
        </td>
      </template>
      
      <template v-slot:cell(created)="{row}">
        <td>
          {{ get(row, 'created', '') | getDateBirthDay }}
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
      }
    },
    
    data() {
      return {
        heads: [
          {
            name: "name",
            text: "Khóa học/bài giảng",
          },
          {
            name: "type",
            text: "Thể loại",
          },
          {
            name: "tests",
            text: "Số bài kiểm tra",
            sort: true
          },
          {
            name: "rate",
            text: "Tỷ lệ hoàn thành",
          },
          {
            name: "created",
            text: "Ngày khởi tạo",
            sort: true
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
