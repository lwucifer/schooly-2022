<template>
  <div class="detail-exercise__question-list">
    <div class="dtex-question-list-title d-flex mb-3">
      <h6>Danh sách câu hỏi</h6>
      <div class="dtex-question-list-right">
        <p class="text-warning" v-if="!get(dataPayload, 'status', true)">
          <IconWarning /> Bạn chưa hoàn thiện nội dung bài tập
        </p>
        <p v-else class="d-flex align-items-center">
          <IconPlaylistCheck class="fill-primary" /> Bài tập hợp lệ
        </p>
        <p class="heading-5">
          <IconStarFilled v-if="get(dataPayload, 'settings.required', false)"/>
          <IconStarBorder v-else />
          <span>{{ get(dataPayload, 'settings.required', false) ? 'Bài tập bắt buộc' : 'Bài tập không bắt buộc' }}</span>
        </p>
      </div>
    </div>

    <div class="dtex-question-list-content">
      <div v-if="get(dataPayload, 'type', '') == EXERCISE_TYPES['CHOICE'] || get(dataPayload, 'type', '') == EXERCISE_TYPES['MIX']">
      <div class="mb-15">
        <p class="text-primary d-flex">
          <span v-if="get(dataPayload, 'type', '') == EXERCISE_TYPES['MIX']">I.</span>&nbsp;Trắc nghiệm
          <span>&nbsp;({{ get(this, 'dataPayload.choice_point', 0) }} điểm)</span>
          <!-- <span class="ml-2">
            <dropdown-edit-score-menu />
          </span> -->
        </p>
      </div>
        <app-table
          :heads="heads"
          :needPagination="false"
          :data="filterBankExamChoice"
          class="mb-4"
          :ext-table-cls="{ 'table--nowrap-header': true }"
          :cols="[8,50,14,12,8,8]"
        >
          <draggable
            tag="tbody"
            @end="onEndSortChoice"
          >
            <template
              v-for="(item, index) in filterBankExamChoice"
            >
              <tr
                :key="index"
                class="text-vertical-top"
              >
                <td>
                  <p class="text-center nowrap w-100">
                    {{ get(item, 'range', 'N/A') }}
                  </p>
                </td>
                <!-- <td v-if="item.method == 'MANUAL'"> -->
                <td>
                  <div class="cell--collapsed cell--collapsed-2">
                    <v-popover
                      class=""
                      trigger="hover"
                      placement="top"
                      popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content"
                      :disabled="isQuestionRandom(item)"
                      :autoHide="false"
                    >
                      <div class="collapsed-content">
                        <p v-html="get(item, 'parsed_content', '')"></p>
                      </div>
                      <template slot="popover" class="tooltip-detail">
                        <div class="tooltip-limited-content">
                          <p class="dont-break-out" v-html="get(item, 'parsed_content', '')"></p>
                        </div>
                      </template>
                    </v-popover>
                  </div>
                </td>

                <td>
                  <span class="nowrap">
                    {{ item.type | exType2TxtTypeQues }}
                  </span>
                </td>
                <!-- <td>
                  <span class="nowrap">
                    {{ item.level  | exType2TxtLevel }}
                  </span>
                </td> -->
                <td>
                  <p class="text-center w-100">
                    {{ getChoicePoint(item) }}
                  </p>
                </td>
                <td class="text-right">
                  <dropdown-setting-menu
                    :hideSort="true"
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
                    v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['BY_FILE']"
                    @cancel="cancelEditQuestion"
                    :editingItem="editingItem"
                    @submit="submit"
                  ></edit-question-file-type>
                  <edit-question-yes-no
                    v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['YES_NO']" @cancel="cancelEditQuestion"
                    :editingItem="editingItem"
                    @submit="submit"
                  ></edit-question-yes-no>
                  <edit-question-single-choice
                    v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['SINGLE_CHOICE']" @cancel="cancelEditQuestion"
                    :editingItem="editingItem"
                    @submit="submit"
                  ></edit-question-single-choice>
                  <edit-question-multi-choice
                    v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['MULTIPLE_CHOICE']" @cancel="cancelEditQuestion"
                    :editingItem="editingItem"
                    @submit="submit"
                  ></edit-question-multi-choice>
                  <edit-question-fill-blank
                    v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['FILL_IN_BLANK']" @cancel="cancelEditQuestion"
                    :editingItem="editingItem"
                    @submit="submit"
                  ></edit-question-fill-blank>
                  <edit-question-writing
                    v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['ESSAY']" @cancel="cancelEditQuestion"
                    :editingItem="editingItem"
                    @submit="submit"
                  ></edit-question-writing>
                  <edit-question-word-choice
                    v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['WORD_CHOICE']" @cancel="cancelEditQuestion"
                    :editingItem="editingItem"
                    @submit="submit"
                  ></edit-question-word-choice>
                  <edit-question-match-word
                    v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['WORD_MATCH']" @cancel="cancelEditQuestion"
                    :editingItem="editingItem"
                    @submit="submit"
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

      <div v-if="get(dataPayload, 'type', '') == 'ESSAY' || get(dataPayload, 'type', '') == EXERCISE_TYPES['MIX']">
        <div class="mb-15">
          <p class="text-primary d-flex">
            <span v-if="get(dataPayload, 'type', '') == EXERCISE_TYPES['MIX']">II.</span>&nbsp;Tự luận
            <span>&nbsp;({{ get(this, 'dataPayload.essay_point', 0) }} điểm)</span>
            <!-- <span class="ml-2">
              <dropdown-edit-score-menu />
            </span> -->
          </p>
        </div>
        <app-table
          :heads="heads"
          :needPagination="false"
          :data="filterBankExamEssay"
          class="mb-4"
          :ext-table-cls="{ 'table--nowrap-header': true }"
          :cols="[8,50,14,12,8,8]"
        >
          <draggable @end="onEndSortEssay" tag="tbody">
            <template
              v-for="(item, index) in filterBankExamEssay"
            >
            
              <tr
                :key="index"
                class="text-vertical-top"
              >
                <td>
                  <p class="text-center nowrap w-100">
                    {{ get(item, 'range', 'N/A') }}
                  </p>
                </td>
                <td class="">
                  <div class="">
                    <v-popover
                      class=""
                      trigger="hover"
                      placement="top"
                      popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content"
                      :disabled="isQuestionRandom(item)"
                      :autoHide="false"
                    >
                      <div class="collapsed-content">
                        <p v-html="get(item, 'parsed_content', '')"></p>
                      </div>
                      <template slot="popover" class="tooltip-detail">
                        <div class="tooltip-limited-content">
                          <p class="dont-break-out" v-html="get(item, 'parsed_content', '')"></p>
                        </div>
                      </template>
                    </v-popover>
                  </div>
                </td>
                <td>
                  <span class="nowrap">
                    {{ item.type | exType2TxtTypeQues }}
                  </span>
                </td>
                <!-- <td>
                  <span class="nowrap">
                    {{ item.level | exType2TxtLevel }}
                  </span>
                </td> -->
                <td>
                  <p class="text-center w-100">
                    {{ item.points_total }}
                  </p>
                </td>
                <td class="text-right">
                  <dropdown-setting-menu
                    :hideSort="true"
                    :hide-edit-score="false"
                    @detail="showDetail(item)"
                    @edit="editQuestion(item, index + 1)"
                    @soft="sortQuestion(item)"
                    @delete="deleteQuestion(item)"
                    @submitScore="editExerciseScore($event, item)"
                  />
                </td>
              </tr>

              <tr class="app-table--expanded-content" :key="'expand' + index" v-if="get(editingItem, 'id', '') == item.id">
                <td class="p-0" :colspan="colCounter">
                  <edit-question-from-bank
                    v-if="get(editingItem, 'method', '') == 'RANDOM'"
                    @cancel="cancelEditQuestion"
                    @submit="submit"
                    :editingItem="editingItem"
                  ></edit-question-from-bank>
                  <edit-question-file-type
                    v-else-if="get(editingItem, 'type', '') == 'BY_FILE'"
                    @cancel="cancelEditQuestion"
                    :editingItem="editingItem"
                    @submit="submit"
                  ></edit-question-file-type>
                  <edit-question-writing
                    v-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['ESSAY']"
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

      <!-- <p
        v-if="get(dataPayload, 'required', false)"
        class="mb-1"
      >
        <span class="heading-5 text-dark">Tổng điểm: </span>
        <span class="heading-5 text-primary">{{ filterPoint }}/{{ scoreScale }}</span>
      </p> -->
      <p>
        <span v-if="get(dataPayload, 'required', false)" class="body-3">*Lưu ý: Một bài tập bắt buộc có kèm câu hỏi tự luận được tính là hợp lệ phải có tổng điểm các câu hỏi là 10, trong đó điểm thấp nhất của một câu hỏi là 0,25</span>
        <span v-else class="body-3">*Lưu ý: Một bài tập không bắt buộc không quy định số lượng câu hỏi và điểm từng câu hỏi, bạn có thể tạo tùy ý thích.</span>
      </p>
    </div>

    <!-- Modals -->
    <question-detail-modal
      v-if="isShowQuestionDetailModal"
      :content="showingItem"
      :loading.sync="loadingQuestion"
      @close="isShowQuestionDetailModal = false"
    >
    </question-detail-modal>

    <app-modal-confirm
      v-if="isShowDelQuestionModal"
      @cancel="isShowDelQuestionModal = false"
      @ok="destroyQuestion"
      description="Bạn có chắc muốn xóa câu hỏi?"
      :confirm-loading="isProcessingDestroyQuestion"
    >
    </app-modal-confirm>

    <app-modal-confirm
      v-if="isShowUpdateQuestionScoreModal"
      @cancel="isShowUpdateQuestionScoreModal = false"
      @ok="updateExerciseScore"
      description="Bạn có chắc muốn chỉnh sửa điểm câu hỏi?"
      :confirm-loading="isProcessingUpdateQuestionScore"
    >
    </app-modal-confirm>

    <random-questions-detail-modal
      v-if="isShowRandomQuestionsModal"
      @close="isShowRandomQuestionsModal = false"
      :loading="loadingQuestion"
      :content="showingItem"
    >

    </random-questions-detail-modal>
  </div>
</template>

<script>
import IconWarning from "~/assets/svg/v2-icons/error_outline_24px.svg?inline";
import IconPlaylistCheck from "~/assets/svg/v2-icons/playlist_add_check_24px.svg?inline";
import IconStarFilled from "~/assets/svg/v2-icons/star2_24px.svg?inline";
import IconStarBorder from "~/assets/svg/v2-icons/star_border2_24px.svg?inline";
import draggable from 'vuedraggable'
import { mapState, mapActions, mapGetters } from 'vuex';
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
import {
  EXAM_TYPE_QUESTION,
  EXERCISE_TYPES,
  PAGE_SIZE,
  QUESTION_CREATATION_METHODS,
  SUBMISSION_METHODS
} from "~/utils/constants";
import * as actionTypes from "~/utils/action-types";
import { getParamQuery } from '~/utils/common';

const EXAM_STORE = `elearning/manager/bank/exam`;
const QUESTION_STORE = `elearning/manager/bank/question/questions`;
const QUESTION_CREATING_STORE = "elearning/creating/creating-question"; // to CRUD exercises into bank
const EXERCISE_CREATING_STORE = "elearning/creating/creating-excercises"; // to CRUD exercises into bank

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
    EditQuestionFileType,
    QuestionDetailModal,
    RandomQuestionsDetailModal
  },
  props: {
    dataPayload: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      listChoice: [],
      listEssay: [],
      editingItem: { },
      updatingScoreItem: {},
      isShowQuestionDetailModal: false,
      isShowDelQuestionModal: false,
      isShowUpdateQuestionScoreModal: false,
      isShowRandomQuestionsModal: false,

      isProcessingDestroyQuestion: false,
      isProcessingUpdateQuestionScore: false,

      tmpScore: '',
      showingItem: { },
      EXAM_TYPE_QUESTION: Object.freeze(EXAM_TYPE_QUESTION),
      EXERCISE_TYPES: Object.freeze(EXERCISE_TYPES),
      QUESTION_CREATATION_METHODS: Object.freeze(QUESTION_CREATATION_METHODS),
      EXAM_TYPE_QUESTION: Object.freeze(EXAM_TYPE_QUESTION),
      SUBMISSION_METHODS: Object.freeze(SUBMISSION_METHODS),
      heads: [
        {
          name: "order",
          text: "STT",
          classTextCenter: true
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
          classTextCenter: true
        },
        {
          name: "action",
          text: "",
          textRight: true
        },
      ],
      loadingQuestion: false,
      sortedChoices: [],
      sortedEssay: [],
      dataQuestion: {},
      error: {
        score: ''
      }
    };
  },
  computed: {
    ...mapGetters(QUESTION_CREATING_STORE, {
			filterBankExamChoice: 'choiceQuestionsOfBank',
			filterBankExamEssay: 'essayQuestionsOfBank',
			filterPointChoice: 'choiceQuestionsPointTotal',
			filterPointEssay: 'essayQuestionsPointTotal',
      filterPoint: 'allPointTotal',
      pointOfEachChoiceQuestion: 'pointOfEachChoiceQuestion'
    }),
    colCounter: function() {
      return this.heads.length;
    },
    scoreScale: function() {
      return get(this, 'dataPayload.settings.points', 10);
    },
  },
  methods: {
    ...mapActions(QUESTION_STORE, {
      getQuestionDetail: 'getQuestionDetail'
    }),
    ...mapActions(EXAM_STORE, ["bankExamDetail"]),
    ...mapActions(QUESTION_CREATING_STORE, {
      updateQuestionScore: actionTypes.ELEARNING_CREATING_QUESTIONS_OF_BANK.UPDATE_SCORE
    }),
    initData() {
      this.listChoice = get(this, 'exercise.choiceQuestion', []);
      this.listEssay = get(this, 'exercise.essayQuestion', []);
      this.sortedChoices = cloneDeep(this.filterBankExamChoice);
      this.sortedEssay = cloneDeep(this.filterBankExamEssay);
    },
    async showDetail(item) {
      try {
        this.loadingQuestion = true;
        if (get(item, 'method', '') == 'RANDOM') {
          this.isShowRandomQuestionsModal = true;
          this.showingItem = Object.assign({}, item);
        } else if (get(item, 'method', '') == 'RANDOM') {

        } else {
          this.isShowQuestionDetailModal = true;
          const res = await this.getQuestionDetail(item.id);
          if (get(res, 'success', false)) {
            this.showingItem = Object.assign({}, get(res, 'data', {}));
          } else {
            this.$toasted.error(get(res, 'message', 'Có lỗi xảy ra'));
          }
        }
       
      } catch (error) {
        this.$toasted.error('Có lỗi xảy ra');
      } finally {
        this.loadingQuestion = false;
      }
    },
    showRandomsQuestionDetail() {
      this.isShowRandomQuestionsModal = true;
    },
    async showOriginQuestionDetail() {
      try {
        this.loadingQuestion = true;
        this.isShowQuestionDetailModal = true;
        const res = await this.getQuestionDetail(item.id);
        if (get(res, 'success', false)) {
          this.showingItem = Object.assign({}, get(res, 'data', {}));
        } else {
          this.$toasted.error(get(res, 'message', 'Có lỗi xảy ra'));
        }
      } catch (error) {
        this.$toasted.error('Có lỗi xảy ra');
      } finally {
        this.loadingQuestion = false;
      }
    },

    async editQuestion(item, index) {
      try {
        const res = await this.getQuestionDetail(item.id);
        let questionDetail = get(res, 'data', {});
        if (this.isQuestionRandom(item)) {
          this.editingItem = Object.assign({}, item);
        } else if (item.method == QUESTION_CREATATION_METHODS['UPLOAD']) {
          if (item.type == "BY_FILE") {
            this.editingItem = cloneDeep(item);
            this.editingItem.manual.content = this.editingItem.manual.content.replace(
              "{}",
              index
            );
          } else {
            this.editingItem = questionDetail;
            this.editingItem.manual.content = this.editingItem.manual.content.replace(
              "{}",
              index
            );
          }
        } else if (
          item.method == QUESTION_CREATATION_METHODS["SELECT"] &&
          this.dataPayload.method != "IPTEST"
        ) {
          const url = `/elearning/manager/bank/exams/choose-one-from-bank?category=TEST&type=${item.category}&parent_id=${item.parent_id}&question_id=${item.id}`;
          this.$router.push(url);
        }  else {
          this.editingItem = questionDetail;
        }
      } catch (error) {
        this.$toasted.error('Có lỗi xảy ra');
      }
    },
    sortQuestion(item) {
    },
    deleteQuestion(item) {
      this.dataQuestion = Object.assign({}, item);
      this.isShowDelQuestionModal = true;
    },
    cancelEditQuestion() {
      this.editingItem = {};
    },
    async destroyQuestion() {
      try {
        this.isProcessingDestroyQuestion = true;
        let resData = {};
        if (this.dataQuestion.method == "RANDOM") {
          const res = await this.$axios({
            url: `/elearning/teaching/manage/question/random_setting`,
            method: "DELETE",
            data: { ids: [this.dataQuestion.id] },
          });
          resData = res.data;
        } else {
          const res = await this.$axios({
            url: `/elearning/teaching/manage/question/${this.dataQuestion.id}`,
            method: "DELETE",
          });
          resData = res.data;
        }
        if (resData.success == true) {
          this.isShowDelQuestionModal = false;
          this.$toasted.success("Thành công");
          this.$emit("doneDeleteQuestion");
          // await this.refreshData();
          return;
        } else {
          this.$toasted.error(result.message);
        }
      } catch (error) {
        this.$toasted.error("Có lỗi xảy ra");
      } finally {
        this.isProcessingDestroyQuestion = false;
      }
    },
    onEndSortChoice(event) {
      const targetRow = this.sortedChoices.splice(event.oldIndex, 1)[0];
      this.sortedChoices.splice(event.newIndex, 0, targetRow);
      const dataChangeIndex = this.sortedChoices.map((item, index) => {
        return {
          id: item.id,
          position: index + 1,
          type: null,
        };
      });
      this.$emit("sortChoice", dataChangeIndex);
    },
    onEndSortEssay(event) {
      const targetRow = this.sortedEssay.splice(event.oldIndex, 1)[0];
      this.sortedEssay.splice(event.newIndex, 0, targetRow);
      const dataEssayIndex = this.sortedEssay.map((item, index) => {
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
      this.$emit("sortEssay", dataEssayIndex);
    },
    async submit(data) {
      const res = await this.$axios({
        url: `/elearning/teaching/manage/question`,
        method: "PUT",
        data: data,
      });
      if (get(res, "data.success", false)) {
        this.$toasted.success("Thành công");
        this.$emit("doneUpdateQuestion", this.editingItem);
        this.editingItem = {};
        // await this.refreshData();
        return;
      }
      this.$toasted.error(get(res, "data.message", "Có lỗi xảy ra"));
    },
    async refreshData() {
      const exerciseId = get(this, 'exercise.id', get(this, '$route.query.exercise_id', ''));

      await Promise.all([
        // Get detail of current exercise
        this.$store.dispatch('elearning/manager/bank/exam/bankExamDetailEdit', exerciseId),
        // Get list questions of exercise
        this.$store.dispatch(
          `elearning/manager/bank/exam/bankExamDetail`, {
            parent_id: exerciseId,
            parent: "TEST",
            size: PAGE_SIZE.MAXIMIZE,
            page: 1
          }
        ),
      ]);
    },
    editExerciseScore(score, exercise) {
      this.updatingScoreItem = Object.assign({}, exercise);
      this.tmpScore = score;
      if (this.validateScore(get(exercise, 'points', 0), score)) {
        // this.isShowUpdateQuestionScoreModal = true;
        this.updateExerciseScore();
      } else {
        this.$toasted.error(get(this, 'error.score'));
      }
    },
    async updateExerciseScore() {
      try {
        this.isProcessingUpdateQuestionScore = true;
        const exerciseId = this.$route.params.id;
        let point = 0;
        if (this.isQuestionRandom(this.updatingScoreItem)) {
          point = this.divideScore(this.tmpScore, get(this, 'updatingScoreItem.random.random', 1))
        } else {
          point = this.tmpScore;
        }
        const payload = {
          test_id: exerciseId,
          question_point: [
            {
              id: get(this, 'updatingScoreItem.id', ''),
              is_update_total_point: false,
              point: point,
              method: get(this, 'updatingScoreItem.method', '')
            }
          ]
        };
        const result = await this.updateQuestionScore(payload);
        if (get(result, 'success', false)) {
          this.$toasted.success('Thành công');
          this.$emit("doneUpdateQuestionScore", this.updatingScoreItem);
        } else {
          this.$toasted.error(get(result, 'message', 'Có lỗi xảy ra'));
        }
      } catch (error ) {
        this.$toasted.error('Có lỗi xảy ra');
      } finally {
        this.isProcessingUpdateQuestionScore = false;
      }
    },
    isQuestionFromManual(question) {
			return [
				QUESTION_CREATATION_METHODS['MANUAL'],
				QUESTION_CREATATION_METHODS['UPLOAD'],
				QUESTION_CREATATION_METHODS['IMPORT'],				
			].includes(get(question, 'method', ''));
		},
		isQuestionFromBank(question) {
			return [
				QUESTION_CREATATION_METHODS['SELECT'],
				QUESTION_CREATATION_METHODS['IPTEST'],
			].includes(get(question, 'method', ''));
		},
		isQuestionRandom(question) {
			return [
				QUESTION_CREATATION_METHODS['RANDOM']
			].includes(get(question, 'method', ''));
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
      const divided = (total/counter).toFixed(2);
      return divided;
    },
    getChoicePoint(item) {
      if (this.isQuestionRandom(item)) {
        return this.pointOfEachChoiceQuestion * get(item, 'random.random', 0);
      }
      return this.pointOfEachChoiceQuestion;
    },
    cloneDeep,
    get
  },
  created() {
    this.initData();
  }
}
</script>
<style lang="scss" scoped>

</style>