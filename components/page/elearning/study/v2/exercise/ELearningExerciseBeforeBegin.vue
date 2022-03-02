
<template>
  <div class="elearning-exercise-before-v2">
    <div class="eeb__header">
      <button>
        <IconArrowBackIos24px class="fill-primary" />
      </button>
      <h4 class="ml-3">{{ currentExercise.name }}</h4>
    </div>
    <div class="eeb__content">
      <div class="row">
        <div class="col-md-7 content-wrap">
          <div class="d-flex">
            <div class="mr-3">
              <p v-if="studyCategory == 'EXERCISE'">Bài tập bắt buộc:</p>
              <p class="my-3">Thể loại:</p>
              <p>Số lần làm bài tối đa:</p>
            </div>
            <div>
              <p class="text-primary" v-if="studyCategory == 'EXERCISE'">
                {{ currentExercise.required ? "Có" : "Không" }}
              </p>
              <p class="text-primary my-3">
                {{ currentExercise.type | exType2Txt }}
              </p>
              <p class="text-primary">{{ currentExercise.reworks }}</p>
            </div>
          </div>
          <div class="circle-content">
            <div class="circle-content__item">
              <p>{{ currentExercise.questions }}</p>
              <p>Câu hỏi</p>
            </div>
            <div class="circle-content__bar"></div>
            <div class="circle-content__item">
              <p>{{ currentExercise.duration || "--" }}</p>
              <p>Phút</p>
            </div>
          </div>
          <app-button
            class="btn-start"
            @click.prevent="handleStartDoExercise"
            v-if="isShowBtnStart"
            >Bắt đầu làm bài</app-button
          >
        </div>
        <div class="col-md-5">
          <img src="~/assets/images/elearning/pana.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconArrowBackIos24px from "~/assets/svg/v2-icons/arrow_back_ios_24px.svg?inline";

import { fullDateTimeSlash } from "~/utils/moment";
import { mapState } from "vuex";


export default {
  components: {
    IconArrowBackIos24px
  },

  computed: {
    ...mapState("elearning/study/study-exercise", ["currentExercise"]),
    ...mapState("event", ["studyCategory"]),

    isShowBtnStart() {
      if (!this.currentExercise.open_time) return true;
      const openTime = fullDateTimeSlash(this.currentExercise.open_time);

      return new Date().getTime() >= new Date(openTime).getTime();
    }
  },

  methods: {
    handleStartDoExercise() {
      console.log("[handleStartDoExercise]", this.currentExercise);
      const elearning_id = this.$route.params.id;
      const doExerciseurl = `/elearning/do-test?test_id=${this.currentExercise.id}&submission_type=${this.currentExercise.submission_type}`;
      this.$router.push(doExerciseurl);
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/v2/_elearning-exercise-before.scss";
</style>
