<template>
  <div>
    <sub-block-section
      class="sub-block-section"
    >
      <template v-slot:title>
        <div class="d-flex align-items-center w-100">
          <button @click="clickBack" class="sub-block-section__back-btn d-flex align-items-center">
            <IconArrowLeft style="height: 1.6rem;"/>
          </button>
          <edit-name-form
            :name="get(exercise, 'name', '')"
            @change="changeName"
          >
          </edit-name-form>
        </div>
      </template>

      <template v-slot:content>
        <div v-if="isLoadingExerciseDetail">
          <div class="row bg-white">
            <div class="col-md-4"><vcl-list /></div>
            <div class="col-md-4"><vcl-list /></div>
            <div class="col-md-4"><vcl-list /></div>
          </div>
        </div>
        <div v-else>
          <!-- Require -->
          <div class="mb-3">
            <h5 class="mb-3">Bài tập bắt buộc?</h5>
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <app-radio-group
                  v-model="payload.required"
                >
                  <app-radio
                    name="required"
                    @change="checkRequired()"
                    value="1"
                    :checked="payload.required == true"
                    class="mr-4"
                    >Có</app-radio
                  >
                  <app-radio
                    name="required"
                    value="0"
                    :checked="payload.required == false"
                    @change="checkRequired()"
                    >Không</app-radio
                  >
                </app-radio-group>
                <app-error :error="''" />
              </div>
              <div>
                <button-create-question
                  @handleClick="handleCreateQuestion"
                  :belong-to.sync="payload.type"
                  :creation-method="payload.method"
                  @select="selectCreateQuesOpt"
                />
              </div>
            </div>
          </div>

          <div v-if="payload.required == 1" class="detail-exercise__doing-info">
            <div class="row align-items-center mb-4" v-if="payload.required">
              <div class="col-12 col-md-3">
                <label for="time" class="heading-5 font-weight-bold text-dark"
                  >Thời gian làm bài</label
                >

                <app-input
                  type="text"
                  @onFocus="(event) => event.target.select()"
                  class="mb-0 ce-input-with-unit mt-3"
                  id="time"
                  size="md"
                  style="width: 12rem;"
                  v-model="payload.duration"
                  @change="checkDuration()"
                >
                  <template v-slot:unit>Phút</template>
                </app-input>
                <app-error :error="get(error, 'duration', '')" />
              </div>

              <div class="col-12 col-md-3">
                <label for="point" class="heading-5 font-weight-bold text-dark">Điểm đạt</label>

                <app-input
                  type="text"
                  @onFocus="(event) => event.target.select()"
                  min="0"
                  @change="checkPassScore()"
                  max="10"
                  class="mb-0 ce-input-with-unit mt-3"
                  id="point"
                  size="md"
                  style="width: 12rem;"
                  v-model="payload.pass_score"
                >
                  <div slot="unit">/{{ get(this, 'payload.points', 10) }}</div>
                </app-input>
                <app-error :error="get(error, 'pass_score', '')" />
              </div>

              <div class="col-12 col-md-3">
                <label for="count" class="heading-5 font-weight-bold text-dark"
                  >Số lần làm bài tối đa</label
                >

                <app-input
                  type="text"
                  class="mb-0 ce-input-with-unit mt-3"
                  @onFocus="(event) => event.target.select()"
                  id="count"
                  size="md"
                  style="width: 12rem;"
                  v-model="payload.reworks"
                  @change="checkReworks()"
                >
                  <div slot="unit">Lần</div>
                </app-input>
                <app-error :error="get(error, 'reworks', '')" />
              </div>
            </div>
          </div>
          <div v-if="hasFile" class="mb-3">
            <div class="d-flex align-items-center">
              <h5 class="nowrap align-self-baseline">File đã tải lên: &nbsp;</h5>
              <div class="align-self-baseline">
                <a
                  class="d-inline-flex align-items-center"
                  v-for="(item, index) in attachments"
                  :key="index"
                  :title="get(item, 'name', '')"
                  :href="get(item, 'url', '')" target="_blank" download>
                  {{ limitLetter(get(item, 'name', ''), 20) }} <IconCheckCircle class="fill-primary ml-2"/> <span v-if="index < attachments.length - 1">,&nbsp;</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- List of question -->
        <hr class="mt-4 mb-2">
        <div v-if="isLoadingQuestionsOfExercise">
          <div class="px-3 py-3 bg-white">
            <vcl-table />
          </div>
        </div>
        <div v-else>
          <question-list
            v-if="get(exercise, 'statistic.questions', 0) > 0"
            :data-payload="exercise"
            @sortChoice="sortChoice"
            @sortEssay="sortEssay"
            @doneUpdateQuestion="handleAfterUpdateQuestion"
            @doneUpdateQuestionScore="handleDoneUpdateExerciseScore"
            @doneDeleteQuestion="handleDoneDeleteQuestion"
          />
          <have-no-question v-else sub-title="Bạn chưa hoàn thành nội dung bài tập" />
        </div>
    
        <div class="">
          <div class="d-flex justify-content-center mt-4 mb-0">
            <app-button
              color="white"
              class="font-weight-semi-bold mr-4 text-secondary bg-white"
              size="md"
              @click="$emit('cancel')"
              style="min-width: 10rem;"
              >Huỷ</app-button
            >
            <app-button
              color="primary"
              class="font-weight-semi-bold"
              size="md"
              @click="handleUpdateExercise"
              style="min-width: 10rem;"
              >Hoàn thành</app-button
            >
          </div>
        </div>
      </template>
    </sub-block-section>
    <app-modal-confirm
      v-if="showUploadModal"
      title="Xác nhận"
      description="Nếu bạn chọn hình thức upload cả đề thi, bạn sẽ phải tạo lại câu hỏi và đáp án từ đầu. Những câu hỏi bạn tạo ra trước đó sẽ bị xóa. Bạn có muốn tiếp tục?"
      @cancel="showUploadModal = false"
      @ok="submitUploadQuestion"
    >
    </app-modal-confirm>
    <app-modal-confirm
      v-if="showImportTestModal"
      title="Xác nhận"
      description="Nếu bạn chọn hình thức thêm câu hỏi từ ngân hàng đề thi, những câu hỏi bạn tạo ra trước đó sẽ bị xóa. Bạn có muốn tiếp tục?"
      @cancel="showImportTestModal = false"
      @ok="submitImportTestQuestion"
    >
    </app-modal-confirm>
    <app-modal-confirm
      title="Bạn muốn cập nhật bài tập?"
      centered
      v-if="showEditModalConfirm"
      :confirmLoading="updatingExercise"
      @ok="submitUpdateExercise"
      @cancel="handleCancelUpdate"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ButtonCreateQuestion from "~/components/page/course/create/common/ButtonCreateQuestion";
import QuestionList from "~/components/page/course/create/exercise/QuestionList"
import IconArrowLeft from "~/assets/svg/v2-icons/arrow_back_ios_24px.svg?inline";
import IconEditAlt from "~/assets/svg/v2-icons/edit.svg?inline";
import IconPlus2 from "~/assets/svg/icons/plus2.svg?inline";
import IconCheckCircle from '~/assets/svg/icons/check-circle.svg?inline';
import HaveNoQuestion from "~/components/page/course/create/common/HaveNoQuestion.vue";
import EditNameForm from "~/components/page/course/create/common/EditNameForm";
import { CATEGORY_TEST, PAGE_SIZE } from "~/utils/constants";
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import {
  getParamQuery,
  limitLetter
} from "~/utils/common";
import { VclList, VclTable } from "vue-content-loading";

const EXERCISE_CREATING_STORE = "elearning/creating/creating-excercises"; // to CRUD exercises into bank
const QUESTION_CREATING_STORE = "elearning/creating/creating-question"; // to CRUD question into bank
const EXERCISES_CREATING_STORE = "elearning/create"; // list exercises of a specified elearning

export default {
  components: {
    ButtonCreateQuestion,
    QuestionList,
    IconArrowLeft,
    IconEditAlt,
    IconPlus2,
    IconCheckCircle,
    HaveNoQuestion,
    EditNameForm,
    VclList,
    VclTable
  },

  props: {
    
  },

  computed: {
    ...mapState(EXERCISE_CREATING_STORE, {
      exerciseResDetail: 'exercise',
    }),
    ...mapState(QUESTION_CREATING_STORE, {
      questionList: 'questionsOfBank',
    }),
    exercise() {
      return get(this, 'exerciseResDetail.data', {})
    },
    hasFile() {
      return get(this, 'exercise.upload.length', 0) > 0;
    },
    attachments() {
      if (this.hasFile) {
        return get(this, 'exercise.upload', [])
      }
      return [];
    }
  },

  data() {
    return {
      showEditModalConfirm: false,
      updatingExercise: false,
      payload: {
        id: '',
        required: false,
        duration: '',
        reworks: 0,
        pass_score: 0,
        points: 10,
        reworks: 0,
        title: '',
        type: '',
        subject_id: '',
        grade_id: ''
      },
      error: {
        title: "",
        required: "",
        type: "",
        duration: "",
        pass_score: "",
        reworks: "",
      },
      showDetailModal: false,
      showUploadModal: false,
      showImportTestModal: false,
      sortedChoices: [],
      sortedEssay: [],
      isLoadingExerciseDetail: false,
      isLoadingQuestionsOfExercise: false,
    };
  },

  methods: {
    ...mapActions(EXERCISE_CREATING_STORE, {
      getExerciseDetail: actionTypes.ELEARNING_CREATING_EXERCISES.DETAIL,
      updateExercise: actionTypes.ELEARNING_CREATING_EXERCISES.UPDATE 
    }),
    ...mapActions(QUESTION_CREATING_STORE, {
      getQuestionsFromBank: actionTypes.ELEARNING_CREATING_QUESTIONS_OF_BANK.LIST,
      sortQuestions: actionTypes.ELEARNING_CREATING_QUESTIONS_OF_BANK.SORT
    }),
    ...mapActions(EXERCISES_CREATING_STORE, {
      getExerciseList: 'getExercises'
    }),
    clickBack() {
      this.$emit('goBack')
    },
    async fetchData() {
      await Promise.all([
        // Get detail of current exercise
        this.getExeDetail(),
        // Get list questions of exercise
        this.getQuestionsOfExercise(),
      ]);
    },
    initPayload() {
      this.payload.id = get(this, 'exercise.id', '');
      this.payload.name = get(this, 'exercise.name', '');
      this.payload.required = get(this, 'exercise.settings.required', false);
      this.payload.duration = get(this, 'exercise.settings.duration', '');
      this.payload.pass_score = get(this, 'exercise.settings.passing_score', '');
      this.payload.points = get(this, 'exercise.settings.points', '')
      this.payload.reworks = get(this, 'exercise.settings.works', '');
      this.payload.title = get(this, 'exercise.name', '');
      this.payload.type = get(this, 'exercise.type', '');
      this.payload.subject_id = get(this, 'exercise.subject.id', '');
      this.payload.grade_id = get(this, 'exercise.grade.id', '');
      this.payload.method = get(this, 'exercise.method', '')
    },
    checkReworks() {
      if (this.payload.required === false) {
        this.error.reworks = "";
        return true;
      }
      if (this.payload.reworks === "") {
        this.error.reworks = "Số lần làm bài không được để trống";
        return false;
      }
      this.error.reworks = "";
      return true;
    },
    checkType() {
      if (this.payload.type === "") {
        this.error.type = "Loại bài tập không được để trống";
        return false;
      }
      this.error.type = "";
      return true;
    },
    checkRequired() {
      if (this.payload.required === "") {
        this.error.required = "Bài tập bắt buộc không được để trống";
        return false;
      }
      this.error.required = "";
      return true;
    },
    checkDuration() {
      if (this.payload.required === 0) {
        this.error.duration = "";
        return true;
      }
      if (this.payload.duration === "") {
        this.error.duration = "Thời gian làm bài không được để trống";
        return false;
      }
      if (this.payload.duration < 0) {
        this.error.duration = "Thời gian làm bài không được nhỏ hơn 0";
        return false;
      }
      this.error.duration = "";
      return true;
    },
    checkPassScore() {
      if (this.payload.required === 0) {
        this.error.pass_score = "";
        return true;
      }
      if (this.payload.pass_score === "") {
        this.error.pass_score = "Điểm đạt không được để trống";
        return false;
      }
      if(this.payload.pass_score < 0 || this.pass_score > 10) {
        this.error.pass_score = "Điểm đạt nằm trong khoảng 0 đến 10";
        return false
      }
      this.error.pass_score = "";
      return true;
    },
    handleCreateQuestion() {
      console.log('[Create Question]');
    },
    selectCreateQuesOpt(item) {
      const elearningId = get(this, "$route.query.elearning_id", "");
      const goBackUrl = `/elearning/manager/courses/create?elearning_id=${elearningId}&active_section=exercise&active_content=edit-form&exercise_id=${get(this, 'exercise.id', '')}`;

      if (item == "FROM_QUESTION_BANK") {
        this.$router.push(
          `/elearning/manager/bank/exams/choose-from-bank?category=TEST&type=${get(this, 'exercise.type', '')}&parent_id=${get(this, 'exercise.id', '')}&elearning_id=${elearningId}&item_type=exercise&item_name=${get(this, 'exercise.name', '')}`
        );
      } else if (item == "FROM_TEST_BANK") {
        this.showImportTestModal = true;
      } else if (item == "UPLOAD") {
        this.showUploadModal = true;
      } else {
        this.$router.push(`/elearning/manager/courses/create/create-question?type=${item}&parent_id=${get(this, 'exercise.id', '')}&elearning_id=${elearningId}&back=${goBackUrl}`
        );
      }
    },
    handleUpdateExercise() {
      this.showEditModalConfirm = true;
    },
    async submitUpdateExercise() {
      try {
        this.updatingExercise = true;
        const body = new FormData();
        body.append("id", get(this, 'payload.id', ''));
        body.append("name", get(this, 'payload.name', ''));
        body.append("category", get(this, 'payload.id', ''));
        body.append("parent", "ELEARNING");
        body.append("type", get(this, 'payload.type', ''));
        body.append("parent_id", getParamQuery("elearning_id"));
        body.append("duration", get(this, 'payload.duration', ''));
        body.append("passing_score", get(this, 'payload.pass_score', ''));
        body.append("works", get(this, 'payload.reworks', ''));
        body.append("subject_id", get(this, 'payload.subject_id', ''));
        body.append("grade_id", get(this, 'payload.grade_id', ''));
        body.append("required", get(this, 'payload.required', false));

        const result = await this.updateExercise(body);
        if (result.success) {
          this.$emit('updateExerciseDone');
          if (this.sortedChoices && this.sortedChoices.length > 0) {
            this.sortQuestions({ positions: this.sortedChoices })
          }

          if (this.sortedEssay && this.sortedEssay.length > 0) {
            this.sortQuestions({ positions: this.sortedEssay });
          }
          await Promise.all([
            this.getExeDetail(),
            this.getQuestionsOfExercise()
          ]);
          
          this.$toasted.success(result.message);
          this.$emit("goBack");
        } else {
          this.$toasted.error(result.message);
        }
      } catch(error) {

      } finally {
        this.showEditModalConfirm = false;
        this.updatingExercise = false;
      }
    },
    handleCancelUpdate() {
      this.showEditModalConfirm = false;
      this.updatingExercise = false;
    },
    changeName(value) {
      this.payload.name = value;
    },
    sortChoice(data) {
      this.sortedChoices = data;
    },
    sortEssay(data) {
      this.sortedEssay = data;
    },
    submitUploadQuestion() {
      this.$router.push(
        `/elearning/manager/bank/exams/upload-exam?category=TEST&type=${get(this, 'exercise.type', '')}&parent_id=${get(this, 'exercise.id', '')}&active_section=exercise&active_content=edit-form&content_title=${get(this, 'exercise.name', '')}`
      );
    },
    submitImportTestQuestion() {
      const elearningId = get(this, "$route.query.elearning_id", "");
      this.$router.push(`/elearning/manager/bank/exams/choose-from-exam?parent_id=${get(this, 'exercise.id', '')}&type=${get(this, 'exercise.type', '')}&elearning_id=${elearningId}&item_type=exercise`);
    },
    async handleAfterUpdateQuestion(item) {
      await this.getQuestionsOfExercise();
    },
    async handleDoneUpdateExerciseScore() {
      try {
        await this.fetchData();
      } catch(error) {
        this.$toasted('Xảy ra lỗi trong quá trình cập nhật dữ liệu');
      }
    },
    async handleDoneDeleteQuestion() {
      try {
        await this.fetchData();
      } catch(error) {
        this.$toasted('Xảy ra lỗi trong quá trình cập nhật dữ liệu');
      }
    },
    async getExeDetail() {
      try {
        this.isLoadingExerciseDetail = true;
        const exerciseId = getParamQuery('exercise_id');
        const res = await this.getExerciseDetail(exerciseId);
        if (!get(res, 'success', false)) {
          this.$toasted.error('Xảy ra lỗi khi lấy dữ liệu bài tập. Vui lòng thử lại');
        }
      } catch (error) {
        this.$toasted.error('Xảy ra lỗi khi lấy dữ liệu bài tập. Vui lòng thử lại');
      } finally {
        this.isLoadingExerciseDetail = false;
      }
    },
    async getQuestionsOfExercise() {
      try {
        this.isLoadingQuestionsOfExercise = true;
        const exerciseId = getParamQuery('exercise_id');
        const res = await this.getQuestionsFromBank({
          parent_id: exerciseId,
          parent: "TEST",
          size: PAGE_SIZE.MAXIMIZE,
          page: 1
        });
      } catch (error) {
        this.$toasted.error('Xảy ra lỗi khi lấy dữ liệu câu hỏi. Vui lòng thử lại');
      } finally {
        this.isLoadingQuestionsOfExercise = false;
      }
    },
    get,
    limitLetter
  },
  async created() {
    await this.fetchData();
    this.initPayload();
  }
};
</script>

<style lang="scss">

</style>
