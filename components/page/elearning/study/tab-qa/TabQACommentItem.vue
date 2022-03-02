<template>
  <div class="tab-qa-comment-item" :class="classes">
    <app-avatar
      :size="level === 1 ? 40 : 30"
      :src="get(question, 'creator.avatar.high', '')"
    />

    <div class="tab-qa-comment-item__right">
      <div class="tab-qa-comment-item__top">
        <div class="tab-qa-comment-item__top-left">
          <h6 class="tab-qa-comment-item__name">
            {{ get(question, "creator.name", "") }}
          </h6>
          <!-- <app-stars
            v-if="showStars"
            class="tab-qa-comment-item__rate ml-2"
            :stars="stars"
          /> -->
        </div>

        <span class="tab-qa-comment-item__time">
          <IconAccessTime class="icon mr-2" />{{
            get(question, "timestamp", "") | getDateTimeHH_MM_D_M_Y
          }}
        </span>
      </div>

      <!-- <div class="tab-qa-comment-item__title" v-if="showTitle">{{ title }}</div> -->

      <div class="tab-qa-comment-item__content">
        <div
          v-if="!showInputUpdate"
          v-html="get(question, 'content', '')"
          class="word-break-all"
        ></div>
        <!-- show content update -->
        <div v-else class="tab-qa-comment-editor" style="align-items: center">
          <!-- <app-avatar :size="30" :src="get(user_login, 'avatar.low', '')" /> -->
          <div class="tab-qa-comment-editor__right">
            <div class="tab-qa-comment-editor__editor-wrapper">
              <client-only>
                <editor-content
                  :editor="editor"
                  class="editor tab-qa-comment-editor__editor"
                  v-model="contentEdittor"
                />
              </client-only>

              <app-upload
                :fileList="uploadFileList"
                accept="image/*, image/heic, image/heif"
                class="tab-qa-comment-editor__upload d-inline-block"
                @change="handleUploadChange"
              >
                <button class="tab-qa-comment-editor__btn">
                  <IconCameraAlt class="icon d-block" />
                </button>
              </app-upload>
            </div>

            <!-- End Upload Image -->
          </div>
          <a
            class="action item-save"
            @click.prevent="handleSaveUpdate(level, question)"
          >
            <span>Lưu</span>
          </a>
          <a
            class="action item-cancel"
            @click.prevent="showInputUpdate = false"
          >
            <span>Huỷ</span>
          </a>
        </div>

        <!-- Upload Image -->
        <div
          v-if="uploadImgSrc && showInputUpdate"
          class="tab-qa-comment-editor__preview"
          style="margin-left: 0.8rem"
        >
          <img :src="uploadImgSrc" alt />
          <span
            class="tab-qa-comment-editor__close-preview"
            @click.stop="removeImgUpload"
          >
            <IconClose class="icon" />
          </span>
        </div>
        <img
          v-if="get(question, 'image_url', '') && !showInputUpdate"
          class="tab-qa-comment-item__img d-block"
          :src="get(question, 'image_url', '')"
          alt=""
        />
      </div>
      <div class="tab-qa-comment-item__actions">
        <button
          class="tab-qa-comment-item__like"
          :class="{ active: get(question, 'liked', false) }"
          @click="handleLike"
        >
          <IconThumbUp class="icon" style="vertical-align: inherit"/>
          <span>{{ numeral(get(question, "likes", 0)).format() }}</span>
        </button>
        <button
          v-if="level == 1"
          class="tab-qa-comment-item__reply"
          @click="handleFeedBack"
        >
          Phản hồi
        </button>
        <a
          v-if="idToken.id == question.creator.id"
          class="action item-edit"
          @click.prevent="handleUpdate"
        >
          <IconEdit class="icon fill-primary" />
          <span>Chỉnh sửa</span>
        </a>
        <a
          v-if="idToken.id == question.creator.id"
          class="action item-delete"
          @click.prevent="modalConfirmSubmit = true"
        >
          <IconTrashAlt class="icon fill-secondary" />
          <span>Xóa</span>
        </a>
      </div>
      <app-modal-confirm
        v-if="modalConfirmSubmit"
        title="Bạn chắc chắn muốn xoá bình luận"
        description="Bạn chắc chắn muốn xoá bình luận?"
        @cancel="modalConfirmSubmit = false"
        @ok="confirmModal(level, question.id)"
        @close="modalConfirmSubmit = false"
      ></app-modal-confirm>

      <slot v-bind="{ showReply }" />
    </div>
  </div>
</template>

<script>
import IconThumbUp from "~/assets/svg/v2-icons/thumb_up_24px.svg?inline";
import IconAccessTime from "~/assets/svg/v2-icons/access_time_24px.svg?inline";
import InteractiveQuestionService from "~/services/elearning/study/InteractiveQuestion";
import QuestionLikeService from "~/services/elearning/study/QuestionLike";
import InteractiveAnswer from "~/services/elearning/study/InteractiveAnswer";
import { get } from "lodash";
import numeral from "numeral";
import IconEdit from "~/assets/svg/v2-icons/border_color_24px.svg?inline";
import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline";
import IconCameraAlt from "~/assets/svg/v2-icons/camera_alt_24px.svg?inline";
import { Editor, EditorContent } from "tiptap";
import { Placeholder, HardBreak, Mention, History } from "tiptap-extensions";
import { EnterHandler } from "~/utils/tiptap-plugins";
const IconClose = () => import("~/assets/svg/icons/close.svg?inline");
import { getBase64 } from "~/utils/common";
import { mapState } from "vuex";

export default {
  components: {
    IconThumbUp,
    IconAccessTime,
    IconEdit,
    IconTrashAlt,
    IconCameraAlt,
    Editor,
    EditorContent,
    IconClose,
  },

  data() {
    return {
      idToken: "",
      showReply: false,
      submit: true,
      modalConfirmSubmit: false,
      showInputUpdate: false,
      editor: null,
      uploadFileList: [],
      uploadImgSrc: get(this, "question.image_url", ""),
      contentEdittor: "",
      image: null,
      queryUpdateQuestion: {
        content: "",
        id: "",
      },
      queryUpdateAnswer: {
        content: "",
        question_id: this.questionId,
        id: "",
      },
    };
  },

  props: {
    level: {
      type: Number,
      default: 1,
      validator: (value) => [1, 2].includes(value),
    },
    question: {},
    questionId: {
      type: String,
      default: "",
    },
  },

  computed: {
    ...mapState('elearning/teaching/interactive-answer', ['hideFrom']),
    classes() {
      return {
        "tab-qa-comment-item--level-2": this.level === 2,
      };
    },
  },

  watch: {
    hideFrom(){
      this.showReply = false;
    },
  },

  mounted() {
    // Init editor
    this.editor = new Editor({
      content: this.question.content || "",
      autoFocus: true,
      extensions: [
        new Placeholder({
          showOnlyCurrent: true,
          showOnlyWhenEditable: true,
          emptyNodeText: "Viết bình luận",
        }),
        new HardBreak(),
        new History(),
        new EnterHandler({
          onEnter: this.submit,
        }),
      ],
      onPaste: this.handleEditorPaste,
    });
    try {
      this.idToken = JSON.parse(localStorage.getItem("token_user_schoolly"));
    } catch (error) {
      
    }
  },

  methods: {
    get,
    numeral,
    async likeQuestion() {
      if (!this.submit) return;
      this.submit = false;
      const payload = {
        question_id: get(this, "question.id", ""),
        like: !get(this, "question.liked", false),
      };
      const res = await new QuestionLikeService(this.$axios)["add"](payload);
      this.submit = true;
      if (get(res, "success", false)) {
        this.getQuestions();
        return;
      }
      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },

    async likeAnswer() {
      if (!this.submit) return;
      this.submit = false;
      const payload = {
        like: !get(this, "question.liked", false),
        answer_id: get(this, "question.id", ""),
      };
      const res = await new InteractiveAnswer(this.$axios)["likeAnswer"](
        payload
      );
      this.submit = true;
      if (get(res, "success", false)) {
        this.getQuestions();
        return;
      }
      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },

    getQuestions() {
      const options = {
        params: {
          elearning_id: get(this, "$route.params.id", ""),
          page: 1,
          sort_by: "NEWEST",
        },
      };
      this.$store.dispatch(`elearning/study/detail/getListQuestion`, options);
    },

    async updateQuestions() {
      let body = new FormData();
      body.append("content", this.queryUpdateQuestion.content);
      body.append("id", this.queryUpdateQuestion.id);
      if(this.image){
        body.append("image", this.image);
      }
      const res = await new InteractiveQuestionService(this.$axios)[
        "editQuestion"
      ](body);
      if (res.success == true) {
        this.reset();
        this.$toasted.success("Thành công");
        setTimeout(() => {
          this.getQuestions();
        }, 500);
        return;
      }
      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },

    async updateAnswer() {
      let body = new FormData();
      body.append("content", this.queryUpdateAnswer.content);
      body.append("id", this.queryUpdateAnswer.id);
      if(this.image) {
        body.append("image", this.image);
      } 
      const res = await new InteractiveAnswer(this.$axios)[
        "editAnswerOfQuestion"
      ](body);
      if (res.success == true) {
        this.reset();
        this.$toasted.success("Thành công");
         setTimeout(() => {
          this.getQuestions();
        }, 500);
        return;
      }
      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },

    handleSaveUpdate(level, _question) {
      this.queryUpdateQuestion.content = this.editor
        .getHTML()
        .replace("<p></p>", "");
      this.queryUpdateAnswer.content = this.editor
        .getHTML()
        .replace("<p></p>", "");
      if (level == 1) {
        this.queryUpdateQuestion.id = _question.id;
        this.updateQuestions();
      }
      if (level == 2) {
        this.queryUpdateAnswer.id = _question.id;
        this.updateAnswer();
      }
    },

    confirmModal(level, _id) {
      this.modalConfirmSubmit = false;
      if (this.level == 1) {
        this.deleteQuestion(_id);
      }
      if (this.level == 2) {
        this.deleteAnswer(_id);
      }
    },

    async deleteQuestion(_id) {
      const res = await new InteractiveQuestionService(this.$axios)[
        "deleteQuestion"
      ]({
        question_id: _id,
      });
      if (get(res, "success", false)) {
        this.$toasted.success("Thành công");
        this.getQuestions();
        this.reset();
        return;
      }
      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },

    async deleteAnswer(_id) {
      const res = await new InteractiveAnswer(this.$axios)[
        "deleteAnswerOfQuestion"
      ]({
        answer_id: _id,
      });
      if (get(res, "success", false)) {
        this.$toasted.success("Thành công");
        this.reset();
        this.getQuestions(_id);
        return;
      }
      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },

    reset() {
      this.queryUpdateQuestion.content = "";
      this.queryUpdateAnswer.content = "";
      this.image = null;
      this.uploadFileList = [];
      this.uploadImgSrc = null;;
      this.modalConfirmSubmit = false;
      this.showInputUpdate = false;
    },

    handleFeedBack() {
      this.showReply = !this.showReply;
      this.showInputUpdate = false;
    },

    handleUpdate() {
      this.showInputUpdate = !this.showInputUpdate;
      this.editor = new Editor({
        content: this.question.content || "",
      })
      this.uploadImgSrc = this.question.image_url || "",
      this.showReply = false;
      this.$nextTick(() => {
        this.editor.focus('end');
      });
    },

    handleLike() {
      if (this.level == 1) {
        this.likeQuestion();
      }
      if (this.level == 2) {
        this.likeAnswer();
      }
    },

    removeImgUpload() {
      this.image = null;
      this.uploadFileList = [];
      this.uploadImgSrc = null;

      if (this.mode === "edit") {
        this.isDeleteOldImg = true;
      }
    },

    handleUploadChange(fileList, event) {
      this.image = fileList[0];
      this.uploadFileList = Array.from(fileList);
      getBase64(this.uploadFileList[0], (src) => {
        this.uploadImgSrc = src;
      });
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/_tab-qa-comment-item.scss";
@import "~/assets/scss/components/elearning/study/_tab-qa-comment-editor.scss";
</style>
