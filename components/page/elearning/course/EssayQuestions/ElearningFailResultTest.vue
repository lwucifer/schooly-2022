<template>
  <div class="wrapResultTest">
      <div class="titleNameTest d-flex justify-content-center">
          <strong>Bài học đại số lớp 10 - Bài tập tự luận</strong>
      </div>
      <div class="resultTestFail">
        <div class="d-flex justify-content-end">
            <span>Kết quả làm bài: </span>
            <span>20/100 (Chưa Đạt)</span>
        </div>
        <div>
            <span>Số lần làm bài lại còn:</span>
            <span>32</span>
        </div>
      </div>
      <div class="detailTimeTest">
          <div class="d-flex flex-column align-items-end">
              <span>Thời gian bắt đầu làm bài</span>
              <span>Tổng thời gian làm bài</span>
              <span>Số câu hỏi</span>
              <span>Số đán án đúng</span>
              <span>Bỏ qua</span>
          </div>
          <div class="d-flex flex-column align-items-start">
              <span>Thứ 4, 18 tháng 10 năm 2019, 11:00 AM</span>
              <span>Thứ 4, 18 tháng 10 năm 2019, 11:00 AM</span>
              <span>10 phút 15 giây</span>
              <span>20</span>
              <span>2</span>
          </div>
      </div>
      <div class="d-flex justify-content-center">
          <button class="btnretest__ElearningCourse" v-on:click="changeStartQuestion">Làm lại bài tập</button>
      </div>
  </div>
</template>

<script>
export default {
    methods:{
        changeStartQuestion(){
            this.$emit('updateStartQuestion',false)
        }
    }
}
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/course/essayquestion/_elearning-course-fail-result.scss";
</style>