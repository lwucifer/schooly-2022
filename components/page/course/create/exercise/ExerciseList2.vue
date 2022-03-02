<template>
  <div>
    <sub-block-section title="Bài tập">
      <template v-slot:content>
        <div class="dtex-filter-section">
          <p v-if="isEdittingCourse" class="nowrap dtex-filter-item ml-0">Lọc kết quả:</p>
          <SelectLesson v-if="isEdittingCourse" @change="getExerciseList" class="w-100 dtex-filter-item" />
          <!-- <ButtonCreateExercise
            class="pb-0 mr-0 px-0 dtex-filter-item"
            :class="{ 'ml-0': isEdittingLecture }"
            @handleClick="createExercise"
            category="exercise"
          /> -->
        </div>
        <app-table
          :heads="heads"
          :needPagination="false"
          :data.sync="filterexercises"
          :header-ext-cls="{ 'table-header-border-0': true }"
          class="table--no-border-bottom"
        >
          <template v-slot:actions="{row}">
            <a class="text-base" @click="showDetail(row)">
              <IconVisibility class="mr-2" />
              <span v-if="row.questionNum">Xem chi tiết</span>
              <span v-else>Xem bài tập</span>
            </a>
            <a v-if="row.questionNum" class="text-base" @click="editExercise(row)">
              <IconEdit class="mr-2"/>Chỉnh sửa
            </a>
            <a v-else class="text-base" @click="addQuestion(row)">
              <IconAddCircle class="mr-2" />Thêm câu hỏi
            </a>
            <a class="text-base" @click="handleDelExercise(row)">
              <IconTrash class="mr-2" />Xoá
            </a>
          </template>

          <template v-slot:cell(order)="{index}">
            <td>
              <p class="text-center">
                <span class="nowrap">{{ index + 1 }}</span>
              </p>
            </td>
          </template>

          <template v-slot:cell(title)="{row}">
            <td class="dont-break-out">
              <span class>{{ row.name }}</span>
            </td>
          </template>

          <template v-slot:cell(type)="{row}">
            <td class="dont-break-out">
              <span class="nowrap">{{ row.type | exType2Txt }}</span>
            </td>
          </template>

          <template v-slot:cell(status)="{row}">
            <td class="text-center">
              <span :title="row.status ? 'Hoàn thành' : 'Đang soạn'">
                <IconCheck v-if="row.status" />
                <IconEditting v-else />
              </span>
            </td>
          </template>

          <template v-slot:cell(questionNum)="{row}">
            <td class="text-center">
              <span>{{ row.questionNum }}</span>
            </td>
          </template>

          <template v-slot:cell(required)="{row}">
            <td>
              <span class="nowrap">{{ get(row, 'settings.required', false) ? 'Bắt buộc': 'Không bắt buộc'}}</span>
            </td>
          </template>
          <template v-slot:cell(created)="{row}">
            <td>
              <span class="nowrap">{{ row.created | moment("DD-MM-YYYY")}}</span>
            </td>
          </template>
        </app-table>
      </template>
    </sub-block-section>
    <!-- Modal -->
    <detail-modal
      v-if="showDetailModal"
      :data-row="dataRow"
      @close="showDetailModal = false"
      :loading="isLoadingListQuestion"  
    >
    </detail-modal>
    <app-modal-confirm
      v-if="isShowDelExerciseModal"
      @cancel="isShowDelExerciseModal = false"
      @ok="destroyExercise"
      :confirmLoading="deletingExercise"
      description="Bạn có chắc muốn xóa bài tập?"
    >
    </app-modal-confirm>
  </div>
</template>

<script>
import IconVisibility from "~/assets/svg/v2-icons/visibility2_24px.svg?inline";
import IconEdit from "~/assets/svg/v2-icons/edit2.svg?inline";
import IconAddCircle from "~/assets/svg/v2-icons/add_circle_outline2_24px.svg?inline";
import IconTrash from "~/assets/svg/v2-icons/delete_outline2_24px.svg?inline";
import IconCheck from "~/assets/svg/v2-icons/done_all2_24px.svg?inline";
import IconEditting from "~/assets/svg/v2-icons/create2_24px.svg?inline";
import DetailModal from "~/components/page/course/create/exercise/DetailModal";
import ButtonCreateExercise from "~/components/page/course/create/exercise/ButtonCreateExercise";
import { get } from "lodash";
import { getParamQuery } from "~/utils/common";
import SelectLesson from "~/components/page/course/create/exercise/SelectLesson";
import { mapState, mapActions } from "vuex";
import { CATEGORY_TEST, PAGE_SIZE } from "~/utils/constants";
import * as actionTypes from "~/utils/action-types";

const EXERCISE_CREATING_STORE = "elearning/creating/creating-excercises"; // to CRUD exercises into bank
const QUESTION_CREATING_STORE = "elearning/creating/creating-question"; // to CRUD question into bank
const EXERCISES_CREATING_STORE = "elearning/create"; // list exercises of a specified elearning

export default {
  components: {
    IconVisibility,
    IconEdit,
    IconAddCircle,
    IconTrash,
    IconCheck,
    IconEditting,
    DetailModal,
    ButtonCreateExercise,
    SelectLesson,
  },

  props: {},

  computed: {
    ...mapState("elearning/create", {
      general: "general",
      lessons: "lessons"
    }),
    ...mapState(EXERCISES_CREATING_STORE, {
      exercises: 'exercises'
    }),
    
    isEdittingCourse() {
      return get(this, "general.type", "") === "COURSE";
    },
    isEdittingLecture() {
      return get(this, "general.type", "") === "LECTURE";
    },
    filterexercises() {
      const data = get(this, 'exercises.content', [])
      const dataMap = data.map((item) => {
        return {
          ...item,
          questionNum: get(item, 'statistic.questions', 0),
        };
      });
      return dataMap;
    },
  },

  data() {
    return {
      isShowDelExerciseModal: false,
      isLoadingListQuestion: false,
      heads: [
        {
          name: "order",
          text: "STT",
          classTextCenter: true
        },
        {
          name: "title",
          text: "Tiêu đề",
        },
        {
          name: "type",
          text: "Thể loại",
        },
        {
          name: "questionNum",
          text: "Số câu hỏi",
          classTextCenter: true
        },
        {
          name: "required",
          text: "Loại bài tập",
        },
        {
          name: "status",
          text: "Trạng thái",
          classTextCenter: true
        },
        {
          name: "created",
          text: "Ngày tạo",
        },
      ],
      showDetailModal: false,
      deletingExercise: false,
      deletedItem: {},
      dataRow: {}
    };
  },

  methods: {
    ...mapActions(EXERCISE_CREATING_STORE, {
      deleteExercise: actionTypes.ELEARNING_CREATING_EXERCISES.DELETE,
    }),
    ...mapActions(EXERCISES_CREATING_STORE, {
      getExercises: 'getExercises'
    }),
    ...mapActions(QUESTION_CREATING_STORE, {
      getQuestionsFromBank: actionTypes.ELEARNING_CREATING_QUESTIONS_OF_BANK.LIST
    }),
    async showDetail(row) {
      try {
        this.showDetailModal = true;
        this.isLoadingListQuestion = true;
        this.dataRow = Object.assign({}, row);
        const res = await this.getQuestionsFromBank({
          parent_id: row.id,
          parent: 'TEST',
          size: PAGE_SIZE.MAXIMIZE,
          page: 1
        });
        if (!get(res, 'success', true)) {
          this.$toasted.error(get(res, 'message', 'Có lỗi xảy ra')); 
        }
      } catch (error) {
        this.$toasted.error('Có lỗi xảy ra'); 
      } finally {
        this.isLoadingListQuestion = false
      }
      
    },
    editExercise(row) {
      this.$emit('editExercise', row);
    },
    async addQuestion(row) {
      this.$emit('editExercise', row);
    },
    handleDelExercise(row) {
      this.deletedItem = Object.assign({}, row);
      this.isShowDelExerciseModal = true;
    },
    async destroyExercise() {
      try {
        this.deletingExercise = true;
        const res = await this.deleteExercise(this.deletedItem.id);
        if (res.success) {
          this.$toasted.success('Xóa bài tập thành công');
          this.$emit('deleteExerciseDone');
        } else {
          this.$toasted.error(get(res, 'message', 'Có lỗi xảy ra'));
        }
      } catch (error) {
        this.$toasted('Xóa bài tập không thành công');
      } finally {
        this.isShowDelExerciseModal = false;
        this.deletingExercise = false;
      }
    },
    async getExerciseList() {
      await this.getExercises({
        category: CATEGORY_TEST.EXERCISE,
        parent: "ELEARNING",
        parent_id: getParamQuery("elearning_id"),
        lesson_id: get(this, 'lesson.id', null),
        size: PAGE_SIZE.MAXIMIZE,
        show_statistic: true,
      })
    },
    get
  }
};
</script>

<style lang="scss">
.table--no-border-bottom {
  table tr:last-child {
    td {
      border: none;
    }
  }
}
</style>
