<template>
  <div class="app-editor app-editor--menu-bubble" :class="classes">
    <editor-menu-bubble
      :editor="editor"
      :keep-in-bounds="keepInBounds"
      @hide="hideLinkMenu"
      v-slot="{ commands, isActive, getMarkAttrs, menu }"
    >
      <div
        class="menububble"
        :class="{ 'is-active': menu.isActive }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
      >
        <button
          class="menububble__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <IconBold class="icon" />
        </button>

        <button
          class="menububble__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <IconItalic class="icon" />
        </button>

        <button
          class="menububble__button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <IconStrike class="icon" />
        </button>

        <button
          class="menububble__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <IconUnderline class="icon" />
        </button>

        <form
          class="menububble__form"
          v-if="linkMenuIsActive"
          @submit.prevent="setLinkUrl(commands.link, linkUrl)"
        >
          <input
            class="menububble__input"
            type="text"
            v-model="linkUrl"
            placeholder="https://"
            ref="linkInput"
            @keydown.esc="hideLinkMenu"
          />
          <button
            class="menububble__button text-success"
            @click="setLinkUrl(commands.link, linkUrl)"
            type="submit"
          >
            <IconCheck class="icon" />
          </button>
          <button class="menububble__button" @click="setLinkUrl(commands.link, null)" type="button">
            <IconTimes class="icon text-error" />
          </button>
        </form>

        <button
          v-else
          class="menububble__button menububble__button--link"
          :class="{ 'is-active': isActive.link() }"
          @click="showLinkMenu(getMarkAttrs('link'))"
        >
          <IconLinkAlt class="icon" />
        </button>
      </div>
    </editor-menu-bubble>

    <div
      class="app-editor__content-wrapper"
      :style="contentWrapperStyles"
      @click.self="editor && editor.focus()"
    >
      <editor-content class="editor app-editor__content" :editor="editor" />
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBubble } from "tiptap";
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  Placeholder
} from "tiptap-extensions";
const IconBold = () => import("~/assets/svg/text-editor/bold.svg?inline");
const IconItalic = () => import("~/assets/svg/text-editor/italic.svg?inline");
const IconStrike = () => import("~/assets/svg/text-editor/strike.svg?inline");
const IconUnderline = () =>
  import("~/assets/svg/text-editor/underline.svg?inline");
const IconLinkAlt = () =>
  import("~/assets/svg/design-icons/link-alt.svg?inline");
const IconTimes = () => import("~/assets/svg/design-icons/times.svg?inline");
const IconCheck = () => import("~/assets/svg/design-icons/check.svg?inline");

export default {
  components: {
    EditorContent,
    EditorMenuBubble,
    IconBold,
    IconItalic,
    IconStrike,
    IconUnderline,
    IconLinkAlt,
    IconTimes,
    IconCheck
  },

  model: {
    event: "input",
    prop: "value"
  },

  props: {
    value: {
      type: [String, Object],
      default: null
    },
    minHeight: {
      type: [String, Number]
    },
    placeholder: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      editor: null,
      keepInBounds: true,
      isEditorFocused: false,
      emitAfterOnUpdate: false,
      linkUrl: null,
      linkMenuIsActive: false
    };
  },

  computed: {
    classes() {
      return {
        "app-editor--is-focused": this.isEditorFocused
      };
    },

    contentWrapperStyles() {
      return {
        "min-height": this.minHeight
          ? typeof this.minHeight === "number"
            ? this.minHeight + "px"
            : this.minHeight
          : null
      };
    }
  },

  watch: {
    value(newValue) {
      if (this.emitAfterOnUpdate) {
        this.emitAfterOnUpdate = false;
        return;
      }

      this.editor.setContent(newValue);
    }
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        new Placeholder({
          showOnlyCurrent: true,
          showOnlyWhenEditable: true,
          emptyNodeText: this.placeholder
        }),
        new HardBreak(),
        new Link(),
        new Bold(),
        new Italic(),
        new Strike(),
        new Underline()
      ],
      content: this.value,
      onUpdate: ({ getHTML }) => {
        this.emitAfterOnUpdate = true;
        this.$emit("input", getHTML());
      },
      onFocus: () => {
        this.isEditorFocused = true;
      },
      onBlur: () => {
        this.$emit('onBlur')
        this.isEditorFocused = false;
      }
    });
  },

  beforeDestroy() {
    this.editor.destroy();
  },

  methods: {
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href;
      this.linkMenuIsActive = true;
      this.$nextTick(() => {
        this.$refs.linkInput.focus();
      });
    },

    hideLinkMenu() {
      this.linkUrl = null;
      this.linkMenuIsActive = false;
    },

    setLinkUrl(command, url) {
      command({ href: url });
      this.hideLinkMenu();
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-editor-menu-bubble.scss";
</style>
