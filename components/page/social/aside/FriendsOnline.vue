<template>
  <div>
    <MessagesFriendItem
      v-for="(item, index) in friendOnlines"
      :key="index"
      :id="item.id"
      :name="item.fullname"
      :avatar="item.avatar ? item.avatar.low : ''"
      :to="item.room_id ? `/messages/t/${item.room_id}` : `/messages/u/${item.id}`"
      avatar-size="sm"
      online
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { SOCIAL_FRIEND_TIMELINE as ACTION_SOCIAL_FRIEND_TIMELINE } from "~/utils/action-types";
import MessagesFriendItem from "~/components/page/social/messages/MesagesFriendItem";

export default {
  components: {
    MessagesFriendItem,
  },

  computed: {
    ...mapState("social/friend", ["friendOnlines"]),
  },

  async fetch() {
    await this.$store.dispatch(
      `social/friend/${ACTION_SOCIAL_FRIEND_TIMELINE.GET_FRIEND_ONLINE}`
    );
  },

  fetchOnServer: false
};
</script>
