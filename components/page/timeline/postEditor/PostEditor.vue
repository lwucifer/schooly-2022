<template>
  <div class="post-editor" :class="classes">
    <div v-if="showOverlay" class="post-editor__overlay" @click.stop="localActive = false"></div>
    <div class="post-editor__components">
      <app-avatar
        v-if="showAvatar"
        class="post-editor__avatar"
        :src="avatarUser && avatarUser.low ? avatarUser.low : null"
        size="5.5rem"
      />

      <div class="post-editor__right">
        <client-only>
          <div class="post-editor__editor editor" @click="handleClickEditor">
            <editor-content :editor="editor" />

            <div class="suggestion-list" v-show="hasResults" ref="suggestions">
              <div
                v-for="(user, index) in mentionList"
                :key="user.profile ? user.profile.id : ''"
                class="suggestion-list__item"
                :class="{ 'is-selected': mentionNavigatedIndex === index }"
                @click="selectUser(user)"
              >
                <app-avatar class="mr-3" :size="32" :src="get(user, 'profile.avatar.low')" />
                {{ get(user, 'profile.fullname') }}
              </div>
            </div>
          </div>

          <!-- <div class="post-editor__emoji-picker">
            <v-popover>
              <IconEmoji class="icon" />
              <picker slot="popover" @select="addEmoji" />
            </v-popover>
          </div> -->
        </client-only>


        <div v-show="localActive">
          <PostEditorUpload
            v-show="fileList.length"
            :mode="mode"
            :fileList="fileList"
            :previewList="previewList"
            @remove-item="removeUploadItem"
            @change="handleUploadChange"
          />

          <div class="post-editor__tagger-summary">
            <!-- FELLING -->
            <template v-if="feeling != null">
              <!-- <strong v-html="feeling ? $emoji.replace_colons(feeling) : ''"></strong> -->
              <client-only>
                <emoji :emoji="feeling" :size="20" />
              </client-only>
              đang cảm thấy&nbsp;{{ getEmojiName(feeling).toLowerCase() }}.
            </template>
            <!-- END FELLING -->

            <!-- TAG -->
            <template v-if="selectedTags.length">
              cùng với
              <a
                class="font-weight-bold"
                :href="`/social/account/${selectedTags[0].id}`"
                target="_blank"
              >{{ selectedTags[0].text }}</a>

              <template v-if="selectedTags.length > 1">
                và
                <a
                  v-if="selectedTags.length === 2"
                  class="font-weight-bold"
                  :href="`/social/account/${selectedTags[1].id}`"
                  target="_blank"
                >{{ selectedTags[1].text }}</a>

                <client-only v-else>
                  <v-popover class="d-inline-block" trigger="hover">
                    <a
                      class="font-weight-bold"
                      href
                      @click.prevent
                    >{{ selectedTags.slice(1).length }} người khác.</a>
                    <template slot="popover">
                      <div
                        v-for="item in selectedTags.slice(1)"
                        :key="item.value"
                        class="post-editor__tags-popover-item"
                      >
                        <a :href="`/social/account/${item.id}`" target="_blank">{{ item.text }}</a>
                      </div>
                    </template>
                  </v-popover>
                </client-only>
              </template>
            </template>
            <!-- END TAG -->

            <!-- CHECK IN -->
            <!-- <template v-if="checkin !== null">
              tại
              <b>
                <n-link to>{{ selectedCheckin }}</n-link>
              </b>
            </template>-->
            <!-- END CHECK IN -->
          </div>

          <div v-if="linkDataFetching" class="text-center caption py-5">
            <template v-if="linkDataFetchError">Không thể tải bản xem trước.</template>
            <template v-else>Đang tìm nạp bản xem trước</template>
          </div>

          <div v-else-if="!linkDataFetching && linkDataFetched" class="post-editor__preview-link">
            <a href class="post-editor__preview-link-remove" @click.prevent="removePreviewLink">
              <IconTimes class="icon" />
            </a>

            <app-content-box
              class="mb-0"
              tag="a"
              target="_blank"
              direction="vertical"
              type="preview-link"
              :href="link.url"
              :image="link.imageUrl"
              :title="link.title"
              :desc="link.description || link.url"
              :meta-footer="link.siteName"
            />
          </div>

          <div v-show="showTags">
            <app-select
              ref="selectTags"
              mode="tags"
              class="post-editor__select w-100"
              placeholder="Cùng với ai?"
              :empty-message="!friendsListLoading ? `Không tìm thấy người nào` : null"
              :options="friendsList"
              v-model="tags"
              @visible-change="handleFriendsVisibleChange"
              @search="handleSearchFriends"
            >
              <div slot="option" slot-scope="{ option, isSelected }" class="social-tag-option">
                <app-avatar :src="option.avatar" size="sm" class="social-tag-option__avatar"></app-avatar>
                <span class="social-tag-option__text">{{ option.text }}</span>
                <IconCheck v-if="isSelected" class="social-tag-option__icon icon fill-opacity-1" />
              </div>

              <div slot="options-append" v-if="friendsListLoading" class="px-4 py-3 text-center">
                <app-spin />
              </div>
            </app-select>
            <app-divider class="ma-0" />
          </div>

          <PostShareContent
            v-if="mode === 'edit' && sharedPost.id"
            class="post__link-box"
            :post="sharedPost"
          >
            <template slot="media-content" slot-scope="{ attachments, sharedPost }">
              <PostImage
                v-if="attachments && attachments.length"
                class="mt-0 mb-4"
                :images="
                    attachments.map((item) => ({
                      id: item.id,
                      thumb: get(item, 'url.medium', null),
                      object: item.type,
                      url: item.url
                    }))
                  "
                @click-item="
                    (...args) => handleClickImage(...args, sharedPost, post)
                  "
              />

              <app-content-box
                v-if="
                    sharedPost.type === POST_TYPES.LINK &&
                      typeof sharedPost.link === 'object'
                  "
                tag="a"
                target="_blank"
                class="mt-0 mb-4"
                direction="vertical"
                type="preview-link"
                :href="sharedPost.link.url"
                :image="sharedPost.link.image_url"
                :title="sharedPost.link.title"
                :desc="sharedPost.link.description || sharedPost.link.url"
                :meta-footer="sharedPost.link.site_name"
              />
            </template>
          </PostShareContent>
        </div>

        <div class="post-editor__toolbar">
          <button
            class="post-editor__toolbar-button image"
            :class="{ active: fileList.length }"
            @click="handleClickUploadImage"
          >
            <IconAddPhotoAlternate class="icon" />
            <span>Ảnh / Video</span>
          </button>
          <button
            class="post-editor__toolbar-button tag"
            :class="{ active: tags.length }"
            @click="toggleTags"
          >
            <IconGroup class="icon" />
            <span>Gắn thẻ bạn bè</span>
          </button>
          <app-dropdown
            class="post-editor__label-dropdown"
            position="bottomRight"
            open-on-click
            v-model="labelDropdrown"
            @visible-change="handleLabelVisibleChange"
          >
            <button
              slot="activator"
              slot-scope="{ on }"
              class="post-editor__toolbar-button emoji"
              :class="{ active: feeling }"
              v-on="on"
            >
              <IconSentimentSatisfied class="icon" />
              <span>Cảm xúc / Hoạt động</span>
            </button>

            <ul class="post-editor__status-list">
              <li
                v-for="item in POST_LABELS"
                :key="item.key"
                :class="{ active: feeling === item.key }"
                @click="handleClickLabel(item.key)"
              >
                <!-- <strong class="mr-4" v-html="$emoji.replace_colons(item.key)" /> -->
                <client-only>
                  <emoji :emoji="item.key" :size="20" class="mr-4" />
                </client-only>
                <span>{{ item.description }}</span>
              </li>
            </ul>
          </app-dropdown>
        </div>

        <div class="post-editor__privacy">
          <span class="post-editor__privacy-label">Chế độ đăng tin</span>
          <app-select
            v-model="privacy"
            bordered
            class="post-editor__select-private"
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
        </div>

        <app-button
          class="post-editor__submit"
          :disabled="!submitable"
          :loading="submitLoading"
          full-width
          square
          @click.stop="submit"
        >{{ mode === "add" ? "Đăng tin" : "Chỉnh sửa"}}</app-button>
      </div>
    </div>
  </div>
</template>

<script>
import tippy from "tippy.js";
import "tippy.js/themes/light.css";
import { isEmpty, debounce, uniqWith, get } from "lodash";
import { mapState, mapGetters } from "vuex";
import { Editor, EditorContent, Extension } from "tiptap";
import {
  Placeholder,
  Mention,
  HardBreak,
  History,
  Link,
} from "tiptap-extensions";

import {
  getBase64,
  isValidUrl,
  getEmojiName,
  getMentionIds,
} from "~/utils/common";
import { BASE as ACTION_TYPE_BASE } from "~/utils/action-types";
import { checkEditorEmpty } from "~/utils/validations";
import { PasteHandler, Emoji } from "~/utils/tiptap-plugins";
import {
  POST_PRIVACY,
  POST_PRIVACY_TEXT,
  POST_TYPES,
  MEDIA_TARGET_TYPES,
  POST_LABELS,
  PAGE_SIZE,
  ATTACHMENT_TYPES,
  FRIENDS_FETCH_TYPE,
} from "~/utils/constants";
import { MEDIA as ENDPOINT_MEDIA } from "~/utils/endpoints";
import { createPostLink } from "~/models/post/PostLink";
import FriendsService from "~/services/social/Friends";
import ScraperService from "~/services/social/Scraper";

import PostEditorUpload from "~/components/page/timeline/postEditor/PostEditorUpload";
import PostShareContent from "~/components/page/timeline/post/PostShareContent";
import PostImage from "~/components/page/timeline/post/PostImage";
import IconTimes from "~/assets/svg/design-icons/times.svg?inline";
import IconGlobe from "~/assets/svg/icons/globe.svg?inline";
import IconLock from "~/assets/svg/icons/lock_24px.svg?inline";
import IconSupervisorAccount from "~/assets/svg/v2-icons/supervisor_account_24px.svg?inline";
import IconAddPhotoAlternate from "~/assets/svg/v2-icons/add_photo_alternate_24px.svg?inline";
import IconGroup from "~/assets/svg/v2-icons/group_24px.svg?inline";
import IconSentimentSatisfied from "~/assets/svg/v2-icons/sentiment_satisfied_24px.svg?inline";
import IconCheck from "~/assets/svg/v2-icons/check_24px.svg?inline";
import IconEmoji from "~/assets/svg/icons/emoji.svg?inline";

export default {
  components: {
    PostEditorUpload,
    IconAddPhotoAlternate,
    IconGroup,
    IconSentimentSatisfied,
    IconTimes,
    EditorContent,
    PostShareContent,
    PostImage,
    IconCheck,
    IconEmoji
  },

  props: {
    active: Boolean,
    prefetch: Boolean,
    showAvatar: {
      type: Boolean,
      default: true,
    },
    showOverlay: {
      type: Boolean,
      default: true,
    },
    mode: {
      type: String,
      default: "add",
      validator: (value) => ["add", "edit"].includes(value),
    },
    initialValues: {
      postId: Number,
      htmlContent: String,
      link: {
        url: String,
        detect: Boolean,
        siteName: String,
        title: String,
        description: String,
        imageUrl: String,
      },
      tags: Array,
      checkIn: Object,
      privacy: Number,
      feeling: String,
      default: () => ({
        postId: null,
        htmlContent: "",
        link: {
          url: "",
          detect: false,
          siteName: "",
          title: "",
          description: "",
          imageUrl: "",
        },
        tags: [],
        checkIn: null,
        privacy: POST_PRIVACY.PUBLIC,
        feeling: null,
      }),
    },
    initialFileList: {
      type: Array,
      default: () => [],
    },
    initialPreviewList: {
      type: Array,
      default: () => [],
      validator: (value) =>
        value.every((item) => ["type", "src"].every((key) => key in item)),
    },
    sharedPost: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    const { attachments = [] } = this.initialValues;

    return {
      editor: null,
      showTags: false,
      previewList: this.initialPreviewList || [],
      labelDropdrown: false,
      localActive: this.active,
      friendsListQuery: "",
      friendsList: this.initialValues.tags.map((item) => ({
        id: item.id,
        value: item.id,
        text: item.fullname,
        avatar: item.avatar ? item.avatar.low : "",
      })),
      friendsListLoading: false,
      tmpTagOptions: [],
      submitLoading: false,

      // Form submit data
      htmlContent: this.initialValues.htmlContent,
      link: this.initialValues.link,
      fileList: this.initialFileList || [],
      tags: this.initialValues.tags.map((item) => item.id),
      checkin: this.initialValues.checkIn,
      privacy: this.initialValues.privacy,
      feeling: this.initialValues.feeling,

      // Fetch link data
      linkDataFetching: false,
      linkDataFetched: this.initialValues.link.url ? true : false,
      linkDataFetchError: false,

      // Mention data
      mentionQuery: "",
      mentionList: [],
      mentionNavigatedIndex: 0,
      mentionPopup: null,
      mentionSuggestionRange: null,
      insertMention: () => {},
      mentionInfiniteId: +new Date() + 9999,
    };
  },

  computed: {
    ...mapGetters("auth", ["avatarUser"]),

    classes() {
      return {
        active: this.localActive,
        "post-editor--has-overlay": this.showOverlay,
        "post-editor--submit-loading": this.submitLoading,
      };
    },

    selectedTags() {
      return this.tags.map((item) => {
        const [resultItem = {}] = this.tmpTagOptions.filter(
          (i) => i.value === item
        );
        return resultItem;
      });
    },

    submitable() {
      const conditions = [
        !checkEditorEmpty(this.htmlContent),
        this.fileList.length > 0,
        this.feeling !== null,
        this.checkin !== null,
        this.link && this.link.url,
      ];
      return conditions.find((c) => !!c) ? true : false;
    },

    hasResults() {
      return this.mentionList && this.mentionList.length
        ? this.mentionList.length
        : 0;
    },
  },

  created() {
    this.POST_PRIVACY = Object.freeze(POST_PRIVACY);
    this.POST_PRIVACY_TEXT = Object.freeze(POST_PRIVACY_TEXT);
    this.POST_LABELS = Object.freeze(POST_LABELS);
    this.POST_TYPES = Object.freeze(POST_TYPES);
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
      content: this.htmlContent,
      extensions: [
        new Emoji(),
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
          emptyNodeText: "Đăng bài viết của bạn...",
        }),
        new PasteHandler({
          onPaste: this.handleEditorPaste,
        }),
        new Mention({
          // a list of all suggested items
          items: this.mentionList,
          // is called when a suggestion starts
          onEnter: debounce(
            async ({ items, query, range, command, virtualNode }) => {
              this.mentionQuery = query;
              this.mentionList = query
                ? await this.searchFriends(query)
                : await this.getFriends();

              this.$nextTick(() => {
                if (this.mentionList.length) {
                  this.mentionSuggestionRange = range;
                  this.renderPopup(virtualNode);
                  // we save the command for inserting a selected mention
                  // this allows us to call it inside of our custom popup
                  // via keyboard navigation and on click
                  this.insertMention = command;
                } else {
                  this.mentionSuggestionRange = null;
                  this.mentionNavigatedIndex = 0;
                  this.mentionPopup && this.destroyPopup();
                }
              });
            },
            300
          ),
          // is called when a suggestion has changed
          onChange: debounce(async ({ items, query, range, virtualNode }) => {
            this.mentionQuery = query;
            this.mentionList = query
              ? await this.searchFriends(query)
              : await this.getFriends();

            this.$nextTick(() => {
              if (this.mentionList.length) {
                this.mentionSuggestionRange = range;
                this.mentionNavigatedIndex = 0;
                this.renderPopup(virtualNode);
              } else {
                this.mentionSuggestionRange = null;
                this.mentionNavigatedIndex = 0;
                this.mentionPopup && this.destroyPopup();
              }
            });
          }),
          // is called when a suggestion is cancelled
          onExit: () => {
            // reset all saved values
            this.mentionQuery = null;
            this.mentionList = [];
            //
            this.mentionSuggestionRange = null;
            this.mentionNavigatedIndex = 0;
            this.destroyPopup();
          },
          // is called on every keyDown event while a suggestion is active
          onKeyDown: ({ event }) => {
            // pressing up arrow
            if (event.key === "ArrowUp") {
              this.upHandler();
              return true;
            }
            // pressing down arrow
            if (event.key === "ArrowDown") {
              this.downHandler();
              return true;
            }
            // pressing enter
            if (event.key === "Enter") {
              this.enterHandler();
              return true;
            }
            return false;
          },
          // is called when a suggestion has changed
          // this function is optional because there is basic filtering built-in
          // you can overwrite it if you prefer your own filtering
          // onFilter: (items, query) => {
          // }
        }),
      ],
      onUpdate: ({ getHTML }) => {
        this.htmlContent = getHTML();
      },
      onFocus: () => {
        this.showTags && (this.showTags = false);
      }
    });

    this.$nextTick(() => {
      window.addEventListener("beforeunload", this.handleBeforeUnload);
    });
  },

  beforeDestroy() {
    this.editor.destroy();
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  },

  watch: {
    active(newValue) {
      this.localActive = newValue;
    },

    localActive(newValue) {
      this.$emit("active-change", newValue);
    },

    friendsListQuery: async function (newValue) {
      this.friendsList = [];
      this.friendsListLoading = true;
      const friendsList = newValue
        ? await this.searchFriends(newValue)
        : await this.getFriends();
      this.friendsList = this.formatFriendsList(friendsList);
      this.friendsListLoading = false;
    },

    friendsList: {
      immediate: true,
      handler(newValue) {
        if (!newValue.length) return;
        const tmp = this.tmpTagOptions.concat(newValue);
        this.tmpTagOptions = uniqWith(tmp, (a, b) => a.value === b.value);
      },
    },
  },

  methods: {
    get,
    getEmojiName,
    getMentionIds,

    setActive(value) {
      this.localActive = value;
    },

    removeUploadItem(index, image) {
      this.fileList = this.fileList
        .slice(0, index)
        .concat(this.fileList.slice(index + 1, this.fileList.length));
      this.previewList = this.previewList
        .slice(0, index)
        .concat(this.previewList.slice(index + 1, this.previewList.length));
    },

    handleUploadChange(event) {
      // Check and show overlay
      if (this.showOverlay && !this.active) {
        this.setActive(true);
      }

      console.log("dattest handleUploadChange", event.target.files);

      // push to list
      Array.from(event.target.files).forEach((file) => {
        // if is preview a link -> remove that. Post prefer image than link
        !isEmpty(this.link) && this.removePreviewLink();

        this.fileList = [...this.fileList, file];
        getBase64(file, (fileSrc) => {
          const type = file.type.includes("image")
            ? ATTACHMENT_TYPES.IMAGE
            : file.type.includes("video")
            ? ATTACHMENT_TYPES.VIDEO
            : null;
          this.previewList.push({ type, src: fileSrc });
        });
      });
    },

    handleClickUploadImage() {
      this.$children[0].handleClickControl();
    },

    handleClickLabel(key) {
      this.feeling === key ? (this.feeling = null) : (this.feeling = key);
      this.labelDropdrown = false;
    },

    async getFriends() {
      try {
        const doGet = await new FriendsService(this.$axios)[
          ACTION_TYPE_BASE.LIST
        ]({
          params: { fetch_size: PAGE_SIZE.DEFAULT },
        });

        if (!doGet.error) {
          return doGet.data;
        } else {
          this.$toasted.error(doGet.message);
          return [];
        }
      } catch (error) {
        this.$toasted.error(error.message);
        return [];
      }
    },

    async searchFriends(name = "") {
      try {
        const doGet = await new FriendsService(this.$axios)[
          ACTION_TYPE_BASE.LIST
        ]({
          params: {
            fetch_type: FRIENDS_FETCH_TYPE.SEARCH,
            q: name,
            fetch_size: PAGE_SIZE.DEFAULT,
          },
        });

        if (!doGet.error) {
          return doGet.data;
        } else {
          this.$toasted.error(doGet.message);
          return [];
        }
      } catch (error) {
        this.$toasted.error(error.message);
        return [];
      }
    },

    handleSearchFriends: debounce(function (name) {
      this.friendsListQuery = name;
    }, 300),

    async handleFriendsVisibleChange(isVisible) {
      if (isVisible) {
        if (!this.friendsListQuery) {
          this.friendsListLoading = true;
          const friendsList = await this.getFriends();
          this.friendsList = this.formatFriendsList(friendsList);
          this.friendsListLoading = false;
        }
      } else {
        this.friendsList = [];
      }
    },

    /**
     * Submit data
     */
    async submit() {
      this.submitLoading = true;
      const text = this.editor.getHTML();
      const mentionIds = this.getMentionIds(text);
      const tags = [...this.tags, ...mentionIds];

      const params = {
        privacy: {
          scope: this.privacy,
        },
        text,
        feeling: this.feeling,
        tags: tags.length ? tags : null,
        link: this.link.url ? this.link : null,
        fileList: this.fileList,
      };

      const setLoading = (value) => {
        this.submitLoading = value;
      };

      this.$emit("submit", params, this.clear, setLoading);
    },

    /**
     * Clear editor data after emit 'submit' event
     */
    clear() {
      this.editor.setContent("");
      this.removePreviewLink();
      this.fileList = [];
      this.previewList = [];
      this.tags = [];
      this.checkin = null;
      this.privacy = POST_PRIVACY.PUBLIC;
      this.feeling = null;
      this.showTags = false;
    },

    /**
     * Paste handler
     */
    handleEditorPaste(view, event, slice) {
      const { clipboardData } = event;

      if (clipboardData.files && clipboardData.files.length) {
        // Handle paste file here
        return;
      }

      // Handle paste text
      const text = clipboardData.getData("text");
      const isUrl = isValidUrl(text);

      // If paste text is a string url
      if (isUrl) {
        // If no image in post and had not been fetched any link
        !this.fileList.length && !this.linkDataFetched && this.fetchLink(text);
      }
    },

    async fetchLink(url) {
      try {
        this.linkDataFetching = true;

        const getInfo = await new ScraperService(this.$axios)[
          ACTION_TYPE_BASE.LIST
        ]({
          params: { url },
        });

        this.linkDataFetching = false;
        this.linkDataFetched = true;

        if (!getInfo.error) {
          const {
            detect = false,
            url,
            site_name,
            title,
            description,
            image_url,
          } = getInfo.data;
          this.link = {
            detect: detect,
            url: url,
            siteName: site_name,
            title: title,
            description: description,
            imageUrl: image_url,
          };
        }
      } catch (error) {
        this.linkDataFetchError = true;
      }
    },

    removePreviewLink() {
      this.linkDataFetchError = false;
      this.linkDataFetched = false;
      this.link = {};
    },

    // navigate to the previous item
    // if it's the first item, navigate to the last one
    upHandler() {
      this.mentionNavigatedIndex =
        (this.mentionNavigatedIndex + this.mentionList.length - 1) %
        this.mentionList.length;
    },

    // navigate to the next item
    // if it's the last item, navigate to the first one
    downHandler() {
      this.mentionNavigatedIndex =
        (this.mentionNavigatedIndex + 1) % this.mentionList.length;
    },

    enterHandler() {
      const user = this.mentionList[this.mentionNavigatedIndex];
      if (user) {
        this.selectUser(user);
      }
    },

    // we have to replace our suggestion text with a mention
    // so it's important to pass also the position of your suggestion text
    selectUser(user) {
      this.insertMention({
        range: this.mentionSuggestionRange,
        attrs: {
          id: user.profile ? user.profile.id : "",
          label: user.profile ? user.profile.fullname : "",
        },
      });
      this.editor.focus();
    },

    // renders a popup with suggestions
    // tiptap provides a virtualNode object for using popper.js (or tippy.js) for popups
    renderPopup(node) {
      if (this.mentionPopup || !node) {
        return;
      }
      this.mentionPopup = tippy(node, {
        content: this.$refs.suggestions,
        trigger: "mouseenter",
        interactive: true,
        theme: "light",
        placement: "bottom-start",
        inertia: true,
        duration: [400, 200],
        showOnInit: true,
        arrow: true,
        // arrowType: "round",
        onHidden: (instance) => {
          this.destroyPopup();
        },
      });
      // we have to update tippy whenever the DOM is updated
      if (MutationObserver) {
        this.observer = new MutationObserver(() => {
          this.mentionPopup.popperInstance.scheduleUpdate();
        });
        this.observer.observe(this.$refs.suggestions, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      }
    },

    destroyPopup() {
      if (this.mentionPopup) {
        this.mentionPopup.destroy();
        this.mentionPopup = null;
      }
      if (this.observer) {
        this.observer.disconnect();
      }
    },

    toggleTags() {
      if (this.showOverlay && !this.active) {
        this.setActive(true);
      }

      if (this.active) {
        this.showTags = !this.showTags;
      } else {
        this.showTags = true;
      }

      this.$nextTick(() => {
        this.showTags && this.$refs.selectTags.handleClickSelected(true);
      });
    },

    handleLabelVisibleChange(visible) {
      if (this.showOverlay && !this.active) {
        this.setActive(true);
      }
    },

    handleClickEditor() {
      if (this.showOverlay && !this.active) {
        this.setActive(true);
      }
    },

    formatFriendsList(friendsList = []) {
      return friendsList.map((item) => ({
        id: item.profile ? item.profile.id : "",
        value: item.profile ? item.profile.id : "",
        text: item.profile ? item.profile.fullname : "",
        avatar: get(item, "profile.avatar.low"),
      }));
    },

    handleBeforeUnload(event) {
      const condition = [
        this.submitLoading,
        this.editor && !checkEditorEmpty(this.htmlContent),
        this.link.url,
        this.tags.length,
        this.fileList.length,
        this.feeling,
      ];

      if (condition.find((item) => !!item)) {
        event.preventDefault();
        event.returnValue = "";
      }
    },

    addEmoji(emoji) {
      console.log('addEmoji', emoji)
      this.editor && this.editor.commands.emoji(emoji.colons)
    }
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/timeline/_suggestion-list.scss";
@import "~/assets/scss/components/post-editor/_post-editor.scss";
</style>
