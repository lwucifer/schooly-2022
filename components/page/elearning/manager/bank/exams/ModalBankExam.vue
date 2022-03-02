<template>
  <app-modal width="815px" :title="titleExam" @close="close" :footer="false" style="margin-top: -70px">
    <template #content>
      <div class="modal-bank-exam">
        <div class="d-flex align-items-center justify-content-between">
          <div class="body-1">Danh sách câu hỏi</div>

          <div class="invalid-exam">
            <span
              v-if="getObjBankExamEdit.status == 1"
            >
              <IconPlaylistAddCheck24px
                class="mr-2 fill-primary vertical-middle"
              />Đề thi hợp lệ
            </span>
            <span v-else class="text-warning fill-warning">
              <IconAlert class="mr-2 vertical-middle" />Bạn chưa hoàn thiện nội
              dung đề thi
            </span>
          </div>
        </div>
        <template v-if="typeExam == 'CHOICE' || typeExam == 'MIX'">
          <div class="title-table text-primary body-1">
            I. Trắc nghiệm ({{ getObjBankExamEdit.choice_point}}
            điểm)
          </div>
          <app-table 
            :heads="getObjBankExamEdit.method == 'UPLOAD' ? tableHeadsUpload : tableHeads" 
            :data="filterBankExamChoice"
          >
            <td 
              v-if="row.random"
              slot="cell(index)" 
              slot-scope="{ row }" 
              style="width: 70px"
            >
              {{ row.index }}<span v-if="row.random.random > 1"
                >-{{ row.index + (row.random.random - 1) }}</span
              >
            </td>
            <td v-else :class="{'d-none': getObjBankExamEdit.method ==  'UPLOAD'}">{{ row.index }}</td>

            <td slot="cell(content)" slot-scope="{ row, index }" style="width: 400px">
              <div class="table-exam-tooltip-title">
                <span
                  v-if="row.manual"
                  v-html="row.manual && row.manual.content && row.manual.content.replace('{}', index + 1) || '-'"
                ></span>
                <span
                  v-if="row.select"
                  v-html="row.select && row.select.content"
                ></span>

                <span v-if="row.random">
                  <span>Câu hỏi ngẫu nhiên</span>
                  <p>
                    <IconRandom class="icon" />
                    {{ row.random.random }}/{{ row.random.question }} câu hỏi
                    thuộc {{ row.random.question_bank_name }}
                  </p>
                </span>
              </div>
            </td>
            <td class="dont-break-out" slot="cell(type)" slot-scope="{ row }" style="width: 110px">
              <span v-if="row.method == 'UPLOAD'">Theo file</span>
              <span v-else>{{ row.type | exType2TxtTypeQues }}</span>
            </td>

            <!-- <td class="dont-break-out" slot="cell(level)" slot-scope="{ row }" style="width: 110px">
              <span v-if="row.method == 'UPLOAD'">Theo file</span>

              <span v-if="row.manual && row.method != 'UPLOAD'">
                {{ row.manual && row.manual.level | exType2TxtLevel }}
              </span>

              <span v-if="row.select">
                {{ row.select && row.select.level | exType2TxtLevel }}
              </span>

              <span v-if="row.random">
                {{ row.random && row.random.level | exType2TxtLevel }}
              </span>
            </td> -->

            <td class="dont-break-out" slot="cell(points)" slot-scope="{ row }" style="width: 110px">
              {{ pointMediumChoice*(row.random && row.random.random ? row.random.random : 1) | divideScore }}
            </td>
          </app-table>
        </template>


        <template v-if="typeExam == 'ESSAY' || typeExam == 'MIX'">
          <div class="title-table text-primary body-1">
            II. Tự luận ({{ getObjBankExamEdit.essay_point }} điểm)
          </div>

          <app-table 
            :heads="getObjBankExamEdit.method ==  'UPLOAD' ? tableHeadsUpload : tableHeads" 
            :data="filterBankExamEssay" 
            :propsHead="typeExam == 'MIX' ? true : false"
          >
             <td 
              v-if="row.random"
              slot="cell(index)" 
              slot-scope="{ row }" 
              style="width: 70px"
            >
              {{ row.index }}<span v-if="row.random.random > 1"
                >-{{ row.index + (row.random.random - 1) }}</span
              >
            </td>
            <td v-else :class="{'d-none': getObjBankExamEdit.method ==  'UPLOAD'}">{{ row.index }}</td>

            <td slot="cell(content)" slot-scope="{ row, index }" style="width: 392px">
              <div class="table-exam-tooltip-title">
                <span
                  v-if="row.manual"
                  v-html="row.manual && row.manual.content && row.manual.content.replace('{}', index + 1) || '-'"
                ></span>
                <span
                  v-if="row.select"
                  v-html="row.select && row.select.content"
                ></span>

                <span v-if="row.random">
                  <span>Câu hỏi ngẫu nhiên</span>
                  <p>
                    <IconRandom class="icon" />
                    {{ row.random.random }}/{{ row.random.question }} câu hỏi
                    thuộc {{ row.random.question_bank_name }}
                  </p>
                </span>
              </div>
            </td>

            <td class="dont-break-out" slot="cell(type)" slot-scope="{ row }" style="width: 104px">
              <span v-if="row.method == 'UPLOAD'">Theo file</span>
              <span v-else>{{ row.type | exType2TxtTypeQues }}</span>
            </td>

            <!-- <td class="dont-break-out" slot="cell(level)" slot-scope="{ row }" style="width: 110px">
              <span v-if="row.method == 'UPLOAD'">Theo file</span>

              <span v-if="row.manual && row.method != 'UPLOAD'">
                {{ row.manual && row.manual.level | exType2TxtLevel }}
              </span>

              <span v-if="row.select">
                {{ row.select && row.select.level | exType2TxtLevel }}
              </span>

              <span v-if="row.random">
                {{ row.random && row.random.level | exType2TxtLevel }}
              </span>
            </td> -->

            <td class="dont-break-out" slot="cell(points)" slot-scope="{ row }" style="width: 110px">
              {{ row.points*(row.random && row.random.random ? row.random.random : 1) }}
            </td>
          </app-table>
        </template>

        <div class="total-point">
          <p class="heading-5">
            Tổng điểm:
            <span class="text-primary"
              >{{
                (typeExam == "MIX" || typeExam == "CHOICE") &&
                filterBankExamChoice.length > 0
                  ? 10
                  : filterPoint
              }}/10</span
            >
          </p>
          <p class="text-gray-3" v-if="typeExam == 'CHOICE'">
            *Lưu ý: Đề thi trắc nghiệm không được chỉnh sửa điểm các câu hỏi
            thành phần.
          </p>
          <p class="text-gray-3" v-else>
            *Lưu ý: Một bài tập bắt buộc có kèm câu hỏi tự luận được tính là hợp
            lệ phải có tổng điểm các câu hỏi là 10, trong đó điểm thấp nhất của
            một câu hỏi là 0,25
          </p>
        </div>

        <div class="btn-close-table text-center">
          <app-button color="primary" @click="close">Đóng</app-button>
        </div>
      </div>
    </template>
  </app-modal>
</template>

<script>
import IconPlaylistAddCheck24px from "~/assets/svg/v2-icons/playlist_add_check_24px.svg?inline";
import IconAlert from "~/assets/svg/v2-icons/alert/error_outline_24px.svg?inline";
import IconRandom from "~/assets/svg/v2-icons/random-2.svg?inline";

import { mapActions, mapState, mapGetters } from "vuex";
const EXAM_STORE = `elearning/manager/bank/exam`;
export default {
  components: {
    IconPlaylistAddCheck24px,
    IconAlert,
    IconRandom,
  },
  props: {
    typeExam: {
      type: String,
      required: false,
      default: "",
    },
    statusExam: {
      type: Number,
      required: false,
      default: 0,
    },
    titleExam: {
      type: String,
      default: "Tiêu đề của đề thi",
    },
  },

  filters:{
    divideScore(val) {
      const divided = val.toFixed(2);
      return divided;
    },
  },

  data() {
    return {
      invalidExam: false,
      tableHeads: [
        {
          name: "index",
          text: "STT",
        },
        {
          name: "content",
          text: "Nội dung",
        },
        {
          name: "type",
          text: "Thể loại",
        },
        // {
        //   name: "level",
        //   text: "Cấp độ",
        // },
        {
          name: "points",
          text: "Điểm",
        },
      ],

      tableHeadsUpload: [
        {
          name: "content",
          text: "Nội dung",
        },
        {
          name: "type",
          text: "Thể loại",
        },
        // {
        //   name: "level",
        //   text: "Cấp độ",
        // },
        {
          name: "points",
          text: "Điểm",
        },
      ],

      tableHeadsMix: [
        {
          name: "index",
        
        },
        {
          name: "content",
          
        },
        {
          name: "type",
         
        },
        // {
        //   name: "level",
          
        // },
        {
          name: "points",
         
        },
      ],
    };
  },

  computed: {
    ...mapState(EXAM_STORE, ["bankExamDetailList"]),
    ...mapState("elearning/manager/bank/exam", ["getObjBankExamEdit"]),

    filterBankExamDetail() {
      return this.bankExamDetailList && this.bankExamDetailList.content
        ? this.bankExamDetailList.content
        : [];
    },
    filterBankExamChoice() {
      const data =
        this.bankExamDetailList && this.bankExamDetailList.content
          ? this.bankExamDetailList.content
          : [];
      const dataMap = data.filter((item) => item.category == "CHOICE");
      return dataMap;
    },
    filterBankExamEssay() {
      const data =
        this.bankExamDetailList && this.bankExamDetailList.content
          ? this.bankExamDetailList.content
          : [];
      const dataMap = data.filter((item) => item.category == "ESSAY");
      return dataMap;
    },
    filterPointEssay() {
      const data =
        this.bankExamDetailList && this.bankExamDetailList.content
          ? this.bankExamDetailList.content.filter(
              (item) => item.category == "ESSAY"
            )
          : [];

      const tmp = data.reduce((sum, item) => sum + (item.points*(item.random && item.random.random ? item.random.random : 1)), 0);
      return tmp;
    },
    filterPointChoice() {
      const tmp = 10 - this.filterPointEssay;
      return tmp;
    },
    filterPoint() {
      const data =
        this.bankExamDetailList && this.bankExamDetailList.content
          ? this.bankExamDetailList.content
          : [];

      const tmp = data.reduce((sum, item) => sum + (item.points || 0), 0);
      return tmp;
    },
    pointMediumChoice() {
      const checkNumberRandom = this.filterBankExamChoice.reduce((sum, item) => sum + (item.random && item.random.random - 1 || 0), 0);
      const tmp =
        this.typeExam == "CHOICE"
          ? 10 / (this.filterBankExamChoice.length+checkNumberRandom)
          : this.filterPointChoice / (this.filterBankExamChoice.length+checkNumberRandom);
      return tmp;
    },
    checkExamFinish() {
      let data =
        this.bankExamDetailList && this.bankExamDetailList.content
          ? this.bankExamDetailList.content.filter(
              (item) => item.category == "ESSAY"
            )
          : [];
      let checkStatus = false;
      let tmp = data.reduce((sum, item) => sum + (item.points || 0), 0);
      let sumPointsChoice = 10 - tmp;
      let pointMediumChoice =
        sumPointsChoice / this.filterBankExamChoice.length;
      if (pointMediumChoice % 0.25 == 0) {
        checkStatus = true;
      } else {
        checkStatus = false;
      }
      return checkStatus;
    },
  },

  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss">
@import "~assets/scss/components/elearning/manager/bank/exam/_modal-bank-exam.scss";
</style>
