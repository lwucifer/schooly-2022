<template>
  <div class="edit-combine-exam">
    <p class="mt-4 heading-5 font-weight-normal text-primary">
      Tự luận ({{ getObjBankExamEdit.essay_point }} điểm)
    </p>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th v-if="getObjBankExamEdit.method !== 'UPLOAD'">STT</th>
            <th>Nội dung</th>
            <th>Thể loại</th>
            <!-- <th>Cấp độ</th> -->
            <th>Điểm</th>
            <th></th>
          </tr>
        </thead>

        <draggable tag="tbody">
          <tr v-for="(item, index) in fillterDataExamEssay" :key="index">
            <td v-if="item.random">
              {{ item.index
              }}<span v-if="item.random.random > 1"
                >-{{ item.index + (item.random.random - 1) }}</span
              >
            </td>
            <td
              v-else
              :class="{ 'd-none': getObjBankExamEdit.method == 'UPLOAD' }"
            >
              {{ item.index }}
            </td>

            <td v-if="item.select">
              <v-popover
                trigger="hover"
                popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content"
              >
                <div class="table-exam-tooltip-title">
                  <span class="dont-break-out"  v-html="item.select && item.select.content"></span>
                </div>
                <template slot="popover" class="tooltip-detail">
                  <div
                    class="table-exam-tooltip-content"
                    v-html="item.select && item.select.content"
                  ></div>
                </template>
              </v-popover>
            </td>

            <td v-if="item.manual">
              <v-popover
                trigger="hover"
                popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content"
              >
                <div class="table-exam-tooltip-title dont-break-out">
                  <span
                    v-if="item.manual"
                    class="dont-break-out"
                    v-html="
                      (item.manual &&
                        item.manual.content &&
                        item.manual.content.replace('{}', index + 1)) ||
                        '-'
                    "
                  ></span>
                </div>
                <template slot="popover" class="tooltip-detail">
                  <div
                    class="table-exam-tooltip-content"
                    v-html="
                      (item.manual &&
                        item.manual.content &&
                        item.manual.content.replace('{}', index + 1)) ||
                        '-'
                    "
                  ></div>
                </template>
              </v-popover>
            </td>

            <td v-if="item.random">
              <v-popover
                trigger="hover"
                popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content"
              >
                <div class="table-exam-tooltip-title">
                  <span v-if="item.random">
                    <span>Câu hỏi ngẫu nhiên</span>
                    <p>
                      <IconRandom2 class="icon vertical-middle" />
                      {{ item.random.random }}/{{ item.random.question }} câu
                      hỏi thuộc {{ item.random.question_bank_name }}
                    </p>
                  </span>
                </div>
                <template slot="popover" class="tooltip-detail">
                  <span>
                    <span>Câu hỏi ngẫu nhiên</span>
                    <p>
                      <IconRandom2 class="icon vertical-middle" />
                      {{ item.random.random }}/{{ item.random.question }} câu
                      hỏi thuộc {{ item.random.question_bank_name }}
                    </p>
                  </span>
                </template>
              </v-popover>
            </td>

            <td>{{ item.type | exType2TxtTypeQues }}</td>
            <!-- <td v-if="item.select">
              {{ item.select && item.select.level | exType2TxtLevel }}
            </td>
            <td v-if="item.manual">
              {{ item.manual && item.manual.level | exType2TxtLevel }}
            </td>
            <td v-if="item.random">
              {{ item.random && item.random.level | exType2TxtLevel }}
            </td> -->
            <td>
              {{
                item.points
              }}
            </td>
            <td>
              <v-popover trigger="hover" placement="bottom">
                <span style="cursor: pointer">
                  <IconSettings24px
                    class="icon vertical-middle fill-opacity-1"
                  />
                  <IconArrowDropDown24px
                    class="icon vertical-middle fill-opacity-1"
                  />
                </span>

                <template slot="popover">
                  <OptTableEdit
                    :dataQuestion="item"
                    :active="3"
                    @deleteQuestion="deleteQuestion"
                    @edit="showModal"
                    @updateQuestion="updateQuestion"
                  />
                </template>
              </v-popover>
            </td>
          </tr>
        </draggable>
      </table>
    </div>

    <app-modal
      v-if="isModalBankQuestion"
      :footer="false"
      :header="false"
      width="849px"
      @close="isModalBankQuestion = false"
    >
      <template #content>
        <TableQuestionRandomUpdate
          :dataExamChecked="dataUpdateQuestionRandom"
          @hidenModalBankQuestion="isModalBankQuestion = false"
          @handleAddQuestionToBank="handleAddQuestionToBank"
        />
      </template>
    </app-modal>

    <app-modal v-if="isModal" :footer="false" :header="false" width="385px">
      <template #content>
        <OptSelectPoint
          :setwidth="333"
          :pointItem="pointItem"
          @handleCancel="handleCancel"
          @handleSavePoin="handleSavePoin"
        />
      </template>
    </app-modal>

    <app-modal-confirm
      centered
      v-if="showModalConfirm"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancelDelete"
      title="Bạn có chắc chắn muốn xóa câu hỏi?"
    />
  </div>
</template>

<script>
import IconSettings24px from "~/assets/svg/v2-icons/settings_24px.svg?inline";
import IconArrowDropDown24px from "~/assets/svg/v2-icons/arrow_drop_down_24px.svg?inline";
import IconFilter9Plus24px from "~/assets/svg/v2-icons/filter_9_plus_24px.svg?inline";
import IconRandom2 from "~/assets/svg/v2-icons/random-2.svg?inline";
import draggable from "vuedraggable";
import TableQuestionRandomUpdate from "~/components/page/elearning/manager/bank/exams/TableQuestionRandomUpdate";

import OptTableEdit from "~/components/page/elearning/manager/bank/exams/OptTableEdit";
import OptSelectPoint from "~/components/page/elearning/manager/bank/exams/OptSelectPoint";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { mapState } from "vuex";

export default {
  props: {
    dataDetailExam: {
      type: Array,
      default: [],
    },
  },
  components: {
    IconSettings24px,
    IconArrowDropDown24px,
    IconFilter9Plus24px,
    OptTableEdit,
    OptSelectPoint,
    IconRandom2,
    TableQuestionRandomUpdate,
    draggable,
  },

  data() {
    return {
      isChoiceExam: true,
      isCombineExam: true,
      isModal: false,
      showModalConfirm: false,
      confirmLoading: false,
      isModalBankQuestion: false,
      dataUpdateQuestionRandom: [],
      pointItem: 0,
      questionId: "",
      checkTypeRandom: "",
      payloadDeleteQuestions: {
        ids: [],
      },
    };
  },

  computed: {
    ...mapState("elearning/manager/bank/exam", ["getObjBankExamEdit"]),

    fillterDataExamEssay() {
      const tmp =
        (this.dataDetailExam &&
          this.dataDetailExam.filter(
            (item) => item.category == "ESSAY" || item.category == "MIX"
          )) ||
        [];
      return tmp;
    },
    filterPointEssay() {
      const data =
        this.fillterDataExamEssay.filter((item) => item.category == "ESSAY") ||
        [];

      const tmp = data.reduce((sum, item) => sum + (item.points || 0), 0);
      return tmp;
    },
  },

  methods: {
    get,
    getListQuestionToExam() {
      const queryExamEdit = {
        parent: "test",
        parent_id: this.$route.query ? this.$route.query.id : "",
      };
      this.$store.dispatch(
        `elearning/manager/bank/exam/${actionTypes.BANK_EXAM.DETAIL_EXAM_ESSAY}`,
        queryExamEdit
      );
    },

    async handleOk() {
      this.confirmLoading = true;
      if (this.checkTypeRandom == "RANDOM") {
        this.deleteQuestionRandom();
      } else {
        this.deleteQuestionDefault();
      }
    },

    async deleteQuestionDefault() {
      this.confirmLoading = true;
      try {
        const res = await this.$axios({
          url: `/elearning/teaching/manage/question/${this.payloadDeleteQuestions.ids}`,
          method: "DELETE",
        });
        const result = res.data;
        console.log("result", result);
        this.handleCancelDelete();
        if (result.success == true) {
          this.$toasted.success("Thành công");
          this.getListQuestionToExam();
          return;
        } else {
          this.$toasted.error(result.message);
        }
      } catch (error) {
        this.$toasted.error("Có lỗi xảy ra");
      }
    },

    async deleteQuestionRandom() {
      this.confirmLoading = true;
      try {
        const res = await this.$axios({
          url: `/elearning/teaching/manage/question/random_setting`,
          method: "DELETE",
          data: { ids: this.payloadDeleteQuestions.ids },
        });
        const result = res.data;
        console.log("result", result);
        this.handleCancelDelete();
        if (result.success == true) {
          this.$toasted.success("Thành công");
          this.getListQuestionToExam();
          return;
        } else {
          this.$toasted.error(result.message);
        }
      } catch (error) {
        this.$toasted.error("Có lỗi xảy ra");
      }
    },

    deleteQuestion(data) {
      console.log("deleteQuestion", data);
      this.checkTypeRandom = data.method;
      this.payloadDeleteQuestions.ids = [data.id];
      this.showModalConfirm = true;
    },

    handleCancelDelete() {
      this.showModalConfirm = false;
      this.confirmLoading = false;
      this.payloadDeleteQuestions.ids = [];
    },

    handleCancel() {
      this.isModal = false;
    },

    async handleSavePoin(point) {
      console.log("handleSavePoin", point);
      const queryUpdatePoin = {
        question_point: [
          {
            id: this.questionId,
            method: this.checkTypeRandom,
            is_update_total_point: false,
            point: point,
          },
        ],
        test_id: this.$route.query ? this.$route.query.id : "",
      };
      const res = await this.$axios({
        url: `/elearning/teaching/question/essay/point`,
        method: "POST",
        data: queryUpdatePoin,
      });
      const result = res.data;
      this.isModal = false;
      if (result.success) {
        this.$toasted.success("Thành công");
        this.getListQuestionToExam();
        this.$emit("bankExamEditSuccess");
      } else {
        this.$toasted.error(result.message);
      }
    },

    async handleAddQuestionToBank(val) {
      console.log("handleAddQuestionToBank", val);
      let payload = {
        test_id: val.test_id,
        random_id: val.random_id,
        method: val.method,
        random: {
          question_bank_id: val.random.question_bank_id,
          settings: val.random.settings.filter((i) => i.random > 0),
        },
      };

      console.log("payload", payload);
      const res = await this.$axios({
        url: "/elearning/teaching/manage/question",
        method: "PUT",
        data: payload,
      });
      if (get(res, "data.success", false)) {
        this.isModalBankQuestion = false;
        this.$toasted.success("Thành công");
        this.getListQuestionToExam();
        return;
      }
      this.$toasted.error(get(res, "data.message", "Có lỗi xảy ra"));
    },

    updateQuestion(data) {
      console.log("updateQuestion2", data);
      this.dataUpdateQuestionRandom = [data];
      this.isModalBankQuestion = true;
    },

    showModal(data) {
      this.isModal = true;
      this.checkTypeRandom = data.method;
      this.pointItem = data.points;
      this.questionId = data.id;
    },
  },
};
</script>

<style lang="scss">
@import "~assets/scss/components/elearning/manager/bank/exam/_table-edit-combine-exam.scss";
</style>
