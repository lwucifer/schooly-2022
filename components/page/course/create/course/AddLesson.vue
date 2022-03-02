<template>
  <div class="cc-box__bg-disable mb-4" id="create-lesson-of-chapter">
    <h3 class="heading-6 mb-2 mt-3">
      Tên bài học
      <span class="text-base font-weight-normal">(Tối đa 60 ký tự)</span>
    </h3>
    <app-input
      ref="inputName"
      :class="{ 'mb-0': get(error, 'name', '') }"
      @onBlur="handleChangeName"
      :counter="60"
      placeholder="Tên bài học"
      v-model="payload.name"
    />
    <app-error :error="get(error, 'name', '')" class="mb-4"></app-error>

    <p class="text-center body-1 text-dark mb-4">Chọn loại bài học</p>

    <!-- <app-divider class="mt-3 mb-4" /> -->

    <div class="clc-type-tabs">
      <a
        href
        class="clc-type-tab-item"
        :class="{ active: tabType === 'audio' }"
        @click.prevent="changeTabType('audio')"
      >
        <span class="clc-type-tab-item__icon">
          <IconRadioButtonChecked
            v-if="tabType === 'audio'"
            class="icon fill-opacity-1 mr-3"
          />
          <IconRadioButtonUnchecked v-else class="icon fill-opacity-1 mr-3" />
          <IconHeadphone class="icon fill-opacity-1 mr-3" />
          <span class="clc-type-tab-item__text">Audio</span>
        </span>
      </a>

      <a
        href
        class="clc-type-tab-item"
        :class="{ active: tabType === 'scorm' }"
        @click.prevent="changeTabType('scorm')"
      >
        <span class="clc-type-tab-item__icon">
          <IconRadioButtonChecked
            v-if="tabType === 'scorm'"
            class="icon fill-opacity-1 mr-3"
          />
          <IconRadioButtonUnchecked v-else class="icon fill-opacity-1 mr-3" />
          <IconViewList class="icon fill-opacity-1 mr-3" />
          <span class="clc-type-tab-item__text">SCORM</span>
        </span>
      </a>

      <a
        href
        class="clc-type-tab-item"
        :class="{ active: tabType === 'document' }"
        @click.prevent="changeTabType('document')"
      >
        <span class="clc-type-tab-item__icon">
          <IconRadioButtonChecked
            v-if="tabType === 'document'"
            class="icon fill-opacity-1 mr-3"
          />
          <IconRadioButtonUnchecked v-else class="icon fill-opacity-1 mr-3" />

          <IconFileAlt class="icon fill-opacity-1 mr-3" />
          <span class="clc-type-tab-item__text">Văn bản</span>
        </span>
        <!-- <span class="clc-type-tab-item__text"></span> -->
      </a>

      <a
        href
        class="clc-type-tab-item"
        :class="{ active: tabType === 'video' }"
        @click.prevent="changeTabType('video')"
      >
        <span class="clc-type-tab-item__icon">
          <IconRadioButtonChecked
            v-if="tabType === 'video'"
            class="icon fill-opacity-1 mr-3"
          />
          <IconRadioButtonUnchecked v-else class="icon fill-opacity-1 mr-3" />
          <IconVideo class="icon fill-opacity-1 mr-3" />
          <span class="clc-type-tab-item__text">Video</span>
        </span>
        <!-- <span class="clc-type-tab-item__text">Video</span> -->
      </a>
    </div>

    <app-divider class="my-4" />

    <LessonSelectAudio
      @handleSelectFile="handleSelectFile"
      @handleSelectUrl="handleSelectUrl"
      @handleReset="handleReset"
      :lesson="lesson"
      v-if="tabType === 'audio'"
    />

    <LessonSelectScorm
      v-if="tabType === 'scorm'"
      :lesson="lesson"
      @handleSelectFile="handleSelectFile"
      @handleSelectUrl="handleSelectUrl"
      @handleReset="handleReset"
    />

    <LessonSelectVideo
      v-if="tabType === 'video'"
      :lesson="lesson"
      @handleSelectFile="handleSelectFile"
      @handleSelectUrl="handleSelectUrl"
      @handleReset="handleReset"
    />

    <LessonSelectDocument
      v-if="tabType === 'document'"
      :lesson="lesson"
      @handleSelectDocument="handleSelectDocument"
      @handleSelectUrl="handleSelectUrl"
      @handleReset="handleReset"
    />

    <app-error :error="get(error, 'content', '')"></app-error>

    <div class="d-flex justify-content-end mt-4">
      <app-button
        class="clc-btn font-weight-semi-bold text-secondary mr-4"
        size="md"
        color="default"
        outline
        @click="$emit('hide')"
        >Hủy</app-button
      >
      <app-button
        class="clc-btn font-weight-semi-bold"
        size="md"
        @click="handleAddContent"
        :loading="loadingAdd"
        >{{ edit ? "Sửa" : "Thêm" }} bài học</app-button
      >
    </div>
  </div>
</template>

<script>
import { getBase64, getParamQuery, useEffect } from "~/utils/common";
import { get } from "lodash";
import IconRadioButtonChecked from "~/assets/svg/design-icons/radio_button_checked.svg?inline";
import IconRadioButtonUnchecked from "~/assets/svg/v2-icons/radio_button_unchecked_24px.svg?inline";
import IconHeadphone from "~/assets/svg/design-icons/headphones.svg?inline";
import IconViewList from "~/assets/svg/v2-icons/view_list_24px.svg?inline";
import IconFileAlt from "~/assets/svg/design-icons/file-alt.svg?inline";
const IconVideo = () => import("~/assets/svg/design-icons/video.svg?inline");

import LessonSelectVideo from "~/components/page/course/create/common/LessonSelectVideo";
import LessonSelectDocument from "~/components/page/course/create/common/LessonSelectDocument";
import LessonSelectScorm from "~/components/page/course/create/common/LessonSelectScorm";
import LessonSelectAudio from "~/components/page/course/create/common/LessonSelectAudio";

import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    IconFileAlt,
    IconRadioButtonChecked,
    IconRadioButtonUnchecked,
    IconHeadphone,
    IconViewList,
    IconVideo,
    LessonSelectScorm,
    LessonSelectAudio,
    LessonSelectVideo,
    LessonSelectDocument
  },

  props: {
    chapter: {
      type: Object,
      default: null
    },
    lesson: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      tabType: "video",
      loadingAdd: false,
      payload: {
        chapter_id: get(this, "chapter.id", ""),
        lesson: "",
        name: get(this, "lesson.name", ""),
        type: "VIDEO", // VIDEO | ARTICLE | PDF | DOC | TXT
        repository_file_id: "",
        article_content: "",
        id: get(this, "lesson.id", "")
      },
      modalType: "",
      error: {
        name: "",
        content: ""
      }
    };
  },

  mounted() {
    useEffect(this, this.handleChangeLesson.bind(this), ["lesson"]);
  },

  computed: {
    edit() {
      return !!get(this, "lesson.id", "");
    }
  },

  methods: {
    ...mapActions("elearning/study/study-progress", [
      "elearningSudyProgressProgramList"
    ]),
    ...mapActions("elearning/creating/creating-lesson", ["elearningCreatingLessonsList"]),

    handleCheckPayload() {
      const name = this.handleCheckName();
      const content = this.handleCheckContent();
      return name && content;
    },

    handleCheckName() {
      if (!this.payload.name) {
        this.error.name = "Bạn cần nhập tên bài học";
        return false;
      }
      this.error.name = "";
      return true;
    },

    handleCheckContent() {
      if (this.lesson) {
        this.error.content = "";
        return true;
      }
      let lesson = !!this.payload.lesson;
      let repository_file_id = !!this.payload.repository_file_id;
      let article_content = !!this.payload.article_content;
      if (!lesson && !repository_file_id && !article_content) {
        this.error.content = "Bạn cần nhập nội dung cho bài học";
        return false;
      }
      this.error.content = "";
      return true;
    },

    handleChangeLesson() {
      if (this.lesson) {
        this.payload.name = get(this, "lesson.name", "");
        this.payload.id = get(this, "lesson.id", "");
      }
      if (
        get(this, "lesson.type", "") === "ARTICLE" ||
        get(this, "lesson.type", "") === "DOCS"
      ) {
        this.tabType = "document";
      }
      if (get(this, "lesson.type", "") === "VIDEO") {
        this.tabType = "video";
      }
      if (get(this, "lesson.type", "") === "SCORM") {
        this.tabType = "scorm";
      }
      if (get(this, "lesson.type", "") === "AUDIO") {
        this.tabType = "audio";
      }
    },

    handleReset() {
      this.payload.article_content = "";
      this.payload.lesson = "";
      this.payload.repository_file_id = "";
    },

    handleChangeName() {
      this.handleCheckName();
    },

    changeTabType(type) {
      this.handleReset();
      this.tabType = type;
    },

    handleSelectFile(data) {
      this.modalType = "upload";
      this.payload.type = data.type;
      this.payload.lesson = data.lesson;
      this.payload.repository_file_id = "";
      this.handleCheckContent();
    },

    handleSelectUrl(file) {
      this.modalType = "url";
      this.payload.type = file.type;
      this.payload.lesson = "";
      this.payload.repository_file_id = file.id;
      this.handleCheckContent();
    },

    handleAddContent() {
      if (!this.handleCheckPayload()) {
        this.$toasted.error("Invalid params");
        return;
      }
      // this.showModalConfirm = true;
      this.handleOk();
    },

    async handleOk() {
      this.loadingAdd = true;
      this.payload.id = get(this, "lesson.id", "");

      const payload = { ...this.payload };
      if (!payload.chapter_id) delete payload.chapter_id;
      if (!payload.id) delete payload.id;
      if (!payload.lesson) delete payload.lesson;
      if (!payload.repository_file_id) delete payload.repository_file_id;
      if (!payload.article_content) delete payload.article_content;
      if (this.tabType === "audio") delete payload.type;

      if (getParamQuery("type") == "COURSE") {
        payload.chapter_id = get(this, "chapter.id", "");
      }else if (getParamQuery("type") == "LECTURE") {
        payload.elearning_id = getParamQuery("elearning_id");
      }
      console.log("[handleOk] payload", payload);

      const result = await this.$store.dispatch(
        `elearning/creating/creating-lesson/${actionTypes.ELEARNING_CREATING_LESSONS.ADD}`,
        payload
      );

      if (get(result, "success", false)) {
        this.$toasted.success(get(result, "message", "Thành công"));
        this.$emit("hide");

        const elearning_id = getParamQuery("elearning_id");
        const type = getParamQuery("type");
        
        if(type == "LECTURE") {
          this.elearningCreatingLessonsList({ params: {elearning_id} });
        } else {
          this.elearningSudyProgressProgramList({ elearning_id });
        }
      } else {
        this.$toasted.error(get(result, "message", "Có lỗi xảy ra"));
      }

      this.loadingAdd = false;
    },

    handleSelectDocument(type, article_content, file_id, lesson) {
      this.payload.type = type;
      this.payload.lesson = lesson;
      this.payload.repository_file_id = file_id;
      this.payload.article_content = article_content;
      this.handleCheckContent();
    },

    get
  }
};
</script>
