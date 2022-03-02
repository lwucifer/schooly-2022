<template>
  <div class="psc mt-3">
    <template v-if="post.allow_access || post.status !== 'DELETED'">
      <slot name="media-content" :attachments="post.attachments || []" :sharedPost="post" />

      <div class="psc__content">
        <div class="psc__top">
          <app-avatar
            class="psc__avatar"
            nuxt
            :to="`/social/post/${post.id}`"
            size="sm"
            :src="
              post.author && post.author.avatar ? post.author.avatar.low : null
            "
          ></app-avatar>

          <!--prettyhtml-ignore-->
          <!-- prettier-ignore -->
          <div class="psc__top-row psc__top-row--name">
            <n-link
  :to="`/social/post/${post.id}`"
  class="psc__name"
>{{ post.author && post.author.fullname ? post.author.fullname : '' }}</n-link>

            <template v-if="post.feeling">
              <!-- <strong v-html="$emoji.replace_colons(post.feeling)"></strong> -->
              <client-only>
                <emoji :emoji="post.feeling" :size="20"/>
              </client-only><!--
              --> đang cảm thấy <!--
              -->{{ getEmojiName(post.feeling).toLowerCase() }}<!--
            --></template><!--
            --><PostTags v-if="post.tags && post.tags.length" :tags="post.tags || []" /><!--
            --><template v-if="post.feeling || (post.tags && post.tags.length)">.</template>
          </div>

          <div class="psc__top-row d-flex">
            <n-link v-if="post.created_at" :to="`/social/post/${post.id}`" class="psc__date">
              {{
              post.created_at | getLocalDateTime | moment("from")
              }}
            </n-link>
            <span
              v-if="post.privacy && typeof post.privacy === 'object'"
              class="psc__privacy"
              :title="POST_PRIVACY_TEXT[post.privacy.scope]"
            >
              <IconGlobe
                v-if="post.privacy.scope === POST_PRIVACY.PUBLIC"
                class="icon fill-opacity-1"
              />
              <IconSupervisorAccount
                v-if="post.privacy.scope === POST_PRIVACY.FRIENDS"
                class="icon fill-opacity-1"
              />
              <IconLock
                v-if="post.privacy.scope === POST_PRIVACY.ONLY_ME"
                class="icon fill-opacity-1"
              />
            </span>
          </div>
        </div>

        <div class="psc__desc">
          <div
            v-if="!checkEditorEmpty(post.text)"
            v-html="post.text"
            class="post__post-desc"
            :class="{
            'post__post-desc--truncated': showReadMore && !showFullText
          }"
          ></div>
          <a
            v-if="showReadMore"
            href
            @click.prevent
            class="post__post-readmore"
            @click="showFullText = !showFullText"
          >{{ showFullText ? `Thu gọn` : `Xem thêm` }}</a>
        </div>
      </div>
    </template>

    <div v-else class="text-center text-gray mb-2">Bài viết không còn tồn tại</div>
  </div>
</template>

<script>
import { POST_PRIVACY_TEXT, POST_PRIVACY } from "~/utils/constants";
import { getEmojiName } from "~/utils/common";
import { checkEditorEmpty } from "~/utils/validations";
import PostTags from "~/components/page/timeline/post/PostTags";
import IconGlobe from "~/assets/svg/icons/globe.svg?inline";
import IconLock from "~/assets/svg/icons/lock_24px.svg?inline";
import IconSupervisorAccount from "~/assets/svg/icons/supervisor_account_24px.svg?inline";

export default {
  components: {
    PostTags,
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
      showFullText: false,
    };
  },

  computed: {
    showReadMore() {
      const { text = "" } = this.post;
      const stripedHtml = text ? text.replace(/<[^>]+>/g, "") : "";
      return stripedHtml.length > 400;
    },
  },

  created() {
    this.POST_PRIVACY_TEXT = Object.freeze(POST_PRIVACY_TEXT);
    this.POST_PRIVACY = Object.freeze(POST_PRIVACY);
  },

  methods: {
    getEmojiName,
    checkEditorEmpty,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/post/_post-share-content.scss";
</style>
