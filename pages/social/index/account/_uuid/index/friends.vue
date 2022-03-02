<template>
  <AccountFriendsMenu>
    <template v-slot:content>
      <div v-if="$fetchState.pending" class="row py-4 saf-row">
        <div class="col-md-6" v-for="i in 2" :key="i">
          <VclList class="bg-white w-100" />
        </div>
      </div>

      <div v-else-if="$fetchState.error" class="text-center mt-4">{{ $fetchState.error.message }}</div>

      <template v-else>
        <div class="row saf-row">
          <div v-for="(friend) in friendsList" :key="friend.id" class="col-md-6 saf-col">
            <AccountFriendItem
              :uuid="friend.profile ? friend.profile.id : ''"
              :link="`/social/account/${friend.profile ? friend.profile.id : ''}`"
              :name="friend.profile ? friend.profile.fullname : ''"
              :avatar="friend.profile && friend.profile.avatar ? friend.profile.avatar.low : ''"
              :mutual="friend.total_mutual_friend"
              :is-follow="friend.relationships_status ? friend.relationships_status.follow : false"
              :is-friend="friend.relationships_status ? friend.relationships_status.friend === SOCIAL_FRIEND_STATUS.ACTIVE : false"
              :is-inviting="friend.relationships_status ? friend.relationships_status.friend === SOCIAL_FRIEND_STATUS.INVITING : false"
              :is-pending="friend.relationships_status ? friend.relationships_status.friend === SOCIAL_FRIEND_STATUS.PENDING : false"
              :show-actions="friend.profile ? friend.profile.id !== $store.getters['auth/uuidUser'] : true"
              @add-friend="addFriend"
              @unfriend="openModalConfirmUnfriend"
              @cancel-request-friend="unfriend"
              @follow="followFriend"
              @unfollow="unfollowFriend"
            />
          </div>
        </div>

        <div v-if="!friendsList.length" class="text-center">Danh sách bạn bè trống.</div>

        <client-only>
          <infinite-loading
            v-if="friendsList.length >= SOCIAL_DEFAULT_FETCH_SIZE"
            @infinite="infiniteHandler"
          >
            <template slot="spinner">
              <div class="row py-4 saf-row">
                <div class="col-md-6" v-for="i in 2" :key="i">
                  <VclList class="bg-white w-100" />
                </div>
              </div>
            </template>
            <template slot="no-more">Hết danh sách.</template>
            <template slot="no-results">Danh sách bạn bè trống.</template>
          </infinite-loading>
        </client-only>
      </template>

      <app-modal-confirm
        v-model="modalConfirmUnfriend"
        :title="`Huỷ kết bạn với ${modalConfrimUnfriendData.name}?`"
        :confirm-loading="modalConfirmUnfriendLoading"
        @ok="unfriend(modalConfrimUnfriendData.uuid)"
        @cancel="closeModalConfirmUnfriend"
        @close="closeModalConfirmUnfriend"
      />
    </template>
  </AccountFriendsMenu>
</template>

<script>
import { get } from "lodash";
import { mapActions } from "vuex";
import { VclList } from "vue-content-loading";
import {
  BASE as ACTION_BASE,
  ACCOUNT_FRIENDS as ACTION_ACCOUNT_FRIENDS,
  SOCIAL_ACCOUNT_PROFILE as ACTION_SOCIAL_ACCOUNT_PROFILE,
} from "~/utils/action-types";
import {
  FRIENDS_FETCH_TYPE,
  SOCIAL_DEFAULT_FETCH_SIZE,
  SOCIAL_FRIEND_STATUS,
} from "~/utils/constants";
import { SOCIAL_USERS as ENDPOINT_SOCIAL_USERS } from "~/utils/endpoints";
import FriendsService from "~/services/social/Friends";
import FollowService from "~/services/social/Follow";
import AccountFriendsMenu from "~/components/page/social/account/AccountFriendsMenu";
import AccountFriendItem from "~/components/page/social/account/AccountFriendItem";

export default {
  components: {
    AccountFriendsMenu,
    AccountFriendItem,
    VclList,
  },

  data() {
    return {
      friendsList: [],
      page: 1,
      lastUuidParam: this.$route.params.uuid,
      modalConfirmUnfriend: false,
      modalConfirmUnfriendLoading: false,
      modalConfrimUnfriendData: {}
    };
  },

  async fetch() {
    const result = await this.getFriends();

    if (!result.error) {
      this.friendsList = result.data || [];
    } else {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error(result.error.message);
    }
  },

  fetchOnServer: false,

  activated() {
    if (this.lastUuidParam !== this.$route.params.uuid) {
      this.lastUuidParam = this.$route.params.uuid;
      this.$fetch();
      return;
    }

    if (this.$fetchState.timestamp <= Date.now() - 20000) {
      this.$fetch();
    }
  },

  created() {
    this.SOCIAL_DEFAULT_FETCH_SIZE = SOCIAL_DEFAULT_FETCH_SIZE;
    this.SOCIAL_FRIEND_STATUS = SOCIAL_FRIEND_STATUS;
  },

  methods: {
    get,

    ...mapActions("social/account/profile", {
      getTotalFriends: ACTION_SOCIAL_ACCOUNT_PROFILE.GET_USER_TOTAL_FRIENDS,
    }),

    async getFriends(page = 0) {
      try {
        const params = {
          fetch_size: SOCIAL_DEFAULT_FETCH_SIZE,
          skip_page: page,
        };
        const currentUserUuid = this.$store.getters["auth/uuidUser"];

        const result =
          currentUserUuid === this.$route.params.uuid
            ? await new FriendsService(this.$axios)[ACTION_BASE.LIST]({
                params,
              })
            : await this.$axios.$get(
                `${ENDPOINT_SOCIAL_USERS}/${this.$route.params.uuid}/friends`,
                {
                  params,
                }
              );

        return result;
      } catch (error) {
        this.$toasted.error(error.message);
        throw error;
      }
    },

    async infiniteHandler($state) {
      const result = await this.getFriends(this.page);

      if (!result.error) {
        if (result.data && result.data.length) {
          this.friendsList = [...this.friendsList, ...(result.data || [])];
          $state.loaded();
          this.page += 1;
        } else {
          $state.complete();
        }

        return;
      }

      $state.complete();
    },

    async addFriend(uuid, setLoading) {
      try {
        setLoading(true);
        const result = await new FriendsService(this.$axios)[ACTION_BASE.ADD]({
          friend_id: uuid,
        });

        if (!result.error) {
          this.friendsList = this.friendsList.map((friend) => {
            if (friend.profile && friend.profile.id === uuid) {
              return {
                ...friend,
                relationships_status: {
                  ...(friend.relationships_status || {}),
                  friend: SOCIAL_FRIEND_STATUS.PENDING,
                },
              };
            }
            return friend;
          });
        } else {
          this.$toasted.error(result.error.message);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        this.$toasted.error(error.message);
        throw error;
      }
    },

    async unfriend(uuid, setLoading) {
      try {
        typeof setLoading === 'function' && setLoading(true);
        this.modalConfirmUnfriendLoading = true;

        const result = await new FriendsService(this.$axios)[
          ACTION_BASE.DELETE
        ](uuid);

        if (!result.error) {
          this.getTotalFriends({ uuid: this.$route.params.uuid });
          this.friendsList = this.friendsList.map((friend) => {
            if (friend.profile && friend.profile.id === uuid) {
              return {
                ...friend,
                relationships_status: {
                  ...(friend.relationships_status || {}),
                  friend: SOCIAL_FRIEND_STATUS.NONE,
                },
              };
            }
            return friend;
          });
        } else {
          this.$toasted.error(result.error.message);
        }

        this.closeModalConfirmUnfriend();
        this.modalConfirmUnfriendLoading = false;
        typeof setLoading === 'function' && setLoading(false);
      } catch (error) {
        this.closeModalConfirmUnfriend();
        this.modalConfirmUnfriendLoading = false;
        typeof setLoading === 'function' && setLoading(false);
        this.$toasted.error(error.message);
        throw error;
      }
    },

    async followFriend(uuid) {
      try {
        const result = await new FollowService(this.$axios)[ACTION_BASE.ADD]({
          target_user_id: uuid,
        });

        if (!result.error) {
          this.friendsList = this.friendsList.map((friend) => {
            if (friend.profile.id === uuid) {
              return {
                ...friend,
                relationships_status: {
                  ...(friend.relationships_status || {}),
                  follow: true,
                },
              };
            }
            return friend;
          });
        } else {
          this.$toasted.error(result.error.message);
        }

        return result;
      } catch (error) {
        this.$toasted.error(error.message);
        throw error;
      }
    },

    async unfollowFriend(uuid) {
      try {
        const result = await new FollowService(this.$axios)[
          ACTION_BASE.DELETE_PAYLOAD
        ]({
          target_user_id: uuid,
        });

        if (!result.error) {
          this.friendsList = this.friendsList.map((friend) => {
            if (friend.profile.id === uuid) {
              return {
                ...friend,
                relationships_status: {
                  ...(friend.relationships_status || {}),
                  follow: false,
                },
              };
            }
            return friend;
          });
        } else {
          this.$toasted.error(result.error.message);
        }

        return result;
      } catch (error) {
        this.$toasted.error(error.message);
        throw error;
      }
    },

    openModalConfirmUnfriend(uuid, name) {
      this.modalConfrimUnfriendData = { uuid, name};
      this.$nextTick(() => {
        this.modalConfirmUnfriend = true;
      })
    },

    closeModalConfirmUnfriend() {
      this.modalConfrimUnfriendData = {};
      this.modalConfirmUnfriend = false;
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/pages/social/_social-account-friends.scss";
</style>