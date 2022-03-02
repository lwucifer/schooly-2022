<template>
  <div class="wrapContentTest cotainer">
      <div class="titleNametest">
          <strong>Bài học đại số lớp 10 - Bài tập tự luận</strong>
      </div>
      <div class="row timeTest">
          <div>
              <span>Câu hỏi: </span>
              <span> 5</span>
          </div>
          <div>
              <span> Thời gian làm bài:</span>
              <span>50 phút</span>
          </div>
      </div>
      <div class="contentTest">
          <button class="btndoTest" v-on:click="changeStartQuestion">Bắt đầu làm bài</button>
      </div>
  </div>
</template>

<script>
export default {
    methods:{
        changeStartQuestion(){
            this.$emit('updateStartQuestion',true)
        }
    }
}
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/course/essayquestion/_elearning-course-open-essay-test.scss";
</style>