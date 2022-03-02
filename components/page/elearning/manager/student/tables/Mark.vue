<template>
  <div>
    <div class="d-flex-center mb-3 px-4">
      <h5>Điểm đánh giá</h5>
      <div class="ml-auto">
        <app-button rounded size="sm" class="mr-4" normal>
          <IconFilter/>
          Lọc kết quả
        </app-button>
        <app-select :options="opts1" v-model="opt1" size="sm"/>
      </div>
    </div>
    
    <app-table
      :heads="heads"
      :pagination="pagination"
      @pagechange="onPageChange"
      @sort="sort"
      :data="list"
      :sortBy="list"
    >
      <template v-slot:cell(mark)="{row}">
        <td>
          <v-popover
            offset="10"
            trigger="hover"
          >
            <span
              class="font-weight-bold"
              :class="{
                'score--pass': (get(row, 'status') == SUBMISSION_RESULTS.PASS),
                'score--fail': (get(row, 'status') == SUBMISSION_RESULTS.FAIL),
                'score--empty': (get(row, 'status') == SUBMISSION_RESULTS.NO_SCORE),
              }"
            >
            {{ get(row, 'mark', 'Chưa chấm') }}
            </span>
            <template slot="popover">
              {{ get(row, 'status')  | submissionStatus }}
            </template>
          </v-popover>
        </td>
      </template>
  
      <template v-slot:cell(action)="{row}">
        <td>
          <n-link
            class
            title="Chi tiết"
            :to="'/'">
            Xem chi tiết
          </n-link>
        </td>
      </template>
      
    </app-table>
  </div>
</template>

<script>
  import IconSearch from "~/assets/svg/icons/search.svg?inline";
  import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline";
  import IconFilter from '~/assets/svg/icons/filter.svg?inline';
  import { get } from "lodash"
  import { SUBMISSION_RESULTS, SCALE_MARK } from "~/utils/constants"

  export default {
    components: {
      IconSearch,
      IconTrashAlt,
      IconFilter
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
      submissionStatus: function(val) {
        if (val == SUBMISSION_RESULTS.NO_SCORE) {
          return 'Chưa chấm'
        } else if (val == SUBMISSION_RESULTS.PASS) {
          return 'Đạt'
        } else if (val == SUBMISSION_RESULTS.FAIL) {
          return 'Không đạt'
        }
        return ''
      }
    },
    data() {
      return {
        heads: [
          {
            name: "name",
            text: "Tiêu đề",
          },
          {
            name: "mark",
            text: "Điểm",
          },
          {
            name: "lesson",
            text: "Thuộc bài giảng",
          },
          {
            name: "elearning",
            text: "Thuộc khóa học",
          },
          {
            name: "action",
            text: "",
          },
        ],
        isTeacher: true,
        opt1: "",
        opts1: [
          {value: "", text: "Toàn bộ"},
          {value: "1", text: "1"},
          {value: "2", text: "2"}
        ],
        opt2: "",
        opts2: [
          {value: "", text: "Theo hiển thị"},
          {value: "1", text: "Tăng dần"},
          {value: "2", text: "Giảm dần"}
        ],
        SUBMISSION_RESULTS: SUBMISSION_RESULTS
      }
    },
    methods: {
      sort(e) {
        // this.list = [...e];
      },
      onPageChange(e) {
        // const that = this;
        // that.pagination = { ...that.pagination, ...e };
        // console.log(that.pagination);
      },
      get
    }
  };
</script>

<style lang="scss">
</style>