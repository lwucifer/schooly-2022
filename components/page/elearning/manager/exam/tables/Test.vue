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
        <td :title="get(row, 'title', '')">
          {{ get(row, 'title', '') | truncStrFilter(30) }}
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
                  :total="get(row, 'participants', 0)"
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

      <template v-slot:cell(participants)="{row}">
        <td>
          <div class="text-center">
            {{ get(row, 'participants', 0) }}
          </div>
        </td>
      </template>
      
      <template v-slot:cell(action)="{row}">
        <td>
          <!-- <n-link
            class
            title="Chi tiết"
            :to="`/elearning/manager/exams/${row.id}/participants`"
          >
            <IconArrow height="13"/>
          </n-link> -->
          <dropdown-ex-menu
            @participants="goToParticipants(row)"
            @publish="gotoPubish(row)"
            @edit="editItem(row)"
            @delete="deleteItem(row)"
            :item="row"
          >
          </dropdown-ex-menu>
        </td>
      </template>

      <template v-slot:cell(type)="{row}">
        <td>
          {{ get(row, 'type', '') | exType2Txt }}
        </td>
      </template>

      <template v-slot:cell(status)="{row}">
        <td>
          {{ get(row, 'status', '') | exPublishStatus2Txt }}
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
  import DropdownExMenu from "~/components/page/elearning/manager/exam/DropdownExMenu";
  import { get } from "lodash"
  import IconArrow from "~/assets/svg/v2-icons/arrow_forward_ios_24px.svg?inline"
  import RateStatus from "~/components/page/elearning/manager/exam/RateStatus"
  import { numeralFormat } from "~/plugins/filters";
  import { getParamQuery } from "~/utils/common"
  import { mapActions } from 'vuex';
    import { RESPONSE_SUCCESS } from "~/utils/config";


  export default {
    components: {
      IconArrow,
      RateStatus,
      DropdownExMenu
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
    data() {
      return {
        heads: [
          {
            name: "name",
            text: "Tiêu đề kiểm tra",
          },
          {
            name: "type",
            text: "Thể loại",
          },
          {
            name: "participants",
            text: "Học sinh làm bài",
            sort: true
          },
          {
            name: "rate",
            text: "Tỷ lệ hoàn thành",
          },
          {
            name: "status",
            text: "Trạng thái",
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
      ...mapActions("elearning/teaching/result", ["elearningTeachingResultPublish"]),
      onPageChange(e) {
        this.$emit('changedPagination', e)
      },
      sortTable(info) {
        this.$emit('changedSort', info)
      },
      goToParticipants(item) {
        this.$router.push(`/elearning/manager/exams/${item.id}/participants`);
      },
      gotoPubish(item) {
        console.log("[gotoPubish]", item);
        if(item.status !== "COMPLETED") {
          this.$toasted.error(`Bạn không thể xuất bản với trạng thái ${item.status}`);
          return;
        }

        this.elearningTeachingResultPublish({test_ids: [item.id]}).then(res => {
          if(res.success == RESPONSE_SUCCESS) {
            this.$toasted.success("Xuất bản thành công");
            this.$emit('reload');
            this.$emit('donePublish');
          } else {
            this.$toasted.error(res.message);
          }
        })
      },
      editItem(item) {
        this.$router.push(`/elearning/manager/exams/${item.id}/edit-test`);
      },
      deleteItem(item) {
        this.$emit('deleteItem', item);
      },
      getParamQuery,
      numeralFormat,
      get
    },
  }
</script>

<style lang="scss">
</style>