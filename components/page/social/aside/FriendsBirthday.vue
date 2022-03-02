<template>
  <div class="aside-birthday">
    <div class="aside-birthday__img">
      <IconSocialBirthday />
    </div>
    <div class="aside-birthday__text text-dark">
      <span v-for="(item, index) in friendBirthdays" :key="index" class="font-weight-medium">
        {{ item.profile && item.profile.fullname ? item.profile.fullname : '' }}
        <span
          v-if="index < friendBirthdays.length-1"
        >&nbsp;và&nbsp;</span>
      </span>
      có sinh nhật vào hôm nay
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { SOCIAL_FRIEND_TIMELINE as ACTION_SOCIAL_FRIEND_TIMELINE } from "~/utils/action-types";
import { FRIENDS_FETCH_TYPE, PAGE_SIZE } from "~/utils/constants";
import IconSocialBirthday from "~/assets/svg/icons/social-birthday.svg?inline";

export default {
  components: {
    IconSocialBirthday,
  },

  computed: {
    ...mapState("social/friend", ["friendBirthdays"]),
  },

  async fetch() {
    await this.$store.dispatch(
      `social/friend/${ACTION_SOCIAL_FRIEND_TIMELINE.GET_FRIEND_BIRTHDAY}`, {
        fetch_type: FRIENDS_FETCH_TYPE.BIRTHDAY_TODAY,
        fetch_size: PAGE_SIZE.DEFAULT,
      }
    );
  },
  
  fetchOnServer: false
};
</script>
