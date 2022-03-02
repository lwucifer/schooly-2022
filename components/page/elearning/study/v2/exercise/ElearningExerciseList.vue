<template>
  <div>
    <ol class="row e-exercise-list">
      <div class="d-flex align-items-center w-100">
        <h4>Danh sách bài làm</h4>
        <div class="text-error ml-auto">Các bài tập có đánh dấu * là các bài tập bắt buộc</div>
      </div>
      <div v-for="(item,key) in elearningExercises" :key="key" class="col-md-12 px-0">
        <ElearningExerciseListItem
          :exercise="item"
        />
      </div>
    </ol>
  </div>
</template>

<script>
import { EXERCISE_STATUS, EXERCISE_TYPES } from "~/utils/constants";
import ElearningExerciseListItem from "~/components/page/elearning/study/v2/exercise/ElearningExerciseListItem";

import { mapState } from "vuex";

export default {
  components: {
    ElearningExerciseListItem
  },
  data(){
    return{
      fakeData:[
        {
          name:"Bài tập 1. Vị trí tương đối của hai đường thẳng",
          type:"CHOICE",
          result:"PASSED",
          required: true
        },
        {
          name:"Bài tập 1. Vị trí tương đối của hai đường thẳng",
          type:"CHOICE",
          result:"FAILED",
          required: false
        },
        {
          name:"Bài tập 1. Vị trí tương đối của hai đường thẳng",
          type:"CHOICE",
          result:"PENDING",
          required: true
        },
        {
          name:"Bài tập 1. Vị trí tương đối của hai đường thẳng",
          type:"CHOICE",
          result:"DO",
          required: false
        }
      ]
    }
  },
  computed: {
    ...mapState("elearning/study/study-exercise", ["elearningExercises"])
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/exercise/_elearning-exercise-list.scss";
</style>
