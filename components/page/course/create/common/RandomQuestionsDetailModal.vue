<template>
  <app-modal
    centered
    title="Danh sách câu hỏi ngẫu nhiên"
    :component-class="{ 'modal--round': true, 'modal--exercise': true }"
    @close="$emit('close')"
  >
    <!-- Header -->
    <div slot="header">
      <div class="d-flex align-items-center justify-content-between">
        <h4 class="app-modal-title text-center w-100 pl-4">Danh sách câu hỏi ngẫu nhiên</h4>
        <button class="app-modal-close" @click="$emit('close')">
          <IconClose class="icon d-block fill-opacity-1" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div slot="content" v-if="loading">
      <vcl-list />
      <vcl-list />
    </div>
    <div slot="content" v-else>
      <div class="detail-exercise__question-list">
        <div class="dtex-question-list-content">
          <div>
            <div class="mb-15">
              <p
                class="text-primary font-weight-medium"
              >Ngân hàng câu hỏi "{{content && content.random && content.random.question_bank_name}}"</p>
            </div>
            <app-table
              :heads="heads"
              :needPagination="false"
              :data="[content]"
              class="mb-4"
              :ext-table-cls="{ 'table--nowrap-header': true }"
            >
              <template v-slot:cell(order)="{index}">
                <td>
                  <span class="nowrap">{{ index + 1 }}</span>
                </td>
              </template>

              <!-- <template v-slot:cell(title)="{row}">
                <td>
                  <p class="dont-break-out" v-html="get(row, 'random.content', '')"></p>
                </td>
              </template>-->
              <!-- <p>{{ row.description }}</p> -->
              <template v-slot:cell(type)="{row}">
                <td>
                  <p class="nowrap">{{ row.type | exType2TxtTypeQues }}</p>
                </td>
              </template>

              <template v-slot:cell(number_question)="{row}">
                <td>
                  <p class="nowrap">{{ get(row, 'random.question', '') || 0 }}</p>
                </td>
              </template>

              <template v-slot:cell(random)="{row}">
                <td>
                  <p class="nowrap">{{ get(row, 'random.random', '') || 0 }}</p>
                </td>
              </template>

              <template v-slot:cell(level)="{row}">
                <td>
                  <p class="nowrap">{{ row.random && row.random.level | exType2TxtLevel }}</p>
                </td>
              </template>
            </app-table>
          </div>
        </div>
      </div>
    </div>

    <div slot="footer">
      <p class="text-center">
        <app-button class="btn--semi-round" @click="$emit('close')">Đóng</app-button>
      </p>
    </div>
  </app-modal>
</template>

<script>
import IconWarning from "~/assets/svg/v2-icons/error_outline_24px.svg?inline";
import IconPlaylistCheck from "~/assets/svg/v2-icons/playlist_add_check_24px.svg?inline";
import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline";
import { get } from "lodash";
import { EXERCISE_TYPES } from "~/utils/constants";

export default {
  components: {
    IconWarning,
    IconPlaylistCheck,
    IconClose,
  },
  props: {
    content: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      heads: [
        {
          name: "order",
          text: "STT",
        },
        {
          name: "type",
          text: "Thể loại",
        },
        {
          name: "level",
          text: "Cấp độ",
        },
        {
          name: "number_question",
          text: "Số câu hỏi",
        },
        {
          name: "random",
          text: "Số câu hỏi đã chọn",
        },
        {
          name: "points",
          text: "Điểm",
        },
      ],
      list: [
        {
          type: "ESSAY",
          manual: {
            content: "content cau hoi",
            level: "MEDIUM",
          },
        },
      ],
    };
  },
  methods: {
    get,
  },
};
</script>
<style lang="scss">
</style>