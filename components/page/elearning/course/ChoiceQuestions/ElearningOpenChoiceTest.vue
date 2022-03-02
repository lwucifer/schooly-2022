<template>
  <div class="wrapContentTest cotainer">
      <div class="titleNametest">
          <strong>Bài học đại số lớp 10 - Bài tập chắc nghiệm</strong>
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
          <button class="btndoTest" v-on:click="changedoQuestion">Bắt đầu làm bài</button>
      </div>
  </div>
</template>

<script>
export default {
    methods:{
        changedoQuestion(){
            this.$emit('btnQuestion',true)
        }
    }

}
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/course/choicequestion/_elearning-course-open.scss";
</style>