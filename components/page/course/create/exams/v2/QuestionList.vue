<template>
  <div class="detail-exercise__question-list">
    <div class="dtex-question-list-title">
      <h6>Danh sách câu hỏi</h6>
      <div class="dtex-question-list-right">
        <p class="text-warning" v-if="!filterStatus">
          <IconWarning />Bạn chưa hoàn thiện nội dung kiểm tra
        </p>
        <p v-else>
          <IconPlaylistCheck class="fill-primary" />Bài kiểm tra hợp lệ
        </p>
        <!-- <p class="heading-5">
            <IconStarFilled v-if="get(exam, 'required', false)"/>
            <IconStarBorder v-else />
            <span>{{ get(exam, 'required', false) ? 'Bài kiểm tra bắt buộc' : 'Bài kiểm tra không bắt buộc' }}</span>
        </p>-->
      </div>
    </div>

    <div class="dtex-question-list-content">
      <div
        v-if="get(dataPayload, 'type', '') == EXAM_TYPES['CHOICE'] || get(dataPayload, 'type', '') == EXAM_TYPES['MIX']"
      >
        <div class="mb-15">
          <p class="text-primary d-flex">
            <span v-if="get(dataPayload, 'type', '') == EXAM_TYPES['MIX']">I.</span>&nbsp;Trắc nghiệm
            <span>&nbsp;({{filterPointChoice}} điểm)</span>
            <!-- <span class="ml-2">
              <dropdown-edit-score-menu />
            </span>-->
          </p>
        </div>
        <app-table
          :heads="heads"
          :needPagination="false"
          :data="filterBankExamChoice"
          class="mb-4"
          :ext-table-cls="{ 'table--nowrap-header': true }"
          :cols="[8,55,17,10,10]"
        >
          <draggable @end="onEnd" tag="tbody">
            <template v-for="(item, index) in filterBankExamChoice">
              <tr :key="index" class="text-vertical-top">
                <td>
                  <p class="text-center nowrap w-100">{{ item.range }}</p>
                </td>

                <td>
                  <div class>
                    <v-popover
                      class
                      trigger="hover"
                      placement="top"
                      popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content"
                      :disabled="isQuestionRandom(item)"
                      :autoHide="false"
                    >
                      <div class="collapsed-content">
                        <p v-if="item.method == 'RANDOM'">
                          <span class="nowrap">
                            Câu hỏi ngẫu nhiên
                            <p class="body-3 text-gray-3">
                              ({{item.random && item.random.random}}/{{item.random && item.random.question}} từ ngân hàng cậu hỏi
                              {{item.random && item.random.question_bank_name}})
                            </p>
                          </span>
                        </p>

                        <p
                          v-else-if="item.method == 'MANUAL'"
                          class="dont-break-out"
                          v-html="get(item, 'manual.content', '')"
                        ></p>
                        <div v-else-if="item.method == 'UPLOAD'">
                          <p
                            class="dont-break-out"
                            v-html="item.manual && item.manual.content && item.manual.content.replace('{}', index + 1) || '-'"
                          ></p>
                        </div>
                        <p v-else class="dont-break-out" v-html="get(item, 'select.content', '')"></p>
                      </div>

                      <template slot="popover" class="tooltip-detail">
                        <div class="tooltip-limited-content">
                          <p v-if="item.method == 'RANDOM'">
                            <span class="nowrap">
                              Câu hỏi ngẫu nhiên
                              <p class="body-3 text-gray-3">
                                ({{item.random && item.random.random}}/{{item.random && item.random.question}} từ ngân hàng cậu hỏi
                                {{item.random && item.random.question_bank_name}})
                              </p>
                            </span>
                          </p>

                          <p
                            v-else-if="item.method == 'MANUAL'"
                            class="dont-break-out"
                            v-html="get(item, 'manual.content', '')"
                          ></p>
                          <div v-else-if="item.method == 'UPLOAD'">
                            <p
                              class="dont-break-out"
                              v-html="item.manual && item.manual.content && item.manual.content.replace('{}', index + 1) || '-'"
                            ></p>
                          </div>
                          <p v-else class="dont-break-out" v-html="get(item, 'select.content', '')"></p>
                        </div>
                      </template>
                    </v-popover>
                  </div>
                </td>

                <td>
                  <span class="nowrap">{{ item.type | exType2TxtTypeQues }}</span>
                </td>
                <!-- <td v-if="item.method == 'RANDOM'">
                  <span class="nowrap">{{ item.random && item.random.level | exType2TxtLevel }}</span>
                </td>
                <td v-else-if="item.method == 'MANUAL'">
                  <span class="nowrap">{{ item.manual && item.manual.level | exType2TxtLevel }}</span>
                </td>
                <td v-else-if="item.method == 'UPLOAD'">
                  <span class="nowrap">{{ item.manual && item.manual.level | exType2TxtLevel }}</span>
                </td>
                <td v-else>
                  <span class="nowrap">{{ item.select && item.select.level | exType2TxtLevel }}</span>
                </td> -->
                <td>
                  <p
                    class="text-center w-100"
                  >{{ filterPointChoice > 0 ? (Number.isInteger(filterPointChoice/item.lengthArr) ? ((filterPointChoice/item.lengthArr) * item.numberRandom) : converNumberDecs2((filterPointChoice/item.lengthArr)* item.numberRandom)) : 0 }}</p>
                </td>
                <td class="text-right">
                  <dropdown-setting-menu
                    :hide-sort="true"
                    :hide-edit-score="true"
                    @detail="showDetail(item)"
                    @edit="editQuestion(item, index + 1)"
                    @soft="sortQuestion(item)"
                    @delete="deleteQuestion(item)"
                  />
                </td>
              </tr>

              <tr
                v-if="get(editingItem, 'id', '') == item.id"
                class="app-table--expanded-content"
                :key="'expand' + index"
              >
                <td class="p-0" :colspan="colCounter">
                  <!-- Questions from bank of questions have the most priority -->
                  <edit-question-from-bank
                    v-if="get(editingItem, 'method', '') == 'RANDOM'"
                    @cancel="cancelEditQuestion"
                    @submit="submit"
                    :editingItem="editingItem"
                  ></edit-question-from-bank>
                  <edit-question-file-type
                    v-else-if="get(editingItem, 'type', '') == 'BY_FILE'"
                    :editingItem="editingItem"
                    @submit="submit"
                  ></edit-question-file-type>
                  <edit-question-yes-no
                    v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['YES_NO']"
                    @cancel="cancelEditQuestion"
                    @submit="submit"
                    :editingItem="editingItem"
                  ></edit-question-yes-no>
                  <edit-question-single-choice
                    v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['SINGLE_CHOICE']"
                    @cancel="cancelEditQuestion"
                    @submit="submit"
                    :editingItem="editingItem"
                  ></edit-question-single-choice>
                  <edit-question-multi-choice
                    v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['MULTIPLE_CHOICE']"
                    @cancel="cancelEditQuestion"
                    @submit="submit"
                    :editingItem="editingItem"
                  ></edit-question-multi-choice>
                  <edit-question-fill-blank
                    v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['FILL_IN_BLANK']"
                    @cancel="cancelEditQuestion"
                    @submit="submit"
                    :editingItem="editingItem"
                  ></edit-question-fill-blank>
                  <edit-question-writing
                    v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['ESSAY']"
                    @cancel="cancelEditQuestion"
                    @submit="submit"
                    :editingItem="editingItem"
                  ></edit-question-writing>
                  <edit-question-word-choice
                    v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['WORD_CHOICE']"
                    @cancel="cancelEditQuestion"
                    @submit="submit"
                    :editingItem="editingItem"
                  ></edit-question-word-choice>
                  <edit-question-match-word
                    v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['WORD_MATCH']"
                    @cancel="cancelEditQuestion"
                    @submit="submit"
                    :editingItem="editingItem"
                  ></edit-question-match-word>
                  <div v-else>
                    <p class="text-center body-3 text-gray-3 px-4 py-3">Loại câu hỏi không hợp lệ</p>
                  </div>
                </td>
              </tr>
            </template>
          </draggable>
        </app-table>
      </div>

      <div
        v-if="get(dataPayload, 'type', '') == EXAM_TYPES['ESSAY'] || get(dataPayload, 'type', '') == EXAM_TYPES['MIX']"
      >
        <div class="mb-15">
          <p class="text-primary d-flex">
            <span v-if="get(dataPayload, 'type', '') == EXAM_TYPES['MIX']">II.</span>&nbsp;Tự luận
            <span>&nbsp;({{filterPointEssay}} điểm)</span>
            <!-- <span class="ml-2">
              <dropdown-edit-score-menu />
            </span>-->
          </p>
        </div>
        <app-table
          :heads="heads"
          :needPagination="false"
          :data="filterBankExamEssay"
          class="mb-4"
          :ext-table-cls="{ 'table--nowrap-header': true }"
          :cols="[8,55,17,10,10]"
        >
          <draggable @end="onEndEassy" tag="tbody">
            <template v-for="(item, index) in filterBankExamEssay">
              <tr :key="index" class="text-vertical-top">
                <td>
                  <p class="text-center nowrap w-100">{{ item.range }}</p>
                </td>
                <td>
                  <div class>
                    <v-popover
                      class
                      trigger="hover"
                      placement="top"
                      popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content"
                      :disabled="isQuestionRandom(item)"
                      :autoHide="false"
                    >
                      <div class="collapsed-content">
                        <p v-if="item.method == 'RANDOM'">
                          <span class="nowrap">
                            Câu hỏi ngẫu nhiên
                            <p class="body-3 text-gray-3">
                              ({{item.random && item.random.random}}/{{item.random && item.random.question}} từ ngân hàng cậu hỏi
                              {{item.random && item.random.question_bank_name}})
                            </p>
                          </span>
                        </p>

                        <p
                          v-else-if="item.method == 'MANUAL'"
                          class="dont-break-out"
                          v-html="get(item, 'manual.content', '')"
                        ></p>
                        <div v-else-if="item.method == 'UPLOAD'">
                          <p
                            class="dont-break-out"
                            v-html="item.manual && item.manual.content && item.manual.content.replace('{}', index + 1) || '-'"
                          ></p>
                        </div>
                        <p v-else class="dont-break-out" v-html="get(item, 'select.content', '')"></p>
                      </div>

                      <template slot="popover" class="tooltip-detail">
                        <div class="tooltip-limited-content">
                          <p v-if="item.method == 'RANDOM'">
                            <span class="nowrap">
                              Câu hỏi ngẫu nhiên
                              <p class="body-3 text-gray-3">
                                ({{item.random && item.random.random}}/{{item.random && item.random.question}} từ ngân hàng cậu hỏi
                                {{item.random && item.random.question_bank_name}})
                              </p>
                            </span>
                          </p>

                          <p
                            v-else-if="item.method == 'MANUAL'"
                            class="dont-break-out"
                            v-html="get(item, 'manual.content', '')"
                          ></p>
                          <div v-else-if="item.method == 'UPLOAD'">
                            <p
                              class="dont-break-out"
                              v-html="item.manual && item.manual.content && item.manual.content.replace('{}', index + 1) || '-'"
                            ></p>
                          </div>
                          <p v-else class="dont-break-out" v-html="get(item, 'select.content', '')"></p>
                        </div>
                      </template>
                    </v-popover>
                  </div>
                </td>
                <td>
                  <span class="nowrap">{{ item.type | exType2TxtTypeQues }}</span>
                </td>
                <!-- <td v-if="item.method == 'RANDOM'">
                  <span class="nowrap">{{ item.random && item.random.level | exType2TxtLevel }}</span>
                </td>
                <td v-else-if="item.method == 'MANUAL'">
                  <span class="nowrap">{{ item.manual && item.manual.level | exType2TxtLevel }}</span>
                </td>
                <td v-else-if="item.method == 'UPLOAD'">
                  <span class="nowrap">{{ item.manual && item.manual.level | exType2TxtLevel }}</span>
                </td>
                <td v-else>
                  <span class="nowrap">{{ item.select && item.select.level | exType2TxtLevel }}</span>
                </td> -->
                <td>
                  <p class="text-center w-100">{{ item.points }}</p>
                </td>
                <td class="text-right">
                  <dropdown-setting-menu
                    :hide-sort="true"
                    :hide-edit-score="false"
                    @detail="showDetail(item)"
                    @edit="editQuestion(item, index + 1)"
                    @soft="sortQuestion(item)"
                    @delete="deleteQuestion(item)"
                    @submitScore="editExamEssayScore($event, item)"
                  />
                </td>
              </tr>

              <tr
                v-if="get(editingItem, 'id', '') == item.id"
                class="app-table--expanded-content"
                :key="'expand' + index"
              >
                <td class="p-0" :colspan="colCounter">
                  <!-- Questions from bank of questions have the most priority -->
                  <edit-question-from-bank
                    v-if="get(editingItem, 'method', '') == 'RANDOM'"
                    @cancel="cancelEditQuestion"
                    @submit="submit"
                    :editingItem="editingItem"
                  ></edit-question-from-bank>
                  <edit-question-file-type
                    v-else-if="get(editingItem, 'type', '') == 'BY_FILE'"
                    :editingItem="editingItem"
                    @submit="submit"
                  ></edit-question-file-type>
                  <edit-question-writing
                    v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['ESSAY']"
                    @cancel="cancelEditQuestion"
                    @submit="submit"
                    :editingItem="editingItem"
                  ></edit-question-writing>
                  <div v-else>
                    <p class="text-center body-3 text-gray-3 px-4 py-3">Loại câu hỏi không hợp lệ</p>
                  </div>
                </td>
              </tr>
            </template>
          </draggable>
        </app-table>
      </div>
    </div>

    <!-- Modals -->
    <question-detail-modal
      v-if="isShowQuestionDetailModal"
      :content="showingItem"
      :loading.sync="loadingQuestion"
      @close="isShowQuestionDetailModal = false"
    ></question-detail-modal>
    <random-questions-detail-modal
      v-if="isShowRandomQuestionDetailModal"
      :content="showingItem"
      :loading.sync="loadingQuestionRandom"
      @close="isShowRandomQuestionDetailModal = false"
    ></random-questions-detail-modal>

    <app-modal-confirm
      v-if="isShowDelQuestionModal"
      @cancel="isShowDelQuestionModal = false"
      @ok="handleDeleteQuestion"
      description="Bạn có chắc muốn xóa câu hỏi?"
    ></app-modal-confirm>
    <app-modal-confirm
      v-if="isShowUpdateQuestionScoreModal"
      @cancel="isShowUpdateQuestionScoreModal = false"
      @ok="updateExamEssayScore"
      description="Bạn có chắc muốn chỉnh sửa điểm câu hỏi?"
      :confirm-loading="isProcessingUpdateQuestionScore"
    ></app-modal-confirm>
  </div>
</template>

<script>
import IconWarning from "~/assets/svg/v2-icons/error_outline_24px.svg?inline";
import IconPlaylistCheck from "~/assets/svg/v2-icons/playlist_add_check_24px.svg?inline";
import IconStarFilled from "~/assets/svg/v2-icons/star2_24px.svg?inline";
import IconStarBorder from "~/assets/svg/v2-icons/star_border2_24px.svg?inline";
import draggable from "vuedraggable";
import { mapState, mapActions, mapMutations } from "vuex";
import { get, cloneDeep } from "lodash";
import DropdownSettingMenu from "~/components/page/course/create/common/DropdownSettingMenu";
import DropdownEditScoreMenu from "~/components/page/course/create/common/DropdownEditScoreMenu";
import EditQuestionFromBank from "~/components/page/course/create/common/EditQuestionFromBank";
import EditQuestionYesNo from "~/components/page/course/create/common/EditQuestionYesNo";
import EditQuestionSingleChoice from "~/components/page/course/create/common/EditQuestionSingleChoice";
import EditQuestionMultiChoice from "~/components/page/course/create/common/EditQuestionMultiChoice";
import EditQuestionFillBlank from "~/components/page/course/create/common/EditQuestionFillBlank";
import EditQuestionWriting from "~/components/page/course/create/common/EditQuestionWriting";
import EditQuestionWordChoice from "~/components/page/course/create/common/EditQuestionWordChoice";
import EditQuestionMatchWord from "~/components/page/course/create/common/EditQuestionMatchWord";
import EditQuestionFileType from "~/components/page/course/create/common/EditQuestionFileType";
import QuestionDetailModal from "~/components/page/course/create/common/QuestionDetailModal";
import RandomQuestionsDetailModal from "~/components/page/course/create/common/RandomQuestionsDetailModal";
import * as actionTypes from "~/utils/action-types";
import {
  EXAM_TYPE_QUESTION,
  EXAM_TYPES,
  PAGE_SIZE,
  QUESTION_CREATATION_METHODS,
} from "~/utils/constants";
import { getParamQuery, converNumberDecs2 } from "~/utils/common";

const EXAM_STORE = `elearning/manager/bank/exam`;
const QUESTION_STORE = `elearning/manager/bank/question/questions`;
const QUESTION_CREATING_STORE = "elearning/creating/creating-question"; // to CRUD exercises into bank
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
    draggable,
    DropdownSettingMenu,
    DropdownEditScoreMenu,
    EditQuestionFromBank,
    EditQuestionYesNo,
    EditQuestionSingleChoice,
    EditQuestionMultiChoice,
    EditQuestionFillBlank,
    EditQuestionWriting,
    EditQuestionWordChoice,
    EditQuestionMatchWord,
    QuestionDetailModal,
    EditQuestionFileType,
    RandomQuestionsDetailModal,
  },
  props: {
    dataPayload: {
      type: Object,
      default: () => {},
    },
    filterBankExamChoiceList: {
      type: Array,
      default: () => [],
    },
    filterBankExamEssayList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      listChoice: [],
      listEssay: [],
      editingItem: {},
      editingItemEssayScore: {},
      isShowQuestionDetailModal: false,
      isShowDelQuestionModal: false,
      showingItem: {},
      EXAM_TYPE_QUESTION: Object.freeze(EXAM_TYPE_QUESTION),
      EXAM_TYPES: Object.freeze(EXAM_TYPES),
      heads: [
        {
          name: "order",
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
        // {
        //   name: "level",
        //   text: "Cấp độ",
        // },
        {
          name: "score",
          text: "Điểm",
          classTextCenter: true,
        },
        {
          name: "action",
          text: "",
          textRight: true,
        },
      ],
      // list: cloneDeep(this.filterBankExamChoice),
      listNew: cloneDeep(this.filterBankExamChoiceList),
      listEssayNew: cloneDeep(this.filterBankExamEssayList),
      dataQuestion: {},
      loadingQuestion: false,
      loadingQuestionRandom: false,
      isShowRandomQuestionDetailModal: false,
      isShowUpdateQuestionScoreModal: false,
      isProcessingUpdateQuestionScore: false,

      tmpScore: "",
      error: {
        score: "",
      },
    };
  },
  computed: {
    ...mapState("elearning/create", {
      exam: "exam",
    }),
    ...mapState(EXAM_STORE, ["bankExamDetailList"]),
    colCounter: function () {
      return this.heads.length;
    },
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
      let lengthDataMap = dataMap.reduce(
        (sum, item) =>
          sum +
          (item.random && item.random.random
            ? (item.random && item.random.random) || 0
            : 1),
        0
      );
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
        item.points_total = points_total;
        item.lengthArr = lengthDataMap;
        item.numberRandom =
          item.random && item.random.random ? item.random.random : 1;
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
      const tmp =
        this.filterPointEssay < 10 && this.filterBankExamChoice.length > 0
          ? 10 - this.filterPointEssay
          : 0;
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
    filterStatus() {
      if (this.dataPayload.type == "MIX") {
        return this.filterPointEssay + this.filterPointChoice == 10;
      } else if (this.dataPayload.type == "ESSAY") {
        return this.filterPointEssay == 10;
      } else if (
        this.dataPayload.type == "CHOICE" &&
        this.filterBankExamChoice.length > 0
      ) {
        return true;
      }
    },
    scoreScale: function () {
      return get(this, "dataPayload.settings.points", 10);
    },
  },
  created() {},
  methods: {
    ...mapActions(QUESTION_STORE, {
      getQuestionDetail: "getQuestionDetail",
    }),
    ...mapActions(EXAM_STORE, ["questionSort", "bankExamDetail"]),
    ...mapMutations(EXAM_STORE, ["stateBankExamDetailList"]),
    ...mapActions(QUESTION_CREATING_STORE, {
      updateQuestionScore:
        actionTypes.ELEARNING_CREATING_QUESTIONS_OF_BANK.UPDATE_SCORE,
    }),
    initData() {
      this.listChoice = get(this, "exam.choiceQuestion", []);
      this.listEssay = get(this, "exam.essayQuestion", []);
    },
    async showDetail(item) {
      if (item.method == "RANDOM") {
        this.isShowRandomQuestionDetailModal = true;
        this.loadingQuestionRandom = true;
        this.showingItem = Object.assign({}, item);
        this.loadingQuestionRandom = false;
      } else {
        try {
          this.loadingQuestion = true;
          this.isShowQuestionDetailModal = true;
          const res = await this.getQuestionDetail(item.id);
          if (get(res, "success", false)) {
            this.showingItem = Object.assign({}, get(res, "data", {}));
          } else {
            this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
          }
        } catch (error) {
          this.$toasted.error("Có lỗi xảy ra");
        } finally {
          this.loadingQuestion = false;
        }
      }
    },
    async editQuestion(item, index) {
      console.log("editQuestion", item);
      // const parentId = get(this, "$route.query.exam_id", "");
      // const url = `/elearning/manager/courses/create/create-question?type=${item.type}&parent_id=${parentId}&question_id=${item.id}`;
      // this.$router.push(url);
      // this.editingItem = Object.assign({}, item);

      if (item.method == "RANDOM") {
        this.editingItem = Object.assign({}, item);
      } else if (item.method == "UPLOAD") {
        if (item.type == "BY_FILE") {
          this.editingItem = cloneDeep(item);
          this.editingItem.manual.content = this.editingItem.manual.content.replace(
            "{}",
            index
          );
        } else {
          this.editingItem = await this.getQuestion(item.id);
          this.editingItem.manual.content = this.editingItem.manual.content.replace(
            "{}",
            index
          );
        }
      } else if (
        item.method == "SELECT" &&
        this.dataPayload.method != "IPTEST"
      ) {
        const url = `/elearning/manager/bank/exams/choose-one-from-bank?category=TEST&type=${item.category}&parent_id=${item.parent_id}&question_id=${item.id}`;
        this.$router.push(url);
      } else {
        this.editingItem = await this.getQuestion(item.id);
      }
    },
    async getQuestion(question_id) {
      const res = await this.$axios({
        url: `/elearning/teaching/manage/question/${question_id}`,
      });
      if (get(res, "data.success", false)) {
        return get(res, "data.data", null);
      }
      return null;
    },
    sortQuestion(item) {
      console.log("sort question", item);
    },
    deleteQuestion(item) {
      this.isShowDelQuestionModal = true;
      this.dataQuestion = item;
    },
    cancelEditQuestion() {
      this.editingItem = {};
    },
    async submit(data) {
      const res = await this.$axios({
        url: `/elearning/teaching/manage/question`,
        method: "PUT",
        data: data,
      });
      if (get(res, "data.success", false)) {
        this.$toasted.success("Thành công");
        this.editingItem = {};
        const data = {
          size: PAGE_SIZE.MAXIMIZE,
          page: 1,
          parent_id: this.$route.params.id,
          parent: "test",
        };
        this.bankExamDetail(data);
        // this.handleRedirectQuestionBanks();
        return;
      }
      this.$toasted.error(get(res, "data.message", "Có lỗi xảy ra"));
    },
    async handleDeleteQuestion() {
      if (this.dataQuestion.method == "RANDOM") {
        try {
          const res = await this.$axios({
            url: `/elearning/teaching/manage/question/random_setting`,
            method: "DELETE",
            data: { ids: [this.dataQuestion.id] },
          });
          const result = res.data;
          if (result.success == true) {
            this.isShowDelQuestionModal = false;
            this.$toasted.success("Thành công");
            const data = {
              size: PAGE_SIZE.MAXIMIZE,
              page: 1,
              parent_id: this.$route.params.id,
              parent: "test",
            };
            this.bankExamDetail(data);
            return;
          } else {
            this.isShowDelQuestionModal = false;
            this.$toasted.error(result.message);
          }
        } catch (error) {
          this.isShowDelQuestionModal = false;
          this.$toasted.error("Có lỗi xảy ra");
        }
      } else {
        try {
          const res = await this.$axios({
            url: `/elearning/teaching/manage/question/${this.dataQuestion.id}`,
            method: "DELETE",
          });
          const result = res.data;
          console.log("result", result);
          if (result.success == true) {
            this.isShowDelQuestionModal = false;
            this.$toasted.success("Thành công");
            const data = {
              size: PAGE_SIZE.MAXIMIZE,
              page: 1,
              parent_id: this.$route.params.id,
              parent: "test",
            };
            this.bankExamDetail(data);
            return;
          } else {
            this.isShowDelQuestionModal = false;
            this.$toasted.error(result.message);
          }
        } catch (error) {
          this.isShowDelQuestionModal = false;
          this.$toasted.error("Có lỗi xảy ra");
        }
      }
    },
    onEnd(event) {
      console.log("[onEnd]", event);
      const targetRow = this.listNew.splice(event.oldIndex, 1)[0];
      this.listNew.splice(event.newIndex, 0, targetRow);
      const dataChangeIndex = this.listNew.map((item, index) => {
        if (item.method == "MANUAL") {
          return {
            id: item.id,
            position: index + 1,
            type: null,
          };
        } else {
          return {
            id: item.id,
            position: index + 1,
            type: "RANDOM",
          };
        }
      });
      console.log("listNew", this.listNew);
      console.log("dataChangeIndex", dataChangeIndex);
      this.$emit("dataChangeIndex", dataChangeIndex);
    },
    onEndEassy(event) {
      console.log("[onEndEassy]", event);
      const targetRow = this.listEssayNew.splice(event.oldIndex, 1)[0];
      this.listEssayNew.splice(event.newIndex, 0, targetRow);
      const dataEssayIndex = this.listEssayNew.map((item, index) => {
        if (item && item.method == "MANUAL") {
          return {
            id: item.id,
            position: index + 1,
            type: null,
          };
        } else {
          return {
            id: item.id,
            position: index + 1,
            type: "RANDOM",
          };
        }
      });
      console.log("listEssayNew", this.listEssayNew);
      this.$emit("dataEssayIndex", dataEssayIndex);
    },
    editExamEssayScore(score, exam) {
      // this.editingItem = Object.assign({}, exam);
      this.editingItemEssayScore = Object.assign({}, exam);
      this.tmpScore = score;
      if (this.validateScore(get(exam, "points", 0), score)) {
        // this.isShowUpdateQuestionScoreModal = true;
        this.updateExamEssayScore();
      } else {
        this.$toasted.error(get(this, "error.score"));
      }
    },
    async updateExamEssayScore() {
      try {
        this.isProcessingUpdateQuestionScore = true;
        const examId = this.$route.params.id;
        let point = 0;
        if (this.isQuestionRandom(this.editingItem)) {
          point = this.divideScore(
            this.tmpScore,
            get(this, "editingItem.random.random", 1)
          );
        } else {
          point = this.tmpScore;
        }
        const payload = {
          test_id: examId,
          question_point: [
            {
              id: get(this, "editingItemEssayScore.id", ""),
              is_update_total_point: false,
              point: this.tmpScore,
              method: get(this, "editingItemEssayScore.method", ""),
            },
          ],
        };
        const result = await this.updateQuestionScore(payload);
        if (get(result, "success", false)) {
          this.isShowUpdateQuestionScoreModal = false;
          this.$toasted.success("Thành công");
          const data = {
            size: PAGE_SIZE.MAXIMIZE,
            page: 1,
            parent_id: this.$route.params.id,
            parent: "test",
          };
          this.bankExamDetail(data);
          this.$store.dispatch(
            `${EXAM_STORE}/${actionTypes.BANK_EXAM.DETAIL_EXAM_EDIT}`,
            this.$route.params.id
          );
          // this.$emit("editScoreSucess", this.editingItem);
        } else {
          this.$toasted.error(get(result, "message", "Có lỗi xảy ra"));
        }
      } catch (error) {
        this.$toasted.error("Có lỗi xảy ra");
      } finally {
        this.isProcessingUpdateQuestionScore = false;
      }
    },
    isQuestionRandom(question) {
      return [QUESTION_CREATATION_METHODS["RANDOM"]].includes(
        get(question, "method", "")
      );
    },
    validateScore(before, after) {
      const settedScore = this.filterPoint - before;
      const afterScore = settedScore + after;
      if (afterScore > this.scoreScale) {
        this.error.score = `Giá trị điểm không hợp lệ. Tổng điểm sau khi update là ${afterScore}/${this.scoreScale} vượt quá giá trị cho phép`;
        return false;
      }
      return true;
    },
    divideScore(total, counter) {
      const divided = (total / counter).toFixed(2);
      return divided;
    },
    get,
    converNumberDecs2,
  },
  created() {
    this.initData();
  },
};
</script>
<style lang="scss" scoped>
</style>