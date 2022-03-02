<template>
  <div class="edit-combine-exam">
    <span class="type-exam heading-5 font-weight-normal text-primary">
      I. Trắc nghiệm (10 điểm)
    </span>

    <v-popover
      class="d-inline"
      placement="bottom"
      trigger="hover"
      v-if="isChoiceExam"
    >
      <span class="text-primary" style="cursor: pointer">
        <IconSettings24px class="icon vertical-middle fill-opacity-1" />
        <IconArrowDropDown24px class="icon vertical-middle fill-opacity-1" />
      </span>

      <template slot="popover">
        <a href="" class="body-2">
          <IconFilter9Plus24px class="mr-2 fill-warning vertical-middle" /> Sửa
          điểm
        </a>
      </template>
    </v-popover>

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

        <draggable @end="onEnd" tag="tbody">
          <tr v-for="(item, index) in fillterDataExamChoise" :key="index">
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
                  <span
                    v-if="item.select"
                    v-html="item.select && item.select.content"
                    class="dont-break-out" 
                  ></span>
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
                <div class="table-exam-tooltip-title">
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
                filterPointChoice | divideScore
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
                    @deleteQuestion="deleteQuestion"
                    @updateQuestion="updateQuestion"
                    @updateQuestionUpload="updateQuestionUpload"
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

    <app-modal-confirm
      centered
      v-if="showModalConfirm"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancelDelete"
      title="Bạn có chắc chắn muốn xóa câu hỏi?"
    />

    <ModalChoiceTypeExamUploadEdit
      v-if="isShowModalChoiceType"
      @click-close="isShowModalChoiceType = false"
      @handleAddTypeQuestionExam="handleAddTypeQuestionExam"
    />
  </div>
</template>

<script>
import IconSettings24px from "~/assets/svg/v2-icons/settings_24px.svg?inline";
import IconArrowDropDown24px from "~/assets/svg/v2-icons/arrow_drop_down_24px.svg?inline";
import IconRandom2 from "~/assets/svg/v2-icons/random-2.svg?inline";
import IconFilter9Plus24px from "~/assets/svg/v2-icons/filter_9_plus_24px.svg?inline";
import draggable from "vuedraggable";

import OptTableEdit from "~/components/page/elearning/manager/bank/exams/OptTableEdit";
import ModalChoiceTypeExamUploadEdit from "~/components/page/elearning/manager/bank/exams/ModalChoiceTypeExamUploadEdit";
import TableQuestionRandomUpdate from "~/components/page/elearning/exams/create/questions/TableQuestionRandomUpdate";
import * as actionTypes from "~/utils/action-types";
import { get, cloneDeep } from "lodash";
import { mapState } from "vuex";

export default {
  props: {
    dataDetailExam: {
      type: Array,
      default: [],
    },
  },
  filters: {
    divideScore(val) {
      const divided = val.toFixed(2);
      return divided;
    },
  },
  components: {
    IconSettings24px,
    IconArrowDropDown24px,
    IconFilter9Plus24px,
    OptTableEdit,
    IconRandom2,
    draggable,
    ModalChoiceTypeExamUploadEdit,
    TableQuestionRandomUpdate
  },

  data() {
    return {
      isChoiceExam: true,
      isCombineExam: true,
      showModalConfirm: false,
      confirmLoading: false,
      isShowModalChoiceType: false,
      dataRedirecQuestionUpload: {},
      checkTypeRandom: "",
      isModalBankQuestion: false,
      dataUpdateQuestionRandom: [],
      payloadDeleteQuestions: {
        ids: [],
      },
      listNew: cloneDeep(this.dataDetailExam),
    };
  },
  computed: {
    ...mapState("elearning/manager/bank/exam", ["getObjBankExamEdit"]),

    fillterDataExamChoise() {
      const tmp =
        (this.dataDetailExam &&
          this.dataDetailExam.filter(
            (item) => item.category == "CHOICE" || item.category == "MIX"
          )) ||
        [];
      return tmp;
    },

    filterPointChoice() {
      const data =
        this.fillterDataExamChoise.filter(
          (item) => item.category == "CHOICE"
        ) || [];
      const checkNumberRandom = data.reduce(
        (sum, item) => sum + ((item.random && item.random.random - 1) || 0),
        0
      );
      console.log("checkNumberRandom", checkNumberRandom);
      const tmp = 10 / (data.length + checkNumberRandom);
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
        `elearning/manager/bank/exam/${actionTypes.BANK_EXAM.DETAIL_EXAM_CHOISE}`,
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

    updateQuestionUpload(data) {
      this.isShowModalChoiceType = true;
      this.dataRedirecQuestionUpload = data;
    },

    handleAddTypeQuestionExam(data) {
      console.log("handleAddTypeQuestionExam", data);
      this.$router.push(
        `/elearning/manager/bank/exams/create?type=${data.type}&parent_id=${this.dataRedirecQuestionUpload.examId}&question_id=${this.dataRedirecQuestionUpload.question_id}`
      );
    },
  },
};
</script>

<style lang="scss">
@import "~assets/scss/components/elearning/manager/bank/exam/_table-edit-combine-exam.scss";
</style>
