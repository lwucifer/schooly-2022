<template>
  <div>
    <MessagesFriendItem
      v-for="(item, index) in friendSuggestions"
      :key="index"
      :id="item.profile ? item.profile.id : ''"
      :name="item.profile ? item.profile.fullname : ''"
      :avatar="item.profile && item.profile.avatar ? item.profile.avatar.low : ''"
      :to="`/social/account/${item.profile.id}`"
      show-button-add
      avatar-size="sm"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { SOCIAL_FRIEND_TIMELINE as ACTION_SOCIAL_FRIEND_TIMELINE } from "~/utils/action-types";
import { FRIENDS_FETCH_TYPE, PAGE_SIZE } from "~/utils/constants";
import MessagesFriendItem from "~/components/page/social/messages/MesagesFriendItem";

export default {
  components: {
    MessagesFriendItem,
  },

  computed: {
    ...mapState("social/friend", ["friendSuggestions"]),
  },

  async fetch() {
    await this.$store.dispatch(
      `social/friend/${ACTION_SOCIAL_FRIEND_TIMELINE.GET_FRIEND_SUGGESTION}`, {
        fetch_type: FRIENDS_FETCH_TYPE.SUGGESTION,
        fetch_size: PAGE_SIZE.DEFAULT,
      }
    );
  },

  fetchOnServer: false,

};
</script>
