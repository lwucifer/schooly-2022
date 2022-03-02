<template>
  <div>
    <div class="template-content">
        <div class="d-flex justify-content-between align-items-center">
          <div class="body-1 text-dark font-weight-medium mb-3">
              Danh sách câu hỏi
          </div>

          <div>
              <a
              class="heading-5 font-weight-normal text-base"
              v-if="checkExamFinish"
              >
              <IconPlaylistAddCheck24px
                  class="mr-2 fill-primary vertical-middle"
              />
              Đề thi hợp lệ
              </a>

              <a class="text-warning fill-warning" v-else>
              <IconAlert class="mr-2 vertical-middle" /> Bạn chưa hoàn thiện
              nội dung đề thi
              </a>
          </div>
        </div>

        <TableEditCombineExam :typeExam="typeExam" :dataDetailExam="filterExamMix" @reload="reload"/>

        <div class="total-point mt-4">
          <p class="text-dark heading-5">
              Tổng điểm:
              <span class="text-primary font-weight-medium"
              >{{filterPoint}}/10</span
              >
          </p>
          <p class="mt-2 text-gray body-3" v-if="isEssayExam">
              *Lưu ý: Một bài tập bắt buộc có kèm câu hỏi tự luận được tính là
              hợp lệ phải có tổng điểm các câu hỏi là 10, trong đó điểm thấp
              nhất của một câu hỏi là 0,25
          </p>
          <p class="mt-2 text-gray body-3" v-else>
              *Lưu ý: Đề thi trắc nghiệm không được chỉnh sửa điểm các câu hỏi
              thành phần.
          </p>
        </div>
    </div>
    <EditBankExam
      @close="isShowPopupUpdateExam = false"
      v-if="isShowPopupUpdateExam"
      :dataEditExam="getObjBankExamEdit"
      @bankExamEditSuccess="bankExamEditSuccess"
    />
  </div>
</template>

<script>
import IconArrowBackIos24px from "~/assets/svg/v2-icons/arrow_back_ios_24px.svg?inline";
import IconEdit from "~/assets/svg/icons/edit.svg?inline";
import IconPlaylistAddCheck24px from "~/assets/svg/v2-icons/playlist_add_check_24px.svg?inline";
import IconPlus from "~/assets/svg/icons/plus3.svg?inline";
import IconAlert from "~/assets/svg/v2-icons/alert/error_outline_24px.svg?inline";
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import TableEditCombineExam from "~/components/page/elearning/exams/create/questions/TableEditCombineExam";
import OptionsAddQuestionExam from "~/components/page/elearning/exams/create/questions/OptionsAddQuestionExam";
import { initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common";
import EditBankExam from "~/components/page/elearning/exams/create/questions/EditBankExam";
import { PAGE_SIZE } from "~/utils/constants";
import { get} from "lodash";

import { mapActions, mapState, mapGetters } from "vuex";
import * as actionTypes from "~/utils/action-types";

export default {
  components: {
    ElearningManagerSide,
    IconArrowBackIos24px,
    IconEdit,
    IconPlaylistAddCheck24px,
    IconPlus,
    IconAlert,
    TableEditCombineExam,
    OptionsAddQuestionExam,
    EditBankExam,
  },

  props: {
      id: {
          type: [String, Number],
          default: ''
      },
      typeExam: {
          type: [String, Number],
          default: ''
      }
  },

  data() {
    return {
      isValidExam: true,
      isEssayExam: true,
      isShowPopupUpdateExam: false,
      loaded: false,
      questions: [],
      getDetailBankExamMix: {}
    };
  },

  computed: {
    filterExamMix() {
      return (
        (this.getDetailBankExamMix && this.getDetailBankExamMix.content) || []
      );
    },

    filterPoint() {
      const data =
        this.getDetailBankExamMix && this.getDetailBankExamMix.content
          ? this.getDetailBankExamMix.content
          : [];

      let tmp = 10;
      if(this.fillterExamChoise.length == 0){
        tmp = data.reduce((sum, item) => sum + (item.points || 0), 0)
      }
      return tmp;
    },

    fillterExamChoise() {
      const tmp =
        (this.filterExamMix &&
          this.filterExamMix.filter(
            (item) => item.category == "CHOICE" || item.category == "MIX"
          )) ||
        [];
      return tmp;
    },

    checkExamFinish() {
      let data =
        this.getDetailBankExamMix && this.getDetailBankExamMix.content
          ? this.getDetailBankExamMix.content.filter((item) => item.category == "ESSAY")
          : [];
      let checkStatus = false
      let tmp = data.reduce((sum, item) => sum + (item.points || 0), 0);
      let sumPointsChoice = 10 - tmp;
      let pointMediumChoice = sumPointsChoice/this.fillterExamChoise.length;

      if (this.typeExam == 'ESSAY' && tmp == 10) {
        return true;
      }

      if(pointMediumChoice%0.25 == 0 && tmp > 0){
        checkStatus = true
      }
      else{
        checkStatus = false
      }
      return checkStatus;
    },
  },

  methods: {
    get,

    reload() {
      this.getQuestions();
    },

    async getQuestions() {
        this.loading = true;

        const res = await this.$axios({
            url: `/elearning/teaching/manage/questions?parent=TEST&parent_id=${this.id}`,
        });
        if (get(res, "data.success", false)) {
            this.getDetailBankExamMix = get(res, "data.data", []);
            this.loaded = true;
        }

        this.loading = false;
    },

    handleAddQuestion(_link) {
      this.$route.push(_link);
    },

    async handleEditExam() {
      this.isShowPopupUpdateExam = !this.isShowPopupUpdateExam;
    },

    bankExamEditSuccess() {},

    handleCancel() {
      this.$router.push(`/elearning/manager/bank/exams`);
    },
  },

  created() {
    if (get(this.$route, 'query.test_id', false)) {
      this.getQuestions()
    }
  },
  
  watch: {
    '$route.query': function() {
      if (get(this.$route, 'query.test_id', false)) {
        this.getQuestions()
      }
    }
  },
};
</script>

<style lang="scss">
@import "~assets/scss/pages/elearning/manager/bank/_template-content-exams.scss";
.exam-create-add-question .v-popover >span {
  display: flex;
  flex-wrap: nowrap;
}
</style>
