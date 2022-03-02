<template>
  <app-modal
    :width="750"
    :component-class="{ 'create-question': true }"
    :footer="false"
    title="Nhập nội dung câu trả lời"
    @close="$emit('click-close')"
  >
    <div slot="content" class="content">
      <div>
        <app-editor
            class="bg-input-gray mb-3"
            :sticky-offset="`{ top: 70, bottom: 0 }`"
          />
      </div>
      <div class="buttons mt-4">
        <app-button color="white" class="mr-3" @click="$emit('click-close')">Hủy</app-button>
        <app-button @click="$emit('click-close')">Lưu</app-button>
      </div>
    </div>
  </app-modal>
</template>

<script>
import IconQuestion1 from "~/assets/svg/images/question1.svg?inline";
import IconQuestion2 from "~/assets/svg/images/question2.svg?inline";
import IconQuestion3 from "~/assets/svg/images/question3.svg?inline";
import IconQuestion4 from "~/assets/svg/images/question4.svg?inline";
import IconQuestion5 from "~/assets/svg/images/question5.svg?inline";
import IconQuestion6 from "~/assets/svg/images/question6.svg?inline";
import IconQuestion7 from "~/assets/svg/images/question7.svg?inline";

export default {
  components: {
    IconQuestion1,
    IconQuestion2,
    IconQuestion3,
    IconQuestion4,
    IconQuestion5,
    IconQuestion6,
    IconQuestion7
  },
  props: {
    visible: Boolean
  },
  computed: {},
  data() {
    return {
      active: 1
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/bank/_questions.scss";
</style>