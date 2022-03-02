<template>
  <div>
    <sub-block-section title="Bài kiểm tra">
      <template v-slot:content>
        <!-- <div>
          <ButtonCreateExam class="pl-0 pt-0" @handleClick="createExam" />
        </div>-->
        <app-table
          :heads="heads"
          :data.sync="dataTable"
          :needPagination="false"
          :header-ext-cls="{ 'table-header-border-0': true }"
          class="table--no-border-bottom"
          :pagination="filterPagination"
          @pagechange="onPageChange"
        >
          <template v-slot:actions="{row}">
            <a class="text-base" @click="showDetail(row)">
              <IconVisibility class="mr-2" />
              <span>Xem chi tiết</span>
            </a>
            <a v-if="row.questionNum" class="text-base" @click="editExam(row)">
              <IconEdit class="mr-2" />Chỉnh sửa
            </a>
            <a v-else class="text-base" @click="editExam(row)">
              <IconAddCircle class="mr-2" />Thêm câu hỏi
            </a>
            <a class="text-base" @click="deleteExam(row)">
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
              <span class v-html="get(row, 'manual.content', '')"></span>
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

          <template v-slot:cell(typeScore)="{row}">
            <td class="text-center" v-if="type == 'weight'">
              <span>
                <!-- just mock data -->
                {{ row.settings && row.settings.weight}}
                {{ type == 'weight' ? '%': ''}}
              </span>
            </td>
            <td class="text-center" v-else-if="type == 'coefficient'">
              <span>
                <!-- just mock data -->
                {{ row.settings && row.settings.coefficient}}
              </span>
            </td>
          </template>

          <template v-slot:cell(required)="{row}">
            <td>
              <span class="nowrap">{{ row.required ? 'Bắt buộc': 'Không bắt buộc'}}</span>
            </td>
          </template>

          <td class="dont-break-out" slot="cell(created)" slot-scope="{ row }">
            <span class="nowrap">{{ row.created | moment("DD-MM-YYYY") }}</span>
          </td>
        </app-table>
        <p v-if="type == 'weight'" class="mb-4">
          <span class="heading-5 text-dark font-weight-medium">Tổng trọng số:</span>
          <span class="heading-5 text-primary font-weight-medium">{{filterWeight}}%</span>
        </p>
        <p v-if="type == 'weight'">
          <span
            class="body-3"
          >*Lưu ý: Nếu bạn chọn cách tính điểm trung bình theo trọng số, tổng trọng số tất cả các bài kiểm tra phải là 100%. Nếu không đủ 100% thì tất cả các bài kiểm tra này đều bị coi là không hợp lệ.</span>
        </p>
      </template>
    </sub-block-section>
    <!-- Modal -->
    <detail-modal v-if="showDetailModal" @close="showDetailModal = false" :dataRow="dataRow"></detail-modal>
    <app-modal-confirm
      v-if="isShowDelExerciseModal"
      @cancel="isShowDelExerciseModal = false"
      @ok="handleDeleteExam"
      description="Bạn có chắc muốn xóa bài kiểm tra?"
    ></app-modal-confirm>
  </div>
</template>

<script>
import IconVisibility from "~/assets/svg/v2-icons/visibility2_24px.svg?inline";
import IconEdit from "~/assets/svg/v2-icons/edit2.svg?inline";
import IconAddCircle from "~/assets/svg/v2-icons/add_circle_outline2_24px.svg?inline";
import IconTrash from "~/assets/svg/v2-icons/delete_outline2_24px.svg?inline";
import IconCheck from "~/assets/svg/v2-icons/done_all2_24px.svg?inline";
import IconEditting from "~/assets/svg/v2-icons/create2_24px.svg?inline";
import DetailModal from "~/components/page/course/create/exams/DetailModal";
import ButtonCreateExam from "~/components/page/course/create/exams/ButtonCreateExam";
import { get } from "lodash";
import { mapState, mapActions } from "vuex";
import { getParamQuery } from "~/utils/common";
import { CATEGORY_TEST, PAGE_SIZE } from "~/utils/constants";
const STORE_NAME_CREATING_EXCERCISES = "elearning/creating/creating-excercises";
const EXAM_STORE = `elearning/manager/bank/exam`;
export default {
  components: {
    IconVisibility,
    IconEdit,
    IconAddCircle,
    IconTrash,
    IconCheck,
    IconEditting,
    DetailModal,
    ButtonCreateExam,
  },

  props: {
    type: {
      type: String,
      default: "",
    },
    dataTable: {
      type: Array,
      default: () => [],
    },
    filterWeight: {
      type: Number,
      default: 0,
    },
    filterPagination: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    ...mapState("elearning/create", {
      general: "general",
    }),
    ...mapState(STORE_NAME_CREATING_EXCERCISES, ["excercises"]),
    ...mapState(EXAM_STORE, ["getListBankExam"]),
  },

  data() {
    return {
      isShowDelExerciseModal: false,
      heads: [
        {
          name: "order",
          text: "STT",
          classTextCenter: true,
        },
        {
          name: "name",
          text: "Tiêu đề",
        },
        {
          name: "type",
          text: "Thể loại",
        },
        {
          name: "questionNum",
          text: "Số câu hỏi",
          classTextCenter: true,
        },
        {
          name: "typeScore",
          text: this.type == "coefficient" ? "Hệ số" : "Trọng số",
          classTextCenter: true,
        },
        {
          name: "status",
          text: "Trạng thái",
          classTextCenter: true,
        },
        {
          name: "created",
          text: "Ngày tạo",
        },
      ],
      listEssay: [
        {
          id: 1,
          title: "Nội dung câu hỏi số 1",
          type: "ESSAY",
          level: "Dễ",
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
        },
        {
          id: 4,
          title:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ngân hàng câu hỏi số 1",
          type: "ESSAY",
          level: "Khó",
          score: 1,
        },
      ],
      listChoice: [
        {
          id: 5,
          title: "Nội dung câu hỏi số 1",
          level: "EASY",
          score: 2,
          type: "YES_NO",
          content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry",
          note: "Note content",
          answers: [
            {
              content: "Answer number 1",
              correct: false,
            },
            {
              content: "Answer number 2",
              correct: true,
            },
          ],
        },
        {
          id: 6,
          title:
            "Nội dung câu hỏi số 2 mà có nhiều chữ thì xuống hàng. Nội dung câu hỏi số 2 mà có nhiều chữ thì xuống hàng?",
          level: "MEDIUM",
          score: 2,
          type: "SINGLE_CHOICE",
          note: "Note content",
          answers: [
            {
              content: "Answer number 1",
              correct: false,
            },
            {
              content: "Answer number 2",
              correct: true,
            },
            {
              content: "Answer number 3",
              correct: false,
            },
          ],
        },
        {
          id: 7,
          title:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
          level: "HARD",
          score: 3,
          questionBank: "Ngân hàng câu hỏi số 1",
          type: "MULTI_CHOICE",
          note: "Note content",
          answers: [
            {
              content: "Answer number 1",
              correct: false,
            },
            {
              content: "Answer number 2",
              correct: true,
            },
            {
              content: "Answer number 3",
              correct: false,
            },
            {
              content: "Answer number 4",
              correct: false,
            },
          ],
        },
        {
          id: 8,
          title:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ngân hàng câu hỏi số 1",
          level: "HARD",
          score: 1,
          questionBank: "2",
          type: "FILL_IN_BLANK",
          note: "Note content",
          answers: "",
        },
        {
          id: 9,
          title:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ngân hàng câu hỏi số 1",
          level: "EASY",
          score: 1,
          questionBank: "2",
          type: "ESSAY",
          note: "Note content",
          answers: "",
          submission_methods: {
            doc: true,
            upload: true,
          },
        },
        {
          id: 10,
          title:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ngân hàng câu hỏi số 1",
          level: "MEDIUM",
          score: 1,
          questionBank: "2",
          type: "WORD_CHOICE",
          content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry multiple choice",
          note: "Note content",
          answers: [
            {
              content: "Answer number 1",
              correct: false,
            },
            {
              content: "Answer number 2",
              correct: true,
            },
            {
              content: "Answer number 3",
              correct: false,
            },
          ],
        },
        {
          id: 11,
          title:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ngân hàng câu hỏi số 1",
          level: "MEDIUM",
          score: 1,
          questionBank: "2",
          type: "WORD_MATCH",
          note: "Note content",
          content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry multiple choice",
          questions: [
            {
              content: "Question number 1",
              correct: "A",
              answer: "Answer number 1",
            },
            {
              content: "Question number 2",
              correct: "C",
              answer: "Answer number 2",
            },
            {
              content: "Question number 3",
              correct: "D",
              answer: "Answer number 3",
            },
            {
              content: "Question number 4",
              correct: "E",
              answer: "Answer number 4",
            },
            {
              content:
                "Question number 5 Question number 5 Question number 5 Question number 5 Question number 5 Question number 5",
              correct: "B",
              answer: "Answer number 5",
            },
          ],
          key: "1-B; 2-A; 3-C",
        },
        {
          id: 12,
          title:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ngân hàng câu hỏi số 1",
          level: "MEDIUM",
          score: 1,
          questionBank: "2",
          description: "2/10 câu hỏi thuộc Ngân hàng câu hỏi số 1",
          type: "YES_NO",
          source: "BANK",
        },
        {
          id: 13,
          title:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ngân hàng câu hỏi số 1",
          level: "MEDIUM",
          score: 1,
          questionBank: "2",
          type: "HAVE_MEDIA",
        },
      ],
      list: [
        {
          title: "Tiêu đề của bài tập số 1",
          type: "CHOICE",
          questionNum: 5,
          required: true,
          status: 1, // 1 done, 0 not done
          createdAt: "15/11/2019",
          duration: 45, // do duration
          pass_score: 4,
          reworks: 2, // times to do
          // choiceQuestion: this.listChoice
          typeScore: 2,
          coefficient: 2,
          questionNum: 4,
          status: 0,
          open_time: "16:00 - 13/12/2020",
        },
        {
          title: "Tiêu đề của bài tập số 2 mà có nhiều chữ thì xuống hàng",
          type: "ESSAY",
          questionNum: 0,
          required: false,
          status: 0, // 1 done, 0 not done
          createdAt: "15/11/2019",
          duration: 100, // time to do
          pass_score: 8,
          reworks: 3,
          maxScore: 10,
          typeScore: 2,
          coefficient: 1,
          questionNum: 4,
          status: 1,
          open_time: "16:00 - 13/12/2020",
        },
        {
          title: "Tiêu đề của bài tập số 3",
          type: "MIX",
          questionNum: 5,
          required: false,
          status: 1, // 1 done, 0 not done
          createdAt: "15/11/2019",
          duration: 30, // time to do
          pass_score: 7,
          reworks: 5,
          maxScore: 10,
          typeScore: 2,
          coefficient: 1,
          questionNum: 4,
          status: 0,
          close_time: "16:00 - 13/12/2020",
        },
        {
          title: "Tiêu đề của bài tập số 4",
          type: "MIX",
          questionNum: 0,
          required: true,
          status: 0, // 1 done, 0 not done
          createdAt: "15/11/2019",
          duration: 120, // time to do
          pass_score: 5,
          reworks: 3,
          maxScore: 10,
          typeScore: 2,
          weight: 5,
          questionNum: 4,
          status: 1,
          open_time: "16:00 - 13/12/2020",
          close_time: "16:00 - 15/12/2020",
        },
        {
          title: "Tiêu đề của bài tập số  5",
          type: "MIX",
          questionNum: 0,
          required: true,
          status: 0, // 1 done, 0 not done
          createdAt: "15/11/2019",
          duration: 45, // time to do
          pass_score: 4,
          reworks: 2,
          maxScore: 10,
          typeScore: 3,
          weight: 4,
          questionNum: 5,
          status: 0,
        },
      ],
      showDetailModal: false,
      dataRow: {},
      dataDelete: {},
    };
  },

  methods: {
    ...mapActions(EXAM_STORE, [
      "bankExamDetail",
      "bankExamDelete",
      "bankExamlist",
    ]),
    showDetail(_row) {
      this.dataRow = _row;
      const data = {
        page: 1,
        size: PAGE_SIZE.MAXIMIZE,
        parent_id: _row.id,
        parent: "test",
      };
      this.bankExamDetail(data);
      this.showDetailModal = true;
    },
    createExam() {
      console.log("[Create Exam]");
    },
    editExam(row) {
      this.$emit("editExam", row);
    },
    deleteExam(row) {
      this.isShowDelExerciseModal = true;
      this.dataDelete = row;
    },
    handleDeleteExam() {
      this.bankExamDelete(this.dataDelete.id).then((result) => {
        if (result.success) {
          const data = {
            page: 1,
            size: 999,
            category: CATEGORY_TEST.TEST,
            parent: "ELEARNING",
            parent_id: getParamQuery("elearning_id"),
          };
          this.bankExamlist(data);
          this.$toasted.success("success");
          this.isShowDelExerciseModal = false;
        }
      });
    },
    destroyExam() {
      console.log("[Handling Delete Exercise]");
    },
    onPageChange(e) {
      this.$emit("onPageChange", e);
    },
    getParamQuery,
    get,
  },
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
