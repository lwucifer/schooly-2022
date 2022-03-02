<template>
  <div class="app-upload" :class="{ 'app-upload--disabled': disabled }">
    <span
      role="button"
      tabindex="0"
      class="app-upload__button"
      @click="triggerClickInput"
    >
      <input
        v-if="input"
        ref="inputFile"
        type="file"
        class="app-upload__input"
        v-bind="$attrs"
        :multiple="multiple"
        :accept="accept"
        :disabled="disabled"
        v-on="uploadListeners"
      />
      <slot>
        <div class="app-upload__default-slot">
          <div class="app-upload__control">
            <div class="app-upload__text" v-if="inputText">
              <span class="app-upload__file-name" v-if="localFileList.length">
                <slot name="fileName" :localFileList="localFileList">{{
                  localFileList[0] ? localFileList[0].name : ""
                }}</slot>
              </span>
              <span class="app-upload__placeholder" v-else>{{
                placeholder || "No file selected"
              }}</span>
            </div>

            <app-button
              class="app-upload__btn-choose-file btn--color-disabled"
              color="disable"
              size="md"
            >
              <IconAttachFile24px class="mr-2" v-if="showIcon"/>
              {{ title }}
            </app-button>
          </div>
          <slot name="hint"></slot>
        </div>
      </slot>
    </span>
  </div>
</template>

<script>
import IconAttachFile24px from "~/assets/svg/v2-icons/attach_file_24px.svg?inline";

export default {
  components: {
    IconAttachFile24px,
  },

  inheritAttrs: false,

  props: {
    multiple: Boolean,
    accept: {
      type: String,
      default: "",
    },
    fileList: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
    },
    inputText: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "Chọn file",
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    disabled: Boolean
  },

  data() {
    return {
      input: true,
      localFileList: this.fileList,
    };
  },

  computed: {
    uploadListeners: function() {
      const vm = this;
      // `Object.assign` merges objects together to form a new object
      return Object.assign(
        {},
        // We add all the listeners from the parent
        this.$listeners,
        // Then we can add custom listeners or override the
        // behavior of some listeners.
        {
          // This ensures that the component works with v-model
          change: function(event) {
            vm.localFileList = event.target.files;
            vm.$emit("change", event.target.files, event);
            vm.input = false;
            const timeout = setTimeout(() => {
              vm.input = true;
              clearTimeout(timeout);
            });
          },
        }
      );
    },
  },

  watch: {
    fileList(newValue) {
      this.localFileList = this.fileList;
    },
  },

  methods: {
    triggerClickInput() {
      this.$refs.inputFile && this.$refs.inputFile.click();
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-upload.scss";
</style>
