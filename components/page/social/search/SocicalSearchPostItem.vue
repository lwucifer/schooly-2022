<template>
  <div class="socical-search-post-item">
    <div class="d-flex align-items-center">
      <a @click.prevent="handClickAccount(item.author.id)"
        ><app-avatar
          :src="
            item.author && item.author.avatar && item.author.avatar.low
              ? item.author.avatar.low
              : ''
          "
          size="55"
      /></a>
      <div class="d-flex flex-column ml-3">
        <a @click.prevent="handClickAccount(item.author.id)"
          ><h6 class="mb-3">
            {{ (item.author && item.author.fullname) || "" }}
          </h6></a
        >
        <p
          v-if="
            item.author &&
              item.author.relationships_status &&
              item.author.relationships_status.friend == 'ACTIVE'
          "
        >
          Bạn bè
        </p>
      </div>
    </div>
    <div class="sspi__content mt-4">
      <div class="sspi__desc" @click.prevent="handClickSearchPost(item.id)">
        <p>
          {{ item.text || "" }}
        </p>
      </div>
      <div class="sspi__img">
        <a  @click.prevent="handClickSearchPost(item.id)"><img
          :src="
            item.author && item.author.cover && item.author.cover.low
              ? item.author.cover.low
              : ''
          "
          height="100"
          width="100"
        /></a>
      </div>
    </div>
    <div class="d-flex mt-3">
      <button
        class="d-flex align-items-center"
        @click.prevent="handClickSearchPost(item.id)"
      >
        <IconCardsHeart class="mr-3" />
        {{ (item.counter && item.counter.reaction) || 0 }} Lượt thích
      </button>
      <div class="d-flex ml-auto">
        <button class="mr-4" @click.prevent="handClickSearchPost(item.id)">
          {{ (item.counter && item.counter.comment) || 0 }} bình luận
        </button>
        <button @click.prevent="handClickSearchPost(item.id)">
          {{ (item.counter && item.counter.share) || 0 }} lượt chia sẻ
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import IconCardsHeart from "~/assets/svg/v2-icons/cards-heart.svg?inline";
export default {
  components: {
    IconCardsHeart,
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },

  methods: {
    handClickAccount(id) {
      this.$router.push(`/social/account/${id}`);
    },
    handClickSearchPost(id) {
      this.$router.push(`/social/post/${id}`);
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/social/_social-search-post-item.scss";
</style>
