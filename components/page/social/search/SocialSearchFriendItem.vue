<template>
  <div class="d-flex align-items-center">
    <a @click.prevent="handClickAccount(item.profile.id)"><app-avatar
      :src="
        item.profile && item.profile.avatar && item.profile.avatar.low
          ? item.profile.avatar.low
          : ''
      "
      size="55"
    /></a>
    <div
      class="d-flex flex-column ml-3 justify-content-center"
      style="line-height: 20px;"
    >
      <a @click.prevent="handClickAccount(item.profile.id)"><h6>{{ item.profile ? item.profile.fullname : "" }}</h6></a>
      <p
        class="text-gray-3"
        v-if="
          item.relationships_status &&
            item.relationships_status.friend == 'ACTIVE'
        "
      >
        Bạn bè
      </p>
      <!-- <p v-if="item.school">Học tại {{ item.school }}</p> -->
      <p v-if="item.profile && item.profile.address">
        {{ item.profile && item.profile.address }}
      </p>
      <!-- <p v-if="item.work">Làm việc tại {{ item.work }}</p> -->
    </div>
    <div class="ml-auto">
      <app-button
        color="white"
        size="sm"
        class="d-flex align-items-center px-4"
        v-if="checkIcon == 'ACTIVE'"
        @click.prevent="handleSendMessage(item)"
      >
        <IconMessage24px class="mr-2" height="13" />
        Gửi tin nhắn
      </app-button>

      <app-button
        size="sm"
        class="d-flex align-items-center px-4"
        v-if="checkIcon == 'NONE'"
        @click.prevent="handleAddFriend(item.profile.id)"
      >
        <IconGroupAdd24px class="mr-2" height="16" />
        <span>Thêm bạn bè</span>
      </app-button>

      <v-popover :trigger="'hover'">
        <app-button
          size="sm"
          class="d-flex align-items-center px-4"
          v-if="checkIcon == 'INVITING'"
        >
          <IconGroupAdd24px class="mr-2" height="16" />
          <span>Trả lời lời mời kết bạn</span>
        </app-button>

        <app-button
          size="sm"
          class="d-flex align-items-center px-4"
          v-if="checkIcon == 'PENDING'"
        >
          <IconPersonCancel class="mr-2" height="16" />
          <span>Đã gửi lời mời kết bạn</span>
        </app-button>

        <template
          slot="popover"
          v-if="checkIcon == 'INVITING' || checkIcon == 'PENDING'"
        >
          <div class="account-friend-item__dropdown">
            <a
              href
              class="account-friend-item__dropdown-item"
              v-if="checkIcon == 'INVITING'"
              @click.prevent="setAcceptFriend(true, item.profile.id)"
            >
              <span>Xác nhận</span>
            </a>
            <a
              href
              class="account-friend-item__dropdown-item"
              v-if="checkIcon == 'INVITING'"
              @click.prevent="setAcceptFriend(false, item.profile.id)"
            >
              <span>Xoá yêu cầu</span>
            </a>
            <a
              href
              class="account-friend-item__dropdown-item"
              v-if="checkIcon == 'PENDING'"
              @click.prevent="unFriend(item.profile.id)"
            >
              <span>Huỷ lời mời</span>
            </a>
          </div>
        </template>
      </v-popover>
    </div>
  </div>
</template>

<script>
import IconMessage24px from "~/assets/svg/v2-icons/message_24px.svg?inline";
import IconGroupAdd24px from "~/assets/svg/v2-icons/group_add_24px.svg?inline";
import IconPersonCancel from "~/assets/svg/v2-icons/person_cancel_24px.svg?inline";
import IconSubscriptions from "~/assets/svg/v2-icons/subscriptions_24px.svg?inline";
import IconUnSubscriptions from "~/assets/svg/icons/unsubscription.svg?inline";
import IconCancelRequest from "~/assets/svg/v2-icons/cancel-request.svg?inline";
import {
  BASE as ACTION_BASE,
  ACCOUNT_FRIENDS as ACTION_ACCOUNT_FRIENDS,
} from "~/utils/action-types";
import FriendsService from "~/services/social/Friends";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  components: {
    IconMessage24px,
    IconGroupAdd24px,
    IconPersonCancel,
    IconSubscriptions,
    IconUnSubscriptions,
    IconCancelRequest,
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      checkIcon: "NONE",
    };
  },

  created() {
    this.checkIcon =
      (this.item.relationships_status &&
        this.item.relationships_status.friend) ||
      "NONE";
  },

  methods: {
    ...mapActions("social/friend", ["addFriend"]),

    handleSendMessage(data) {
      const userId = (data.profile && data.profile.id) || "";
      this.$router.push(`/messages/t/${userId}`);
    },

    handClickAccount(id) {
      this.$router.push(`/social/account/${id}`);
    },

    handleAddFriend(id) {
      console.log("[handleAddFriend]", id);
      this.addFriend({
        friend_id: id,
      }).then((res) => {
        console.log("res", res);
        if (res.data) {
          this.checkIcon = "PENDING";
        }
      });
    },

    async setAcceptFriend(isAccept, uuid) {
      try {
        const result = await new FriendsService(this.$axios)[ACTION_BASE.EDIT](
          uuid,
          {
            accept: isAccept,
          }
        );

        if (!result.error) {
          this.checkIcon = "ACTIVE";
        } else {
          this.$toasted.error(result.error.message);
        }
      } catch (error) {
        this.$toasted.error(error.message);
        throw error;
      }
    },

    async unFriend(uuid, setLoading) {
      try {
        setLoading && setLoading(true);

        const result = await new FriendsService(this.$axios)[
          ACTION_BASE.DELETE
        ](uuid);
        if (!result.error) {
          this.checkIcon = "NONE";
        } else {
          this.$toasted.error(result.error.message);
        }

        setLoading && setLoading(false);
      } catch (error) {
        setLoading && setLoading(false);
        this.$toasted.error(error.message);
        throw error;
      }
    },
  },
};
</script>

<style></style>
