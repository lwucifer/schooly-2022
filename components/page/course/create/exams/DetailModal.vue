<template>
  <app-modal
    centered
    :width="815"
    :title="get(dataRow, 'name', '')"
    :component-class="{ 'modal--round': true, 'modal--exercise': true }"
    @close="$emit('close')"
  >
    <div slot="content" v-if="loading">
      <vcl-list />
      <vcl-list />
    </div>
    <div slot="content" class v-else>
      <div class="detail-exercise__doing-info">
        <div class="row">
          <div class="col-md-4">
            <div class="dtex__doing-info-item">
              Thời gian làm bài:
              <span
                class="text-primary font-weight-medium heading-5"
              >&nbsp;{{ get(dataRow, 'settings.duration', 0) }} phút</span>
            </div>
          </div>
          <div class="col-md-4">
            <div class="dtex__doing-info-item">
              Điểm đạt:
              <span
                class="text-primary font-weight-medium heading-5"
              >&nbsp;{{ get(dataRow, 'settings.passing_score', 0) }}/10</span>
            </div>
          </div>
          <div class="col-md-4">
            <div class="dtex__doing-info-item">
              Số lần làm bài tối đa:
              <span
                class="text-primary font-weight-medium heading-5"
              >&nbsp;{{ get(dataRow, 'settings.works', 0) }} lần</span>
            </div>
          </div>

          <div class="col-md-4">
            <div class="dtex__doing-info-item">
              <span>{{ get(dataRow, 'settings.coefficient', false) ? 'Hệ số: ' : 'Trọng số: ' }}</span>
              <span
                class="text-primary font-weight-medium heading-5"
              >&nbsp;{{ get(dataRow, 'settings.coefficient', false) ? get(dataRow, 'settings.coefficient') : `${get(dataRow, 'settings.weight', 0)} %` }}</span>
            </div>
          </div>

          <div class="col-md-4">
            <div class="dtex__doing-info-item nowrap">
              Giờ mở đề:
              <span
                class="text-primary font-weight-medium heading-5"
              >&nbsp;{{ get(dataRow, 'settings.starttime_enable', false) ? getDateTimeHH_MM_D_M_Y_DASH_UTC(get(dataRow, 'settings.start_time', '')) : 'Không áp dụng' }}</span>
            </div>
          </div>

          <div class="col-md-4">
            <div class="dtex__doing-info-item nowrap">
              Giờ đóng đề:
              <span
                class="text-primary font-weight-medium heading-5"
              >&nbsp;{{ get(dataRow, 'settings.endtime_enable', false) ? getDateTimeHH_MM_D_M_Y_DASH_UTC(get(dataRow, 'settings.end_time', '')) : 'Không áp dụng' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Question list -->
      <div class="detail-exercise__question-list">
        <div class="dtex-question-list-title">
          <h6>Danh sách câu hỏi</h6>
          <div class="dtex-question-list-right">
            <p class="text-warning" v-if="!get(dataRow, 'status', true)">
              <IconWarning />Bạn chưa hoàn thiện nội dung bài kiểm tra
            </p>
            <p v-else>
              <IconPlaylistCheck class="fill-primary" />Bài kiểm tra hợp lệ
            </p>
            <!-- <p class="heading-5">
              <IconStarFilled v-if="get(dataRow, 'required', false)" />
              <IconStarBorder v-else />
              <span>{{ get(exam, 'required', false) ? 'Bài kiểm tra bắt buộc' : 'Bài kiểm tra không bắt buộc' }}</span>
            </p>-->
          </div>
        </div>

        <div class="dtex-question-list-content">
          <div
            v-if="get(dataRow, 'type', '') == EXAM_TYPES['CHOICE'] || get(dataRow, 'type', '') == EXAM_TYPES['MIX']"
          >
            <div class="mb-15">
              <p class="text-primary">
                <span v-if="get(dataRow, 'type', '') == EXAM_TYPES['MIX']">I.</span>
                &nbsp;Trắc nghiệm ({{filterPointChoice}} điểm)
              </p>
            </div>
            <app-table
              :heads="heads"
              :needPagination="false"
              :data="filterBankExamChoice"
              class="mb-4"
              :ext-table-cls="{ 'table--nowrap-header': true }"
              :cols="[8,55,15,12,10]"
            >
              <template v-slot:cell(index)="{row}">
                <td>
                  <p class="text-center nowrap w-100">{{ row.range }}</p>
                </td>
              </template>

              <template v-slot:cell(title)="{row, index}">
                <td>
                  <div class>
                    <v-popover
                      class
                      trigger="hover"
                      placement="top"
                      popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content tooltip p-0"
                      :disabled="isQuestionRandom(row)"
                      :autoHide="false"
                    >
                      <div class="collapsed-content">
                        <div v-if="row.method == 'UPLOAD'">
                          <p
                            class="dont-break-out"
                            v-html="row.manual && row.manual.content && row.manual.content.replace('{}', index) || '-'"
                          ></p>
                        </div>

                        <div v-else-if="isQuestionFromManual(row) || isQuestionFromBank(row)">
                          <p class="dont-break-out" v-html="getQuestionContent(row)"></p>
                        </div>

                        <div v-else-if="isQuestionRandom(row)">
                          <span class="nowrap">
                            Câu hỏi ngẫu nhiên
                            <p
                              class="body-3 text-gray-3"
                            >({{ `${get(row, 'random.random', 0)}/${get(row, 'random.question', 0)} từ ngân hàng cậu hỏi ${get(row, 'random.question_bank_name', '')}` }})</p>
                          </span>
                        </div>
                      </div>
                      <template slot="popover" class="tooltip-detail">
                        <div class="tooltip-limited-content">
                          <div v-if="row.method == 'UPLOAD'">
                            <p
                              class="dont-break-out"
                              v-html="row.manual && row.manual.content && row.manual.content.replace('{}', index) || '-'"
                            ></p>
                          </div>

                          <div v-else-if="isQuestionFromManual(row) || isQuestionFromBank(row)">
                            <p class="dont-break-out" v-html="getQuestionContent(row)"></p>
                          </div>

                          <div v-else-if="isQuestionRandom(row)">
                            <span class="nowrap">
                              Câu hỏi ngẫu nhiên
                              <p
                                class="body-3 text-gray-3"
                              >({{ `${get(row, 'random.random', 0)}/${get(row, 'random.question', 0)} từ ngân hàng cậu hỏi ${get(row, 'random.question_bank_name', '')}` }})</p>
                            </span>
                          </div>
                        </div>
                      </template>
                    </v-popover>
                  </div>
                </td>

                <!-- <td v-if="row.method == 'UPLOAD'">
                  <p
                    class="dont-break-out"
                    v-html="row.manual && row.manual.content && row.manual.content.replace('{}', index) || '-'"
                  ></p>
                </td>
                <td v-else-if="isQuestionFromManual(row) || isQuestionFromBank(row)">
                  <p class="dont-break-out" v-html="getQuestionContent(row)"></p>
                </td>
                <td v-else-if="isQuestionRandom(row)">
                  <span class="nowrap">
                    Câu hỏi ngẫu nhiên
                    <p
                      class="body-3 text-gray-3"
                    >({{ `${get(row, 'random.random', 0)}/${get(row, 'random.question', 0)} từ ngân hàng cậu hỏi ${get(row, 'random.question_bank_name', '')}` }})</p>
                  </span>
                </td>-->
              </template>

              <template v-slot:cell(type)="{row}">
                <td>
                  <p class="nowrap">{{ row.type | exType2TxtTypeQues }}</p>
                </td>
              </template>

              <template v-slot:cell(level)="{row}">
                <td>
                  <p class="nowrap">{{ getQuestionLevel(row) | exType2TxtLevel }}</p>
                </td>
              </template>

              <template v-slot:cell(points)="{row}">
                <td>
                  <p
                    class="nowrap text-center w-100"
                  >{{ filterPointChoice > 0 ? (Number.isInteger(filterPointChoice/filterBankExamChoice.length) ? filterPointChoice/filterBankExamChoice.length : (filterPointChoice/filterBankExamChoice.length).toFixed(2)) : 0 }}</p>
                </td>
              </template>
            </app-table>

            <p class="mb-3">
              <span class="body-3">
                *Lưu ý: Đề thi trắc nghiệm không được chỉnh sửa điểm các câu hỏi thành phần.
              </span>
            </p>
          </div>

          <div
            v-if="get(dataRow, 'type', '') == EXAM_TYPES['ESSAY'] || get(dataRow, 'type', '') == EXAM_TYPES['MIX']"
          >
            <div class="mb-15">
              <p class="text-primary">
                <span v-if="get(dataRow, 'type', '') == EXAM_TYPES['MIX']">II.</span>
                &nbsp;Tự luận ({{filterPointEssay}} điểm)
              </p>
            </div>
            <app-table
              :heads="heads"
              :needPagination="false"
              :data="filterBankExamEssay"
              class="mb-4"
              :ext-table-cls="{ 'table--nowrap-header': true }"
              :cols="[8,55,15,12,10]"
            >
              <template v-slot:cell(index)="{row}">
                <td>
                  <p class="text-center nowrap w-100">
                    <span class="nowrap">{{ row.range }}</span>
                  </p>
                </td>
              </template>

              <!-- <template v-slot:cell(title)="{row, index}">
                <td v-if="row.method == 'UPLOAD'">
                  <p
                    class="dont-break-out"
                    v-html="row.manual && row.manual.content && row.manual.content.replace('{}', index) || '-'"
                  ></p>
                </td>
                <td v-else-if="isQuestionFromManual(row) || isQuestionFromBank(row)">
                  <p class="dont-break-out" v-html="getQuestionContent(row)"></p>
                </td>
                <td v-else-if="isQuestionRandom(row)">
                  <span class="nowrap">
                    Câu hỏi ngẫu nhiên
                    <p
                      class="body-3 text-gray-3"
                    >({{ `${get(row, 'random.random', 0)}/${get(row, 'random.question', 0)} từ ngân hàng cậu hỏi ${get(row, 'random.question_bank_name', '')}` }})</p>
                  </span>
                </td>
              </template>-->
              <template v-slot:cell(title)="{row, index}">
                <td>
                  <div class>
                    <v-popover
                      class
                      trigger="hover"
                      placement="top"
                      popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content tooltip p-0"
                      :disabled="isQuestionRandom(row)"
                      :autoHide="false"
                    >
                      <div class="collapsed-content">
                        <div v-if="row.method == 'UPLOAD'">
                          <p
                            class="dont-break-out"
                            v-html="row.manual && row.manual.content && row.manual.content.replace('{}', index) || '-'"
                          ></p>
                        </div>

                        <div v-else-if="isQuestionFromManual(row) || isQuestionFromBank(row)">
                          <p class="dont-break-out" v-html="getQuestionContent(row)"></p>
                        </div>

                        <div v-else-if="isQuestionRandom(row)">
                          <span class="nowrap">
                            Câu hỏi ngẫu nhiên
                            <p
                              class="body-3 text-gray-3"
                            >({{ `${get(row, 'random.random', 0)}/${get(row, 'random.question', 0)} từ ngân hàng cậu hỏi ${get(row, 'random.question_bank_name', '')}` }})</p>
                          </span>
                        </div>
                      </div>
                      <template slot="popover" class="tooltip-detail">
                        <div class="tooltip-limited-content">
                          <div v-if="row.method == 'UPLOAD'">
                            <p
                              class="dont-break-out"
                              v-html="row.manual && row.manual.content && row.manual.content.replace('{}', index) || '-'"
                            ></p>
                          </div>

                          <div v-else-if="isQuestionFromManual(row) || isQuestionFromBank(row)">
                            <p class="dont-break-out" v-html="getQuestionContent(row)"></p>
                          </div>

                          <div v-else-if="isQuestionRandom(row)">
                            <span class="nowrap">
                              Câu hỏi ngẫu nhiên
                              <p
                                class="body-3 text-gray-3"
                              >({{ `${get(row, 'random.random', 0)}/${get(row, 'random.question', 0)} từ ngân hàng cậu hỏi ${get(row, 'random.question_bank_name', '')}` }})</p>
                            </span>
                          </div>
                        </div>
                      </template>
                    </v-popover>
                  </div>
                </td>
              </template>

              <template v-slot:cell(type)="{row}">
                <td>
                  <p class="nowrap">{{ row.type | exType2TxtTypeQues }}</p>
                </td>
              </template>

              <template v-slot:cell(level)="{row}">
                <td>
                  <p class="nowrap">{{ getQuestionLevel(row) | exType2TxtLevel }}</p>
                </td>
              </template>

              <template v-slot:cell(points)="{row}">
                <td>
                  <p class="nowrap text-center w-100">{{ row.points }}</p>
                </td>
              </template>
            </app-table>
          </div>

          <p class="mb-1">
            <span class="heading-5 text-dark">Tổng điểm:</span>
            <span class="heading-5 text-primary">{{ filterPoint }}/{{ scalePoint }}</span>
          </p>
          <p>
            <span
              v-if="get(exam, 'required', false)"
              class="body-3"
            >*Lưu ý: Một bài kiểm tra bắt buộc có kèm câu hỏi tự luận được tính là hợp lệ phải có tổng điểm các câu hỏi là 10, trong đó điểm thấp nhất của một câu hỏi là 0,25</span>
            <span
              v-else
              class="body-3"
            >*Lưu ý: Một bài kiểm tra không bắt buộc không quy định số lượng câu hỏi và điểm từng câu hỏi, bạn có thể tạo tùy ý thích.</span>
          </p>
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
import IconStarFilled from "~/assets/svg/v2-icons/star2_24px.svg?inline";
import IconStarBorder from "~/assets/svg/v2-icons/star_border2_24px.svg?inline";
import { VclList } from "vue-content-loading";
import { mapState } from "vuex";
import { get } from "lodash";
import { EXAM_TYPES, QUESTION_CREATATION_METHODS } from "~/utils/constants";
import {
  getDateTimeHH_MM_D_M_Y_DASH,
  getDateTimeHH_MM_D_M_Y_DASH_UTC,
} from "~/utils/moment";
const EXAM_STORE = `elearning/manager/bank/exam`;
function isRandomItem(item) {
  return [QUESTION_CREATATION_METHODS["RANDOM"]].includes(
    get(item, "method", "")
  );
}

function hasRange(item) {
  return isRandomItem(item);
}
export default {
  components: {
    IconWarning,
    IconPlaylistCheck,
    IconStarFilled,
    IconStarBorder,
    VclList,
  },
  props: {
    dataRow: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      EXAM_TYPES: Object.freeze(EXAM_TYPES),
      QUESTION_CREATATION_METHODS: Object.freeze(QUESTION_CREATATION_METHODS),
      heads: [
        {
          name: "index",
          text: "STT",
          classTextCenter: true,
        },
        {
          name: "title",
          text: "Nội dung",
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
          name: "points",
          text: "Điểm",
          classTextCenter: true,
        },
      ],
    };
  },
  computed: {
    ...mapState("elearning/create", {
      exam: "exam",
    }),
    ...mapState(EXAM_STORE, ["bankExamDetailList"]),
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
      let lastIndex = 0;
      let neededRecords = dataMap.filter((item) => {
        let from = "",
          to = "",
          range = "";
        let points_total = 0;
        let point_for_each = get(item, "points", 0);

        if (hasRange(item)) {
          console.log("essay: has range");
          let rangeSize = get(item, "random.random", 0);

          if (rangeSize > 1) {
            from = lastIndex + 1;
            to = from + rangeSize - 1;
            range = `${from} - ${to}`;
          } else {
            to = lastIndex + rangeSize;
            range = to;
          }
          points_total = point_for_each * rangeSize;
        } else {
          to = lastIndex + 1; // from # to
          range = to;
          points_total = point_for_each;
        }
        lastIndex = to;
        item.range = range;
        return item;
      });
      return neededRecords;
      // return dataMap;
    },
    filterBankExamEssay() {
      const data =
        this.bankExamDetailList && this.bankExamDetailList.content
          ? this.bankExamDetailList.content
          : [];
      const dataMap = data.filter((item) => item.category == "ESSAY");
      let lastIndex = 0;
      let neededRecords = dataMap.filter((item) => {
        let from = "",
          to = "",
          range = "";
        let points_total = 0;
        let point_for_each = get(item, "points", 0);

        if (hasRange(item)) {
          let rangeSize = get(item, "random.random", 0);

          if (rangeSize > 1) {
            from = lastIndex + 1;
            to = from + rangeSize - 1;
            range = `${from} - ${to}`;
          } else {
            to = lastIndex + rangeSize;
            range = to;
          }
          points_total = point_for_each * rangeSize;
        } else {
          to = lastIndex + 1; // from # to
          range = to;
          points_total = point_for_each;
        }
        lastIndex = to;
        item.range = range;
        return item;
      });
      return neededRecords;
    },
    filterPointEssay() {
      const data =
        this.bankExamDetailList && this.bankExamDetailList.content
          ? this.bankExamDetailList.content.filter(
              (item) => item.category == "ESSAY"
            )
          : [];

      const tmp = data.reduce((sum, item) => sum + (item.points || 0), 0);
      return tmp;
    },
    filterPointChoice() {
      // const data =
      //   this.bankExamDetailList && this.bankExamDetailList.content
      //     ? this.bankExamDetailList.content.filter(
      //         (item) => item.category == "CHOICE"
      //       )
      //     : [];

      // const tmp = data.reduce((sum, item) => sum + (item.points || 0), 0);
      // return tmp;
      const tmp = this.filterPointEssay < 10 ? 10 - this.filterPointEssay : 0;
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
    scalePoint() {
      const data = this.dataRow && this.dataRow.settings && this.dataRow.settings.points ? this.dataRow.settings.points : 10;
      return data;
    }
  },
  methods: {
    isQuestionFromManual(question) {
      return [
        QUESTION_CREATATION_METHODS["MANUAL"],
        QUESTION_CREATATION_METHODS["UPLOAD"],
        QUESTION_CREATATION_METHODS["IMPORT"],
      ].includes(get(question, "method", ""));
    },
    isQuestionFromBank(question) {
      return [
        QUESTION_CREATATION_METHODS["SELECT"],
        QUESTION_CREATATION_METHODS["IPTEST"],
      ].includes(get(question, "method", ""));
    },
    isQuestionRandom(question) {
      return [QUESTION_CREATATION_METHODS["RANDOM"]].includes(
        get(question, "method", "")
      );
    },
    getQuestionContent(question) {
      if (this.isQuestionFromManual(question)) {
        return get(question, "manual.content", "");
      }
      if (this.isQuestionFromBank(question)) {
        return get(question, "select.content", "");
      }
      if (this.isQuestionRandom(question)) {
        return get(question, "content", "");
      }
      return "";
    },
    getQuestionLevel(question) {
      if (this.isQuestionFromManual(question)) {
        return get(question, "manual.level", "");
      }
      if (this.isQuestionFromBank(question)) {
        return get(question, "select.level", "");
      }
      if (this.isQuestionRandom(question)) {
        return get(question, "random.level", "");
      }
      return "";
    },
    get,
    getDateTimeHH_MM_D_M_Y_DASH,
    getDateTimeHH_MM_D_M_Y_DASH_UTC,
  },
};
</script>
<style lang="scss">
</style>
