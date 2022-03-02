<template>
  <div class="question-detail">
    <!--<div class="question" v-html="get(row, 'question_name', '')"></div>-->
    <div class="question--content mb-3" v-html="content"></div>
    <div class="question--options">
      <p style="line-height: 2.4rem;">Đáp án:</p>
      <div class="options__detail row">
        <div
          class="option__item col-md-6"
          v-for="(item, index) in options"
          :key="index"
        >
          <span class="option__key">{{ getObjectKey(index) }}: </span>
          <p class="answer-wrapper" v-html="item.answer"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      content: {
        type: String,
        required: true
      },
      options: {
        type: Array,
        required: true
      }
    },
    methods: {
      getObjectKey(index) {
        const data = ['A', 'B', 'C', 'D', 'E']
        return data[index]
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~/assets/scss/components/elearning/_elearning-choice-question.scss";
</style>