<template>
  <div class="opt-table-edit-combine">
    <ul>
      <!-- <li @click.prevent="detailQuestion">
        <a href=""
          ><IconVisibility24px class="mr-2 fill-primary" /> Xem chi tiết</a
        >
      </li> -->
      <li @click.prevent="updateQuestion">
        <a href=""><IconCreate24px class="mr-2 fill-info" /> Sửa câu hỏi</a>
      </li>
      <li v-if="active == 3">
        <a href="" @click.prevent="emitEdit">
          <IconFilter9Plus24px class="mr-2 fill-warning vertical-middle" /> Sửa điểm
        </a>
      </li>
      <!-- <li>
        <a href=""><IconMenu24px class="mr-2" /> Sắp xếp thứ tự</a>
      </li> -->
      <li @click.prevent="deleteQuestion">
        <a href=""><IconDelete24px class="mr-2 fill-secondary" /> Xóa</a>
      </li>
    </ul>
  </div>
</template>

<script>
import IconVisibility24px from "~/assets/svg/v2-icons/visibility_24px.svg?inline";
import IconCreate24px from "~/assets/svg/v2-icons/create_24px.svg?inline";
import IconMenu24px from "~/assets/svg/v2-icons/menu_24px.svg?inline";
import IconDelete24px from "~/assets/svg/v2-icons/delete_24px.svg?inline";
import IconFilter9Plus24px from "~/assets/svg/v2-icons/filter_9_plus_24px.svg?inline";
import { questionBankTypeArr } from "~/utils/common";

export default {
  components: {
    IconVisibility24px,
    IconCreate24px,
    IconMenu24px,
    IconDelete24px,
    IconFilter9Plus24px,
  },

  props: {
    active: {
      type: Number,
    },
    dataQuestion: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      examId: this.$route.query ? this.$route.query.id : "",
      category: this.$route.query ? this.$route.query.category : "",
      typeExam: this.$route.query ? this.$route.query.type : "",
    }
  },

  methods: {
    detailQuestion(){
      this.$router.push(
        `/elearning/manager/bank/questions/${this.dataQuestion.id}`
      );
    },

    updateQuestion(){
      console.log('updateQuestion')
      if(this.dataQuestion.method == "RANDOM"){
        this.$emit('updateQuestion', this.dataQuestion);
      }else if(this.dataQuestion.method == "UPLOAD" && this.dataQuestion.type == 'BY_FILE' && this.dataQuestion.category == 'CHOICE'){
        this.$emit('updateQuestionUpload', {
          question_id:this.dataQuestion.id,
          examId: this.examId
        })
      }else if(this.dataQuestion.method == "UPLOAD" && this.dataQuestion.type == 'BY_FILE' && this.dataQuestion.category == 'ESSAY'){
        this.$router.push(
          `/elearning/manager/bank/exams/create?category=${this.category}&type=7&parent_id=${this.examId}&question_id=${this.dataQuestion.id}`
        );
      }else if(this.dataQuestion.method == "SELECT"){
        this.$router.push(
          `/elearning/manager/bank/exams/choose-one-from-bank?category=${this.category}&type=${this.typeExam}&parent_id=${this.examId}&question_id=${this.dataQuestion.id}`
        );
      }else{
        this.$router.push(
          `/elearning/manager/bank/exams/create?category=${this.category}&type=${this.type}&parent_id=${this.examId}&question_id=${this.dataQuestion.id}`
        );
      }
    },

    deleteQuestion(){
      this.$emit('deleteQuestion', this.dataQuestion)
    },

    emitEdit() {
      this.$emit("edit", this.dataQuestion)
    }
  },

  computed: {
    type() {
      const type = this.dataQuestion.type;
      if (type === questionBankTypeArr[0]["id"]) {
        return 1;
      }
      if (type === questionBankTypeArr[1]["id"]) {
        return 2;
      }
      if (type === questionBankTypeArr[2]["id"]) {
        return 3;
      }
      if (type === questionBankTypeArr[3]["id"]) {
        return 5;
      }
      if (type === questionBankTypeArr[4]["id"]) {
        return 6;
      }
      if (type === questionBankTypeArr[5]["id"]) {
        return 4;
      }
      if (type === questionBankTypeArr[6]["id"]) {
        return 7;
      }
      return 1;
    },
  },
};
</script>

<style lang="scss">
@import "~assets/scss/components/elearning/manager/bank/exam/_opt-table-edit-combine.scss";
</style>
