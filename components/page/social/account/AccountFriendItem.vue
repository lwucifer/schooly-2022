<template>
  <div class="account-friend-item">
    <app-avatar
      class="account-friend-item__avatar"
      :src="avatar"
      size="5.5rem"
      :alt="name"
      nuxt
      :to="link || ''"
    />

    <div class="account-friend-item__right">
      <h5 class="account-friend-item__name">
        <n-link :to="link || ''">{{ name }}</n-link>
      </h5>

      <!--prettyhtml-ignore-->
      <!-- prettier-ignore -->
      <div v-if="type === 'birthday'" class="account-friend-item__birthday">
        <IconCake class="icon fill-opacity-1" />
          {{ $moment(birthday).year(new Date().getFullYear()) | moment('calendar', null, {
              sameDay: '[Hôm nay]',
              nextDay: '[Ngày mai]',
              nextWeek: 'dddd [tuần tới]',
              lastDay: '[Hôm qua]',
              lastWeek: 'dddd [tuần trước]',
              sameElse: 'DD/MM/YYYY'
            })
          }}
      </div>

      <div v-else-if="showActions" class="account-friend-item__mutual">{{ mutual }} bạn chung</div>

      <template v-if="showActions">
        <div v-if="isInviting">
          <app-button
            size="xs"
            class="mr-3"
            :loading="acceptLoading"
            :disabled="denyLoading"
            @click="acceptFriend"
          >
            <IconDone class="mr-2 icon" />Đồng ý
          </app-button>

          <app-button
            class="account-friend-item__btn-decline"
            color="white"
            size="xs"
            :loading="denyLoading"
            :disabled="acceptLoading"
            @click="denyAcceptFriend"
          >
            <IconClose class="mr-2 icon" />Hủy
          </app-button>
        </div>

        <client-only v-else-if="isFriend">
          <v-popover :open.sync="popoverOpen">
            <app-button class="account-friend-item__btn-friend" size="xs" color="white">Bạn bè</app-button>
            <template slot="popover">
              <div class="account-friend-item__dropdown">
                <a
                  v-if="isFollow"
                  href
                  class="account-friend-item__dropdown-item"
                  @click.prevent="popoverOpen = false; $emit('unfollow', uuid)"
                >
                  <IconUnSubscriptions class="icon fill-opacity-1" />
                  <span>Bỏ theo dõi</span>
                </a>
                <a
                  v-else
                  href
                  class="account-friend-item__dropdown-item"
                  @click.prevent="popoverOpen = false; $emit('follow', uuid)"
                >
                  <IconSubscriptions class="icon fill-opacity-1" />
                  <span>Theo dõi</span>
                </a>
                <a
                  href
                  class="account-friend-item__dropdown-item"
                  @click.prevent="popoverOpen = false; unfriend()"
                >
                  <IconCancelRequest class="icon fill-opacity-1" />
                  <span>Hủy kết bạn</span>
                </a>
              </div>
            </template>
          </v-popover>
        </client-only>

        <app-button
          v-else-if="isPending"
          size="xs"
          :loading="cancelRequestLoading"
          @click="cancelRequestFriend"
        >Huỷ lời mời kết bạn</app-button>

        <app-button v-else size="xs" :loading="addFriendLoading" @click="addfriend">Thêm bạn bè</app-button>
      </template>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { DATE_FORMAT, DATE_BIRTHDAY } from "~/utils/config";
import IconSubscriptions from "~/assets/svg/v2-icons/subscriptions_24px.svg?inline";
import IconUnSubscriptions from "~/assets/svg/icons/unsubscription.svg?inline";
import IconCancelRequest from "~/assets/svg/v2-icons/cancel-request.svg?inline";
import IconDone from "~/assets/svg/v2-icons/done_24px.svg?inline";
import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline";
import IconCake from "~/assets/svg/v2-icons/cake_24px.svg?inline";

export default {
  components: {
    IconSubscriptions,
    IconUnSubscriptions,
    IconCancelRequest,
    IconDone,
    IconClose,
    IconCake,
  },

  props: {
    type: {
      type: String,
      default: "default",
      validator: (value) =>
        ["default", "birthday", "request"].indexOf(value > -1),
    },
    uuid: String,
    name: String,
    avatar: String,
    birthday: String,
    mutual: Number,
    link: String,
    isFollow: Boolean,
    isFriend: Boolean,
    isInviting: Boolean, // is this friend send friend request to current logged user
    isPending: Boolean, // is current logged user send friend request to this friend
    showActions: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      acceptLoading: false,
      denyLoading: false,
      addFriendLoading: false,
      cancelRequestLoading: false,
      popoverOpen: false,
    };
  },

  methods: {
    acceptFriend() {
      const setLoading = (value) => {
        this.acceptLoading = value;
      };
      this.$emit("accept-friend", this.uuid, setLoading);
    },

    denyAcceptFriend() {
      const setLoading = (value) => {
        this.denyLoading = value;
      };
      this.$emit("deny-accept-friend", this.uuid, setLoading);
    },

    unfriend() {
      this.$emit("unfriend", this.uuid, this.name);
    },

    addfriend() {
      const setLoading = (value) => {
        this.addFriendLoading = value;
      };
      this.$emit("add-friend", this.uuid, setLoading);
    },

    cancelRequestFriend() {
      const setLoading = (value) => {
        this.cancelRequestLoading = value;
      };
      this.$emit("cancel-request-friend", this.uuid, setLoading);
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/social/account/_account-friend-item.scss";
</style>