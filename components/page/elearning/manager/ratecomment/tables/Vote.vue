<template>
  <div>
    <app-table
      :loading="loading"
      :heads="heads"
      :pagination="pagination"
      :data.sync="list"
      @sort="sortTable"
      @pagechange="onPageChange"
      class=""
    >
      <template v-slot:cell(content)="{row}">
        <!--<td class="cmt-content"-->
            <!--@mouseover="showCmt(row)"-->
            <!--@mouseleave="closeCmt"-->
        <!--&gt;-->
        <!--tooltip-inner popover-inner-->
        <td class="cmt-content">
          <v-popover
            popover-class="tooltip--eln-vote"
            trigger="hover"
            offset="10"
            placement="top"
            popover-inner-class="tooltip-inner popover-inner dont-break-out"
          >
            <div>
              {{ row.content | truncStrFilter(30, false) }}
            </div>
    
            <template slot="popover">
              <!--<div v-if="loadingQuestion" class="text-center">-->
                <!--<app-spin></app-spin>-->
              <!--</div>-->
              <div class="">
                <div v-html="row.content"></div>
              </div>
            </template>
          </v-popover>
        </td>
      </template>
    
      <template v-slot:cell(creator)="{row}">
        <td>
          <span class="nowrap">{{ get(row, 'student.name', '') }}</span>
          <p>
            <app-stars :stars="row.vote" :size="13" class="mt-3 mb-2"/>
          </p>
        </td>
      </template>
  
      <!--<template v-slot:cell(class)="{row}">-->
        <!--<td>-->
          <!--{{ get(row, 'student.class_name', '') }}-->
        <!--</td>-->
      <!--</template>-->
    
      <template v-slot:cell(course)="{row}">
        <td>
          <n-link :to="`/elearning/${get(row, 'elearning.id', '')}`" style="text-decoration: none;" target="_blank">
            {{ get(row, 'elearning.name', '') }}
          </n-link>
        </td>
      </template>
    
      <template v-slot:cell(created_at)="{row}">
        <td>
          <span class="nowrap">
            {{ get(row, 'timestamp', '') | getDateTimeHH_MM_D_M_Y }}
          </span>
        </td>
      </template>
    </app-table>
  </div>
</template>

<script>
  import {mapState} from "vuex"
  import { get } from "lodash"

  export default {
    components: {
    },
    data() {
      return {
        currentIndex: null,
        heads: [
          {
            name: "content",
            text: "Bình luận",
          },
          {
            name: "creator",
            text: "Người đánh giá",
          },
          // {
          //   name: "class",
          //   text: "Lớp",
          // },
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
      showCmt(cmt) {
        if (!(this.currentIndex === get(cmt, 'id'))) {
          this.currentIndex = get(cmt, 'id')
        }
      },
      closeCmt() {
        this.currentIndex = null
      },
      sortTable(info) {
        this.$emit('changedSort', info)
      },
      get
    },

  }
</script>

<style lang="scss">
  @import "~/assets/scss/components/elearning/manager/_elearning-rate-comment.scss";
</style>