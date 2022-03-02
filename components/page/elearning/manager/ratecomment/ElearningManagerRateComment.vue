<template>
  <div>
    <elearning-manager-filter-form
      @changedFilter="updateFilter"
    />
    <div class="wrapTable__ElearningManagerRC">
      <app-table
        :loading="loading"
        :heads="heads"
        :pagination="pagination"
        :data.sync="list"
        @sort="sortTable"
        @pagechange="onPageChange"
        class="table__ElearningManagerRC"
      >
        <template v-slot:cell(action)="{row}">
          <td>
            <app-stars :stars="row.vote" :size="16" class="mt-2 mb-2"/>
          </td>
        </template>

        <template v-slot:cell(content)="{row}">
          <td class="cmt-content"
            @mouseover="showCmt(row)"
            @mouseleave="closeCmt"
          >
            <div>
              {{ row.content | truncStrFilter(30, false) }}
            </div>
            <div class="cmt-detail" v-if="currentIndex && (row.id == currentIndex)">
              <div v-html="row.content"></div>
            </div>
          </td>
        </template>

        <template v-slot:cell(creator)="{row}">
          <td>
            {{ get(row, 'creator.name', '') }}
          </td>
        </template>

        <template v-slot:cell(course)="{row}">
          <td>
            <n-link to="/" style="text-decoration: none;">
              Tên khóa học
            </n-link>
          </td>
        </template>

        <template v-slot:cell(created_at)="{row}">
          <td>
            {{ get(row, 'timestamp', '') | moment("hh:mm A DD/MM/YYYY") }}
          </td>
        </template>
      </app-table>
    </div>
  </div>
</template>

<script>
  import ElearningManagerFilterForm from "./ElearningManagerFilterForm"

  import {mapState} from "vuex"
  import { get } from "lodash"

  export default {
    components: {
      ElearningManagerFilterForm
    },
    data() {
      return {
        currentIndex: null,
        heads: [
          {
            name: "action",
            text: "Đánh giá",
          },
          {
            name: "content",
            text: "Bình luận",
          },
          {
            name: "creator",
            text: "Người đánh giá",
          },
          {
            name: "class",
            text: "Lớp",
          },
          {
            name: "course",
            text: "Bình luận tại",
          },
          {
            name: "created_at",
            text: "Thời gian",
            sort: true,
          }

        ],
      };
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
    computed: {
      ...mapState("auth", ["loggedUser"]),
    },
    methods: {
      onPageChange(e) {
        this.$emit('changedPagination', e)
      },
      updateFilter(val) {
        this.$emit('changedFilter', val)
      },
      showCmt(cmt) {
        if (!(this.currentIndex === get(cmt, 'id'))) {
          this.currentIndex = get(cmt, 'id')
        }
      },
      closeCmt() {
        this.currentIndex = null
      },
      sortTable(info) {
        console.log('sort by ', info)
      },
      get
    },

  }
</script>

<style lang="scss">
  @import "~/assets/scss/components/elearning/manager/_elearning-rate-comment.scss";
</style>