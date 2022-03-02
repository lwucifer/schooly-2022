<template>
  <app-modal
    centered
    width="610px"
    @close="$listeners.cancel ? $listeners.cancel() : null"
    :component-class="{ pms: true }"
  >
    <div class="pms-header" slot="header">
      <h2 class="pms-header__title app-modal-title">Chia sẻ</h2>

      <app-select
        v-if="share === SHARE_OPTS.TIMELINE"
        v-model="privacy"
        bordered
        class="pms-select-private mr-4"
        :options="POST_PRIVACY_OPTS"
        size="sm"
      >
        <component
          slot="prepend"
          slot-scope="{ selected }"
          :is="selected.icon"
          class="icon fill-opacity-1 d-block"
        />
      </app-select>

      <app-select v-model="share" :options="SHARE_OPTIONS" size="sm" bordered>
        <IconAngleDown slot="placeholder-icon" class="icon d-block" />
      </app-select>
    </div>

    <div slot="content" class="pms-body">
      <editor-content class="editor pms-editor" :editor="editor" />

      <slot name="share-content"></slot>
    </div>

    <div slot="footer" class="pms-footer">
      <!-- <div class="pms-footer__left">
        <app-button class="pms-footer__flat-btn tag" color flat size="xs">
          <IconUserGroup class="icon" />
        </app-button>

        <app-button class="pms-footer__flat-btn location" color flat size="xs">
          <IconPinLocation class="icon" />
        </app-button>

        <app-button class="pms-footer__flat-btn emoji" color flat size="xs">
          <IconEmoji class="icon" />
        </app-button>
      </div>-->

      <div class="pms-footer__right ml-auto">
        <app-button
          class="pms-footer__btn mr-4"
          color="default"
          outline
          size="sm"
          square
          @click="$emit('cancel')"
        >Huỷ</app-button>
        <app-button
          class="pms-footer__btn"
          color="primary"
          :loading="btnSubmitLoading"
          size="sm"
          square
          @click="submit"
        >Chia sẻ</app-button>
      </div>
    </div>
  </app-modal>
</template>

<script>
import { get } from "lodash";
import { Editor, EditorContent, Extension } from "tiptap";
import {
  Placeholder,
  Mention,
  HardBreak,
  History,
  Link,
} from "tiptap-extensions";

import {
  SHARE_OPTS,
  POST_TYPES,
  POST_PRIVACY,
  POST_PRIVACY_TEXT,
} from "~/utils/constants";
import { getMentionIds } from "~/utils/common";

import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import IconUserGroup from "~/assets/svg/icons/user-group.svg?inline";
import IconPinLocation from "~/assets/svg/icons/pin-location.svg?inline";
import IconEmoji from "~/assets/svg/icons/emoji.svg?inline";
import IconGlobe from "~/assets/svg/icons/globe.svg?inline";
import IconLock from "~/assets/svg/icons/lock_24px.svg?inline";
import IconSupervisorAccount from "~/assets/svg/v2-icons/supervisor_account_24px.svg?inline";

export default {
  components: {
    IconAngleDown,
    EditorContent,
    IconUserGroup,
    IconPinLocation,
    IconEmoji,
    IconGlobe,
    IconLock,
    IconSupervisorAccount,
  },

  props: {
    post: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      editor: null,
      btnSubmitLoading: false,
      share: SHARE_OPTS.TIMELINE,
      privacy: POST_PRIVACY.PUBLIC,
    };
  },

  created() {
    this.POST_PRIVACY_TEXT = Object.freeze(POST_PRIVACY_TEXT);
    this.POST_PRIVACY = Object.freeze(POST_PRIVACY);
    this.SHARE_OPTS = Object.freeze(SHARE_OPTS);
    this.SHARE_OPTIONS = [
      {
        value: SHARE_OPTS.TIMELINE,
        text: "Trên dòng thời gian của bạn",
      },
      // {
      //   value: SHARE_OPTS.FRIEND,
      //   text: "Chia sẻ trên dòng thời gian của bạn bè",
      // },
      // {
      //   value: SHARE_OPTS.MESSAGE,
      //   text: "Chia sẻ trong tin nhắn riêng",
      // },
    ];

    let privacyOpts = [];
    for (const key in POST_PRIVACY_TEXT) {
      privacyOpts.push({
        value: key,
        text: POST_PRIVACY_TEXT[key],
        icon:
          key === POST_PRIVACY.PUBLIC
            ? IconGlobe
            : key === POST_PRIVACY.FRIENDS
            ? IconSupervisorAccount
            : IconLock,
      });
    }
    this.POST_PRIVACY_OPTS = privacyOpts;
  },

  mounted() {
    this.editor = new Editor({
      content: this.content,
      extensions: [
        new Link(),
        new HardBreak(),
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
        new History(),
        new Placeholder({
          showOnlyCurrent: true,
          showOnlyWhenEditable: true,
          emptyNodeText: "Nói gì đó về nội dung...",
        }),
      ],
    });
  },

  methods: {
    submit() {
      this.btnSubmitLoading = true;
      const text = this.editor.getHTML();
      const tags = getMentionIds(text);

      const payload =
        this.post.link && this.post.link.url
          ? {
              type: POST_TYPES.LINK,
              privacy: {
                scope: this.privacy,
              },
              text,
              tags: tags.length ? tags : null,
              link: this.post.link,
            }
          : {
              type: POST_TYPES.SHARE,
              privacy: {
                scope: this.privacy,
              },
              text,
              tags: tags.length ? tags : null,
              shared_post_id: this.post.id,
            };

      const cb = () => {
        this.btnSubmitLoading = false;
      };

      this.$emit("share", payload, cb);
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/post/_post-modal-share.scss";
</style>
