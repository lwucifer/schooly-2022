<template>
  <div class="detail-exercise__question-list">
    <div class="dtex-question-list-title">
      <h6>Danh sách câu hỏi</h6>
      <div class="dtex-question-list-right">
        <p class="text-warning" v-if="!get(exercise, 'status', true)">
          <IconWarning /> Bạn chưa hoàn thiện nội dung bài tập
        </p>
        <p v-else>
          <IconPlaylistCheck class="fill-primary" /> Bài tập hợp lệ
        </p>
        <p class="heading-5">
            <IconStarFilled v-if="get(exercise, 'required', false)"/>
            <IconStarBorder v-else />
            <span>{{ get(exercise, 'required', false) ? 'Bài tập bắt buộc' : 'Bài tập không bắt buộc' }}</span>
        </p>
      </div>
    </div>

    <div class="dtex-question-list-content mb-5">
      <div v-if="get(exercise, 'type', '') == EXERCISE_TYPES['CHOICE'] || get(exercise, 'type', '') == EXERCISE_TYPES['MIX']">
      <div class="mb-15">
        <p class="text-primary d-flex">
          <span v-if="get(exercise, 'type', '') == EXERCISE_TYPES['MIX']">I.</span>&nbsp;Trắc nghiệm
          <span> (2 điểm)</span>
          <span class="ml-2">
            <dropdown-edit-score-menu />
          </span>
        </p>
      </div>
        <app-table
          :heads="heads"
          :needPagination="false"
          :data="get(exercise, 'choiceQuestion', [])"
          class="mb-4"
          :ext-table-cls="{ 'table--nowrap-header': true }"
        >
          <draggable v-model="listChoice" tag="tbody">
            <template
              v-for="(item, index) in listChoice"
            >
              <tr
                :key="index"
              >
                <td>
                  <p class="text-center">
                    {{ index + 1 }}
                  </p>
                </td>
                <td>
                  <p class="dont-break-out" v-html="item.title"></p>
                  <p class="body-3 text-gray-3">{{ item.description }}</p>
                </td>
                <td>
                  <span class="nowrap">
                    {{ item.type | exType2TxtTypeQues }}
                  </span>
                </td>
                <td>
                  <span class="nowrap">
                    {{ item.level | exType2TxtLevel }}
                  </span>
                </td>
                <td>
                  <p class="text-center">
                    {{ item.score }}
                  </p>
                </td>
                <td>
                  <dropdown-setting-menu
                    @detail="showDetail(item)"
                    @edit="editQuestion(item)"
                    @soft="sortQuestion(item)"
                    @delete="deleteQuestion(item)"
                  />
                </td>
              </tr>

              <tr :key="'expand' + index" v-if="get(editingItem, 'id', '') == item.id">
                <td class="p-0" :colspan="colCounter">
                  <!-- Questions from bank of questions have the most priority -->
                  <edit-question-from-bank v-if="get(editingItem, 'source', '') == 'BANK'" @cancel="cancelEditQuestion"></edit-question-from-bank>
                  <edit-question-yes-no v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['YES_NO']" @cancel="cancelEditQuestion"></edit-question-yes-no>
                  <edit-question-single-choice v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['SINGLE_CHOICE']" @cancel="cancelEditQuestion"></edit-question-single-choice>
                  <edit-question-multi-choice v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['MULTI_CHOICE']" @cancel="cancelEditQuestion"></edit-question-multi-choice>
                  <edit-question-fill-blank v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['FILL_IN_BLANK']" @cancel="cancelEditQuestion"></edit-question-fill-blank>
                  <edit-question-writing v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['ESSAY']" @cancel="cancelEditQuestion"></edit-question-writing>
                  <edit-question-word-choice v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['WORD_CHOICE']" @cancel="cancelEditQuestion"></edit-question-word-choice>
                  <edit-question-match-word v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['WORD_MATCH']" @cancel="cancelEditQuestion"></edit-question-match-word>
                  <div v-else>
                    <p class="text-center body-3 text-gray-3 px-4 py-3">Loại câu hỏi không hợp lệ</p>
                  </div>
                </td>
              </tr>
            </template>
            
          </draggable>
        </app-table>
      </div>

      <div v-if="get(exercise, 'type', '') == 'ESSAY' || get(exercise, 'type', '') == EXERCISE_TYPES['MIX']">
        <div class="mb-15">
          <p class="text-primary d-flex">
            <span v-if="get(exercise, 'type', '') == EXERCISE_TYPES['MIX']">II.</span>&nbsp;Tự luận
            <span> (8 điểm)</span>
            <span class="ml-2">
              <dropdown-edit-score-menu />
            </span>
          </p>
        </div>
        <app-table
          :heads="heads"
          :needPagination="false"
          :data="get(exercise, 'essayQuestion', [])"
          class="mb-4"
          :ext-table-cls="{ 'table--nowrap-header': true }"
        >
          <draggable v-model="listEssay" tag="tbody">
            <template
              v-for="(item, index) in listEssay"
            >
              <tr
                :key="index"
              >
                <td>
                  <p class="text-center">
                    {{ index + 1 }}
                  </p>
                </td>
                <td>
                  <p class="dont-break-out" v-html="item.title"></p>
                  <p class="body-3 text-gray-3">{{ item.description }}</p>
                </td>
                <td>
                  <span class="nowrap">
                    {{ item.type | exType2TxtTypeQues }}
                  </span>
                </td>
                <td>
                  <span class="nowrap">
                    {{ item.level | exType2TxtLevel }}
                  </span>
                </td>
                <td>
                  <p class="text-center">
                    {{ item.score }}
                  </p>
                </td>
                <td>
                  <dropdown-setting-menu
                    @detail="showDetail(item)"
                    @edit="editQuestion(item)"
                    @soft="sortQuestion(item)"
                    @delete="deleteQuestion(item)"
                  />
                </td>
              </tr>

              <tr :key="'expand' + index" v-if="get(editingItem, 'id', '') == item.id">
                <td class="p-0" :colspan="colCounter">
                  <!-- Questions from bank of questions have the most priority -->
                  <edit-question-from-bank v-if="get(editingItem, 'source', '') == 'BANK'" @cancel="cancelEditQuestion"></edit-question-from-bank>
                  <edit-question-yes-no v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['YES_NO']" @cancel="cancelEditQuestion"></edit-question-yes-no>
                  <edit-question-single-choice v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['SINGLE_CHOICE']" @cancel="cancelEditQuestion"></edit-question-single-choice>
                  <edit-question-multi-choice v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['MULTI_CHOICE']" @cancel="cancelEditQuestion"></edit-question-multi-choice>
                  <edit-question-fill-blank v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['FILL_IN_BLANK']" @cancel="cancelEditQuestion"></edit-question-fill-blank>
                  <edit-question-writing v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['ESSAY']" @cancel="cancelEditQuestion"></edit-question-writing>
                  <edit-question-word-choice v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['WORD_CHOICE']" @cancel="cancelEditQuestion"></edit-question-word-choice>
                  <edit-question-match-word v-else-if="get(editingItem, 'type', '') == EXAM_TYPE_QUESTION['WORD_MATCH']" @cancel="cancelEditQuestion"></edit-question-match-word>
                  <div v-else>
                    <p class="text-center body-3 text-gray-3 px-4 py-3">Loại câu hỏi không hợp lệ</p>
                  </div>
                </td>
              </tr>
            </template>
          </draggable>

        </app-table>
      </div>

      <p v-if="get(exercise, 'required', false)" class="mb-1">
        <span class="heading-5 text-dark">Tổng điểm: </span>
        <span class="heading-5 text-primary">8/10</span>
      </p>
      <p>
        <span v-if="get(exercise, 'required', false)" class="body-3">*Lưu ý: Một bài tập bắt buộc có kèm câu hỏi tự luận được tính là hợp lệ phải có tổng điểm các câu hỏi là 10, trong đó điểm thấp nhất của một câu hỏi là 0,25</span>
        <span v-else class="body-3">*Lưu ý: Một bài tập không bắt buộc không quy định số lượng câu hỏi và điểm từng câu hỏi, bạn có thể tạo tùy ý thích.</span>
      </p>
    </div>

    <!-- Action button group -->
    <div class="text-center">
      <app-button class="mr-4 px-5 text-secondary" color="white" @click="cancel">
        Hủy
      </app-button>
      <app-button @click="submit" class="px-4">
        Hoàn thành
      </app-button>
    </div>

    <!-- Modals -->
    <question-detail-modal
      v-if="isShowQuestionDetailModal"
      :content="showingItem"
      @close="isShowQuestionDetailModal = false"
    >
    </question-detail-modal>

    <app-modal-confirm
      v-if="isShowDelQuestionModal"
      @cancel="isShowDelQuestionModal = false"
      @ok="destroyQuestion"
      description="Bạn có chắc muốn xóa câu hỏi?"
    >
    </app-modal-confirm>
  </div>
</template>

<script>
import IconWarning from "~/assets/svg/v2-icons/error_outline_24px.svg?inline";
import IconPlaylistCheck from "~/assets/svg/v2-icons/playlist_add_check_24px.svg?inline";
import IconStarFilled from "~/assets/svg/v2-icons/star2_24px.svg?inline";
import IconStarBorder from "~/assets/svg/v2-icons/star_border2_24px.svg?inline";
import draggable from 'vuedraggable'
import { mapState } from 'vuex';
import { get } from "lodash";
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
import QuestionDetailModal from "~/components/page/course/create/common/QuestionDetailModal";
import { EXAM_TYPE_QUESTION, EXERCISE_TYPES } from "~/utils/constants";

// Mock data
const listChoice = [
  {
    id: 5,
    title: "Nội dung câu hỏi số 1",
    level: "EASY",
    score: 2,
    type: 'YES_NO',
    content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry',
    note: 'Note content',
    answers: [
      {
        content: 'Answer number 1',
        correct: false,
      },
      {
        content: 'Answer number 2',
        correct: true
      }
    ]
  },
  {
    id: 6,
    title:
      "Nội dung câu hỏi số 2 mà có nhiều chữ thì xuống hàng. Nội dung câu hỏi số 2 mà có nhiều chữ thì xuống hàng?",
    level: "MEDIUM",
    score: 2,
    type: 'SINGLE_CHOICE',
    note: 'Note content',
    answers: [
      {
        content: 'Answer number 1',
        correct: false,
      },
      {
        content: 'Answer number 2',
        correct: true
      },
      {
        content: 'Answer number 3',
        correct: false,
      },
    ]
  },
  {
    id: 7,
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
    level: "HARD",
    score: 3,
    questionBank: "Ngân hàng câu hỏi số 1",
    type: 'MULTI_CHOICE',
    note: 'Note content',
    answers: [
      {
        content: 'Answer number 1',
        correct: false,
      },
      {
        content: 'Answer number 2',
        correct: true
      },
      {
        content: 'Answer number 3',
        correct: false
      },
      {
        content: 'Answer number 4',
        correct: false,
      },
    ]
  },
  {
    id: 8,
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ngân hàng câu hỏi số 1",
    level: "HARD",
    score: 1,
    questionBank: "2",
    type: 'FILL_IN_BLANK',
    note: 'Note content',
    answers: ''
  },
  {
    id: 9,
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ngân hàng câu hỏi số 1",
    level: "EASY",
    score: 1,
    questionBank: "2",
    type: 'ESSAY',
    note: 'Note content',
    answers: '',
    submission_methods: {
      doc: true,
      upload: true
    }
  },
  {
    id: 10,
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ngân hàng câu hỏi số 1",
    level: "MEDIUM",
    score: 1,
    questionBank: "2",
    type: 'WORD_CHOICE',
    content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry multiple choice',
    note: 'Note content',
    answers: [
      {
        content: 'Answer number 1',
        correct: false,
      },
      {
        content: 'Answer number 2',
        correct: true
      },
      {
        content: 'Answer number 3',
        correct: false,
      },
    ]
  },
  {
    id: 11,
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ngân hàng câu hỏi số 1",
    level: "MEDIUM",
    score: 1,
    questionBank: "2",
    type: 'WORD_MATCH',
    note: 'Note content',
    content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry multiple choice',
    questions: [
      {
        content: 'Question number 1',
        correct: 'A',
        answer: 'Answer number 1'
      },
      {
        content: 'Question number 2',
        correct: 'C',
        answer: 'Answer number 2'
      },
      {
        content: 'Question number 3',
        correct: 'D',
        answer: 'Answer number 3'
      },
      {
        content: 'Question number 4',
        correct: 'E',
        answer: 'Answer number 4'
      },
      {
        content: 'Question number 5 Question number 5 Question number 5 Question number 5 Question number 5 Question number 5',
        correct: 'B',
        answer: 'Answer number 5'
      },
    ],
    key: '1-B; 2-A; 3-C'
  },
  {
    id: 12,
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ngân hàng câu hỏi số 1",
    level: "MEDIUM",
    score: 1,
    questionBank: "2",
    description: "2/10 câu hỏi thuộc Ngân hàng câu hỏi số 1",
    type: 'YES_NO',
    source: 'BANK'
  },
  {
    id: 13,
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ngân hàng câu hỏi số 1",
    level: "MEDIUM",
    score: 1,
    questionBank: "2",
    type: 'HAVE_MEDIA'
  },
];

const listEssay = [
  {
    id: 1,
    title: "Nội dung câu hỏi số 1",
    type: "ESSAY",
    level: "Dễ",
    score: 2,
  },
  {
    id: 2,
    title:
      "Nội dung câu hỏi số 2 mà có nhiều chữ thì xuống hàng. Nội dung câu hỏi số 2 mà có nhiều chữ thì xuống hàng?",
    type: "ESSAY",
    level: "Dễ",
    score: 2,
  },
  {
    id: 3,
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
    type: "ESSAY",
    level: "Trung bình",
    score: 3,
    questionBank: "Ngân hàng câu hỏi số 1",
  },
  {
    id: 4,
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ngân hàng câu hỏi số 1",
    type: "ESSAY",
    level: "Khó",
    score: 1,
    questionBank: "2",
    description: "2/10 câu hỏi thuộc Ngân hàng câu hỏi số 1",
  },
];

const exercise = {
  title: "Tiêu đề của bài tập số 4",
  type: "MIX",
  questionNum: 0,
  required: true,
  status: 0, // 1 done, 0 not done
  createdAt: "15/11/2019",
  duration: 120, // time to do
  passScore: 5,
  doCounter: 3,
  maxScore: 10,
  choiceQuestion: listChoice,
  essayQuestion: listEssay
};

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
    QuestionDetailModal
  },
  data() {
    return {
      listChoice: [],
      listEssay: [],
      editingItem: { },
      isShowQuestionDetailModal: false,
      isShowDelQuestionModal: false,
      showingItem: { },
      EXAM_TYPE_QUESTION: Object.freeze(EXAM_TYPE_QUESTION),
      EXERCISE_TYPES: Object.freeze(EXERCISE_TYPES),
      heads: [
        {
          name: "order",
          text: "STT",
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
          name: "score",
          text: "Điểm",
          class: { 'text-center': true }
        },
        {
          name: "action",
          text: "",
        },
      ],
      exercise: exercise
    };
  },
  computed: {
    // ...mapState('elearning/create',{
		// 	exercise: 'exercise'
    // }),
    colCounter: function() {
      return this.heads.length;
    }
  },
  methods: {
    initData() {
      this.listChoice = get(this, 'exercise.choiceQuestion', []);
      this.listEssay = get(this, 'exercise.essayQuestion', []);
    },
    showDetail(item) {
      this.showingItem = Object.assign({}, item);
      this.isShowQuestionDetailModal = true;
    },
    editQuestion(item) {
      this.editingItem = Object.assign({}, item);
    },
    sortQuestion(item) {
      console.log('sort question', item);
    },
    deleteQuestion(item) {
      console.log('delete question', item);
      this.isShowDelQuestionModal = true;
    },
    cancelEditQuestion() {
      this.editingItem = {};
    },
    destroyQuestion() {
      console.log('[Handling destroy question]');
    },
    cancel() {
      this.$emit('cancel');
    },
    submit() {
      this.$emit('submitted');
    },
    get
  },
  created() {
    this.initData();
  }
}
</script>
<style lang="scss" scoped>

</style>