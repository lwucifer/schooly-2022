<template>
  <app-modal
    :width="750"
    :component-class="{ 'create-question': true }"
    :footer="false"
    :title="title"
    @close="$emit('close')"
  >
    <div slot="content" class="content">
      <div>
        <app-editor
          class="bg-input-gray mb-3"
          :sticky-offset="`{ top: 70, bottom: 0 }`"
          v-model="contentForm"
          @input="changeContent"
        />
      </div>
      <div class="buttons">
        <app-button color="white" class="mr-3" @click="$emit('cancel')"
          >Hủy</app-button
        >
        <app-button @click="saveContent">Lưu</app-button>
      </div>
    </div>
  </app-modal>
</template>

<script>
import { get } from "lodash";

export default {
  components: {
  },

  props: {
    content: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'Nhập nội dung câu trả lời'
    }
  },

  data() {
    return {
      contentForm: ''
    };
  },

  methods: {
    initData() {
      this.contentForm = this.content;
    },
    saveContent() {
      this.contentForm = this.contentForm.replace("<p></p>", "");
      this.$emit('submit', this.contentForm);
    },
    changeContent(val) {
      this.$emit('change', val);
    }
  },
  created() {
    this.initData();
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/bank/_create-question-modal.scss";
</style>
