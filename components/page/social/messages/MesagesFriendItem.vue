<template>
  <div class="messages-friend-item">
    <div class="messages-friend-item__avatar">
      <app-avatar :src="avatar" :size="avatarSize" nuxt :to="to" />
      <div v-if="online" class="messages-friend-item__dot"></div>
    </div>
    <n-link :to="to" class="messages-friend-item__name">{{ name }}</n-link>
    <button
      v-if="showButtonAdd && !checkIcon"
      type="button"
      class="messages-friend-item__button"
      :class="{ 'messages-friend-item__button--add': !checkIcon }"
      @click="handleAddFriend(id)"
    >
      <IconPersonAdd class="icon fill-opacity-1" />
      <!-- <IconPersonCancel v-else class="icon fill-opacity-1" /> -->
    </button>
    <button
      v-if="showButtonAdd && checkIcon"
      type="button"
      class="messages-friend-item__button"
      :class="{ 'messages-friend-item__button--add': !checkIcon }"
      @click="handleUnFriend(id)"
    >
      <!-- <IconPersonAdd v-if="!checkIcon" class="icon fill-opacity-1" /> -->
      <IconPersonCancel class="icon fill-opacity-1" />
    </button>
  </div>
</template>

<script>
import IconPersonAdd from "~/assets/svg/v2-icons/person_add_24px.svg?inline";
import IconPersonCancel from "~/assets/svg/v2-icons/person_cancel_24px.svg?inline";
import { mapState, mapActions } from "vuex";
import { SOCIAL_FRIEND_TIMELINE as ACTION_SOCIAL_FRIEND_TIMELINE } from "~/utils/action-types";

export default {
  components: {
    IconPersonAdd,
    IconPersonCancel,
  },

  props: {
    avatarSize: String,
    online: Boolean,
    showButtonAdd: Boolean,
    id: String,
    name: String,
    avatar: String,
    to: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      checkIcon: false,
    };
  },
  methods: {
    ...mapActions("social/friend", {
      addFriend: ACTION_SOCIAL_FRIEND_TIMELINE.ADD_FRIEND,
      cancelFriend: ACTION_SOCIAL_FRIEND_TIMELINE.CANCEL_FRIEND,
    }),

    handleAddFriend(friendID) {
      console.log("[handleAddFriend]", friendID);
      this.addFriend({
        friend_id: friendID,
      }).then((result) => {
        if (result.data) {
          this.checkIcon = !this.checkIcon;
        }
      });
    },
    handleUnFriend(friendID) {
      console.log("[handleUnFriend]", friendID);
      this.cancelFriend(friendID).then((result) => {
        if (!result.error) {
          this.checkIcon = !this.checkIcon;
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/social/_messages-friend-item.scss";
</style>
