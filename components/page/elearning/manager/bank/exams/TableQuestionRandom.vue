<template>
  <div>
    <div class="template-content px-0 py-0" v-if="choiceQuestion == 'random'">
      <div class="heading-5 font-weight-medium">Lựa chọn câu hỏi:</div>
      <div class="frame mt-4">
        <div class="frame__title heading-5 font-weight-medium text-center">
          NGÂN HÀNG CÂU HỎI
        </div>

        <div class="frame__content">
          <button class="text-primary mb-5 font-weight-medium body-1">
            <IconArrowBackIos24px @click.prevent="$emit('hidenModalBankQuestion', false)" class="icon mr-2 vertical-middle" />
            Chọn câu hỏi ngẫu nhiên
          </button>
          <app-table :heads="tableHeads" :data="dataExamChecked">
            <td slot="cell(name)" slot-scope="{ row }">
              {{ row.name }}
              <p class="body-3 mt-2" style="opacity: 0.5">
                {{ row.total_questions || 0 }} câu hỏi
              </p>
            </td>

            <td class="dont-break-out" slot="cell(type)" slot-scope="{ row }">
              <span class="nowrap">{{ row.type | exType2TxtTypeQues }}</span>
            </td>

            <td slot="cell(number_question)" slot-scope="{ row, index }">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <app-input
                    min="0"
                    :max="row.total_questions"
                    type="number"
                    size="sm"
                    class="mb-0 input-with-unit"
                    style="width: 80px"
                    v-model="dataTable.randoms[index].settings[0].random"
                  >
                    <div slot="unit">/{{ row.total_questions }}</div>
                  </app-input>
                </div>

                <!-- <div class="d-flex align-items-center">
                  <span class="mr-3">Trung bình</span>
                  <app-input
                    min="0"
                    :max="row.medium"
                    type="number"
                    size="sm"
                    class="mb-0 input-with-unit"
                    style="width: 80px"
                    v-model="dataTable.randoms[index].settings[1].random"
                  >
                    <div slot="unit">/{{ row.medium }}</div>
                  </app-input>
                </div>

                <div class="d-flex align-items-center">
                  <span class="mr-3">Khó</span>
                  <app-input
                    min="0"
                    :max="row.hard"
                    type="number"
                    size="sm"
                    class="mb-0 input-with-unit"
                    style="width: 80px"
                    v-model="dataTable.randoms[index].settings[2].random"
                  >
                    <div slot="unit">/{{ row.hard }}</div>
                  </app-input>
                </div> -->
              </div>
            </td>
          </app-table>
        </div>
      </div>
      <div class="text-right mt-4">
        <app-button
          color="default"
          outline
          class="mr-3 text-secondary"
          size="md"
          @click.prevent="$emit('hidenModalBankQuestion', false)"
          >Hủy
        </app-button>

        <app-button
          color="primary"
          size="md"
          @click.prevent="$emit('handleAddQuestionToBank', dataTable)"
          >Xác nhận
        </app-button>
      </div>
    </div>
  </div>
</template>

<script>
import IconArrowBackIos24px from "~/assets/svg/v2-icons/arrow_back_ios_24px.svg?inline";
export default {
  name: "TableQuestionRandom",
  components: {
    IconArrowBackIos24px,
  },

  props: {
    dataExamChecked: {
      type: Array,
      default: [],
    },
    choiceQuestion: {
      type: String,
      default: "random",
    },
  },
  data() {
    return {
      easyNumber: 0,
      mediumNumber: 0,
      hardNumber: 0,
      tableHeads: [
        {
          name: "name",
          text: "Tiêu đề ngân hàng được chọn",
        },
        {
          name: "type",
          text: "Thể loại",
        },
        {
          name: "number_question",
          text: "Chọn số câu hỏi",
        },
      ],
      dataTable: {},
    };
  },

  created() {
    this.dataTable = {
      parent_id: this.$route.query ? this.$route.query.parent_id : "",
      parent: "test",
      method: "random",
      randoms: this.dataExamChecked && this.dataExamChecked.map((item) => {
        return {
          question_bank_id: item.id,
          settings: [{random: 0}],
        }
      }) || [],
    };
    console.log("this.dataTable", this.dataTable);
  },

  methods: {
    
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/pages/elearning/manager/bank/_template-content-exams.scss";
</style>
