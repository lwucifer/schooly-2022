<template>
  <div>
    <sub-block-section title="Tiêu đề bài tập">
      <template v-slot:content>
        <div class="mb-5">
          <h5 class="mb-3">Tải câu hỏi</h5>
          <upload-file-form />
        </div>

        <div v-if="currentContent == 'settup'">
          <settup-uploaded-resource @cancel="cancelSettup" @submitted="settupDone"/> 
        </div>

        <div v-if="currentContent == 'questionList'">
          <uploaded-question-list @cancel="cancelEditQuestion" @submitted="editQuestionDone"/>
        </div>
      </template>
    </sub-block-section>
  </div>
</template>

<script>
import UploadFileForm from "~/components/page/course/create/common/UploadFileForm";
import SettupUploadedResource from "~/components/page/course/create/exercise/SettupUploadedResource";
import UploadedQuestionList from "~/components/page/course/create/exercise/UploadedQuestionList";

export default {
  components: {
    UploadFileForm,
    SettupUploadedResource,
    UploadedQuestionList
  },
  data() {
    return {
      currentContent: 'settup', // settup | questionList
    };
  },
  methods: {
    cancelSettup() {
      console.log('[Cancel Settup]');
    },
    settupDone() {
      console.log('[Settup Done]');
      this.currentContent = 'questionList';
    },
    cancelEditQuestion() {
      console.log('[Cancel Edit Question]');
      this.currentContent = 'settup';
    },
    editQuestionDone() {
    }
  }
}
</script>
<style lang="scss">

</style>