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
          v-model="content"
        />
      </div>
      <div class="buttons">
        <app-button color="white" class="mr-3" @click="$emit('click-close')"
          >Hủy</app-button
        >
        <app-button @click="handleSaveContent">Lưu</app-button>
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
import { useEffect } from "~/utils/common";
import { get } from "lodash";

export default {
  components: {
    IconQuestion1,
    IconQuestion2,
    IconQuestion3,
    IconQuestion4,
    IconQuestion5,
    IconQuestion6,
    IconQuestion7,
  },

  props: {
    visible: Boolean,
    data: {},
    type: {},
    index: {},
    data: {},
  },

  data() {
    return {
      content: "",
    };
  },

  mounted() {
    useEffect(this, this.handleChangeData.bind(this), ["data"]);
  },

  methods: {
    handleSaveContent() {
      this.content = this.content.replace("<p></p>", "");
      this.$emit("handleSaveContent", this.type, this.index, this.content);
    },

    handleChangeData() {
      if (this.type === "question") {
        this.content = get(this, `data.manual.content`, "");
      }
      if (this.type === "answer") {
        this.content = get(this, `data.answers[${this.index}]["content"]`, "");
      }
      if (this.type === "matching") {
        this.content = get(
          this,
          `data.answers[${this.index}]['matching']["content"]`,
          ""
        );
      }
      this.content = this.content.replace("<p></p>", "");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/bank/_questions.scss";
</style>
