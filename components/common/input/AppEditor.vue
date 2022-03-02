<template>
  <div class="app-editor" :class="classes" sticky-container>
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive, getMarkAttrs }">
      <div class="app-editor__menubar" v-sticky :sticky-offset="stickyOffset">
        <div class="app-editor__menubar__toolbar">
          <button class="app-editor__menubar__button" @click="commands.undo">
            <IconUndo class="icon" />
          </button>

          <button class="app-editor__menubar__button" @click="commands.redo">
            <IconRedo class="icon" />
          </button>

          <button
            class="app-editor__menubar__button"
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
          >
            <IconBold class="icon" />
          </button>

          <button
            class="app-editor__menubar__button"
            :class="{ 'is-active': isActive.italic() }"
            @click="commands.italic"
          >
            <IconItalic class="icon" />
          </button>

          <button
            class="app-editor__menubar__button"
            :class="{ 'is-active': isActive.strike() }"
            @click="commands.strike"
          >
            <IconStrike class="icon" />
          </button>

          <button
            class="app-editor__menubar__button"
            :class="{ 'is-active': isActive.underline() }"
            @click="commands.underline"
          >
            <IconUnderline class="icon" />
          </button>

          <button
            class="app-editor__menubar__button"
            :class="{ 'is-active': isActive.code() }"
            @click="commands.code"
          >
            <IconCode class="icon" />
          </button>

          <button
            class="app-editor__menubar__button"
            :class="{ 'is-active': isActive.paragraph() }"
            @click="commands.paragraph"
          >
            <IconParagraph class="icon" />
          </button>

          <button
            class="app-editor__menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 1 }) }"
            @click="commands.heading({ level: 1 })"
          >H1</button>

          <button
            class="app-editor__menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 2 }) }"
            @click="commands.heading({ level: 2 })"
          >H2</button>

          <button
            class="app-editor__menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 3 }) }"
            @click="commands.heading({ level: 3 })"
          >H3</button>

          <button
            class="app-editor__menubar__button"
            :class="{ 'is-active': isActive.bullet_list() }"
            @click="commands.bullet_list"
          >
            <IconBulletList class="icon" />
          </button>

          <button
            class="app-editor__menubar__button"
            :class="{ 'is-active': isActive.ordered_list() }"
            @click="commands.ordered_list"
          >
            <IconOrderList class="icon" />
          </button>

          <button
            class="app-editor__menubar__button"
            :class="{ 'is-active': isActive.blockquote() }"
            @click="commands.blockquote"
          >
            <IconQuote class="icon" />
          </button>

          <button
            class="app-editor__menubar__button"
            :class="{ 'is-active': isActive.code_block() }"
            @click="commands.code_block"
          >
            <IconCode class="icon" />
          </button>

          <button
            class="app-editor__menubar__button"
            @click="
              commands.createTable({
                rowsCount: 3,
                colsCount: 3,
                withHeaderRow: false,
              })
            "
          >
            <IconTable class="icon" />
          </button>

          <template v-if="isActive.table()">
            <button class="app-editor__menubar__button" @click="commands.deleteTable">
              <icon name="delete_table" />
              <IconTableDelete class="icon" />
            </button>
            <button class="app-editor__menubar__button" @click="commands.addColumnBefore">
              <IconTableAddColBefore class="icon" />
            </button>
            <button class="app-editor__menubar__button" @click="commands.addColumnAfter">
              <IconTableAddColAfter class="icon" />
            </button>
            <button class="app-editor__menubar__button" @click="commands.deleteColumn">
              <IconTableDeleteCol class="icon" />
            </button>
            <button class="app-editor__menubar__button" @click="commands.addRowBefore">
              <IconTableAddRowBefore class="icon" />
            </button>
            <button class="app-editor__menubar__button" @click="commands.addRowAfter">
              <IconTableAddRowAfter class="icon" />
            </button>
            <button class="app-editor__menubar__button" @click="commands.deleteRow">
              <IconTableDeleteRow class="icon" />
            </button>
            <button class="app-editor__menubar__button" @click="commands.toggleCellMerge">
              <IconTableCombineCells class="icon" />
            </button>
          </template>

          <form
            class="app-editor__menubar__form"
            v-if="linkMenuIsActive"
            @submit.prevent="setLinkUrl(commands.link, linkUrl)"
          >
            <input
              class="app-editor__menubar__input"
              type="text"
              v-model="linkUrl"
              placeholder="https://"
              ref="linkInput"
              @keydown.esc="hideLinkMenu"
            />
            <button
              class="app-editor__menubar__button text-success"
              @click="setLinkUrl(commands.link, linkUrl)"
              type="submit"
            >
              <IconCheck class="icon" />
            </button>
            <button
              class="app-editor__menubar__button"
              @click="setLinkUrl(commands.link, null)"
              type="button"
            >
              <IconTimes class="icon text-error" />
            </button>
          </form>

          <button
            v-else
            class="app-editor__menubar__button app-editor__menubar__button--link"
            :class="{ 'is-active': isActive.link() }"
            @click="showLinkMenu(getMarkAttrs('link'))"
          >
            <IconLinkAlt class="icon" />
          </button>
        </div>
      </div>
    </editor-menu-bar>

    <div
      class="editor app-editor__content-wrapper"
      :style="contentWrapperStyles"
      @click.self="editor && editor.focus()"
    >
      <editor-content class="app-editor__content" :editor="editor" />
    </div>
  </div>
</template>

<script>
import {
  Editor,
  EditorContent,
  EditorMenuBar,
  EditorMenuBubble,
  Extension,
} from "tiptap";
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Strike,
  Underline,
  History,
  Placeholder,
} from "tiptap-extensions";
const IconUndo = () => import("~/assets/svg/text-editor/undo.svg?inline");
const IconRedo = () => import("~/assets/svg/text-editor/redo.svg?inline");
const IconBold = () => import("~/assets/svg/text-editor/bold.svg?inline");
const IconItalic = () => import("~/assets/svg/text-editor/italic.svg?inline");
const IconStrike = () => import("~/assets/svg/text-editor/strike.svg?inline");
const IconUnderline = () =>
  import("~/assets/svg/text-editor/underline.svg?inline");
const IconCode = () => import("~/assets/svg/text-editor/code.svg?inline");
const IconParagraph = () =>
  import("~/assets/svg/text-editor/paragraph.svg?inline");
const IconBulletList = () => import("~/assets/svg/text-editor/ul.svg?inline");
const IconOrderList = () => import("~/assets/svg/text-editor/ol.svg?inline");
const IconQuote = () => import("~/assets/svg/text-editor/quote.svg?inline");
const IconTable = () => import("~/assets/svg/text-editor/table.svg?inline");
const IconTableDelete = () =>
  import("~/assets/svg/text-editor/delete-table.svg?inline");
const IconTableAddColBefore = () =>
  import("~/assets/svg/text-editor/add-col-before.svg?inline");
const IconTableAddColAfter = () =>
  import("~/assets/svg/text-editor/add-col-after.svg?inline");
const IconTableDeleteCol = () =>
  import("~/assets/svg/text-editor/delete-col.svg?inline");
const IconTableAddRowBefore = () =>
  import("~/assets/svg/text-editor/add-row-before.svg?inline");
const IconTableAddRowAfter = () =>
  import("~/assets/svg/text-editor/add-row-after.svg?inline");
const IconTableDeleteRow = () =>
  import("~/assets/svg/text-editor/delete-row.svg?inline");
const IconTableCombineCells = () =>
  import("~/assets/svg/text-editor/combine-cells.svg?inline");
const IconLinkAlt = () =>
  import("~/assets/svg/design-icons/link-alt.svg?inline");
const IconTimes = () => import("~/assets/svg/design-icons/times.svg?inline");
const IconCheck = () => import("~/assets/svg/design-icons/check.svg?inline");

export default {
  components: {
    EditorContent,
    EditorMenuBar,
    EditorMenuBubble,
    IconUndo,
    IconRedo,
    IconBold,
    IconItalic,
    IconStrike,
    IconUnderline,
    IconCode,
    IconParagraph,
    IconBulletList,
    IconOrderList,
    IconQuote,
    IconTable,
    IconTableDelete,
    IconTableAddColBefore,
    IconTableAddColAfter,
    IconTableDeleteCol,
    IconTableAddRowBefore,
    IconTableAddRowAfter,
    IconTableDeleteRow,
    IconTableCombineCells,
    IconLinkAlt,
    IconTimes,
    IconCheck,
  },

  model: {
    event: "input",
    prop: "value",
  },

  props: {
    value: {
      type: [String, Object],
      default: null,
    },
    minHeight: {
      type: [String, Number],
    },
    placeholder: {
      type: String,
      default: "",
    },
    stickyOffset: {
      type: String,
      default: "{ top: 0, bottom: 0 }",
    },
  },

  data() {
    return {
      editor: null,
      isEditorFocused: false,
      emitAfterOnUpdate: false,
      linkUrl: null,
      linkMenuIsActive: false,
    };
  },

  computed: {
    classes() {
      return {
        "app-editor--is-focused": this.isEditorFocused,
      };
    },

    contentWrapperStyles() {
      return {
        "min-height": this.minHeight
          ? typeof this.minHeight === "number"
            ? this.minHeight + "px"
            : this.minHeight
          : null,
      };
    },
  },

  watch: {
    value(newValue) {
      if (this.emitAfterOnUpdate) {
        this.emitAfterOnUpdate = false;
        return;
      }

      this.editor.setContent(newValue);
    },
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        new Placeholder({
          showOnlyCurrent: true,
          showOnlyWhenEditable: true,
          emptyNodeText: this.placeholder,
        }),
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new ListItem(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Link(),
        new Bold(),
        new Code(),
        new Italic(),
        new Strike(),
        new Underline(),
        new History(),
        new Table({
          resizable: true,
        }),
        new TableHeader(),
        new TableCell(),
        new TableRow(),
        // Make press enter = insert hard break
        new (class extends Extension {
          keys() {
            return {
              Enter(state, dispatch, view) {
                const { schema, doc, tr } = view.state;

                const hard_break = schema.nodes.hard_break;
                const transaction = tr
                  .replaceSelectionWith(hard_break.create())
                  .scrollIntoView();
                view.dispatch(transaction);
                return true;
              },
            };
          }
        })(),
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
        this.$emit("onBlur");
        this.isEditorFocused = false;
      },
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
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-editor.scss";
</style>
