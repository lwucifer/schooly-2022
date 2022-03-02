<template>
  <div>
    <div class="template-content" v-if="choiceQuestion == 'random'">
      <div class="heading-5 font-weight-medium">Chỉnh sửa câu hỏi:</div>
      <div class="frame mt-4">
        <div class="frame__title heading-5 font-weight-medium text-center">
          NGÂN HÀNG CÂU HỎI
        </div>

        <div class="frame__content">
          <button class="text-primary mb-5 font-weight-medium body-1">
            <IconArrowBackIos24px
              @click.prevent="$emit('hidenModalBankQuestion', false)"
              class="icon mr-2 vertical-middle"
            />
            Chỉnh sửa câu hỏi ngẫu nhiên
          </button>
          <app-table :heads="tableHeads" :data="dataExamChecked">
            <td slot="cell(name)" slot-scope="{ row }">
              {{ (row.random && row.random.question_bank_name) || "" }}
              <p class="body-3 mt-2" style="opacity: 0.5">
                {{ (row.random && row.random.question) || 0 }} câu hỏi
              </p>
            </td>

            <td class="dont-break-out" slot="cell(type)" slot-scope="{ row }">
              <span class="nowrap">{{ row.type | exType2TxtTypeQues }}</span>
            </td>

            <td slot="cell(number_question)" slot-scope="{ row }">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <!-- <span class="mr-3">Dễ</span> -->
                  <app-input
                    min="0"
                    type="number"
                    size="sm"
                    class="mb-0 input-with-unit"
                    style="width: 80px"
                    v-model="dataTable.random.settings[0].random"
                  >
                  <div slot="unit">/{{ row.random.question }}</div>
                  </app-input>
                </div>

                <!-- <div class="d-flex align-items-center" v-if="row.random.level == 'MEDIUM'">
                  <span class="mr-3">Trung bình</span>
                  <app-input
                    min="0"
                    type="number"
                    size="sm"
                    class="mb-0 w-50"
                    v-model="dataTable.random.settings[1].random"
                  />
                </div>

                <div class="d-flex align-items-center" v-if="row.random.level == 'HARD'">
                  <span class="mr-3">Khó</span>
                  <app-input
                    min="0"
                    type="number"
                    size="sm"
                    class="mb-0 w-50"
                    v-model="dataTable.random.settings[2].random"
                  />
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
      dataTable: {
        test_id: "",
        random_id: "",
        method: "RANDOM",
        random:{
          question_bank_id: "",
          settings: [
            {
              level: "easy",
              random: 0
            },
            {
              level: "medium",
              random: 0
            },
            {
              level: "hard",
              random: 0
            }
          ]
        }
      },
    };
  },

  created() {
    console.log("this.dataExamChecked", this.dataExamChecked);
    const [data] = this.dataExamChecked;
    this.dataTable = {
      test_id: this.$route.query ? this.$route.query.id : "",
      random_id: data ? data.id : "",
      method: "RANDOM",
      random: {
        question_bank_id: data && data.random ? data.random.question_bank_id : '',
        settings: [{random: data.random && data.random.random}],
      },
    };
    console.log("this.dataTable", this.dataTable);
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/pages/elearning/manager/bank/_template-content-exams.scss";
</style>
