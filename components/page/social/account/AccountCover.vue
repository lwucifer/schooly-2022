<template>
  <div class="sac">
    <div class="sac__cover" :class="{ 'disabled': coverDisabled }">
      <vue-content-loading
        v-if="fetchingInfo"
        class="sac__loading sac__loading--cover"
        viewBox="0 0 610 210"
        :width="610"
        :height="210"
      >
        <rect x="0" y="0" rx="0" ry="0" width="610" height="210" />
      </vue-content-loading>

      <template v-else>
        <img :src="socialProfile.cover ? socialProfile.cover.high : ''" alt />
        <app-upload
          v-if="$route.params.uuid === $store.getters['auth/uuidUser']"
          accept="image/*, image/heic, image/heif"
          class="sac__cover-upload"
          :disabled="coverDisabled"
          @change="handleUploadCoverChange"
        >
          <IconCameraAlt class="icon fill-opacity-1" />Thay đổi ảnh bìa
        </app-upload>
      </template>
    </div>

    <div class="sac__bottom">
      <div class="sac__avatar-wrapper" :class="{ 'disabled': avatarDisabled }">
        <vue-content-loading
          v-if="fetchingInfo"
          class="sac__loading sac__loading--avatar"
          viewBox="0 0 143 143"
          :width="143"
          :height="143"
        >
          <rect x="0" y="0" rx="143" ry="143" width="143" height="143" />
        </vue-content-loading>

        <template v-else>
          <app-upload
            v-if="$route.params.uuid === $store.getters['auth/uuidUser']"
            accept="image/*, image/heic, image/heif"
            class="sac__avatar-upload"
            :disabled="avatarDisabled"
            @change="handleUploadAvatarChange"
          >
            <app-avatar
              class="sac__avatar"
              :src="socialProfile.avatar ? socialProfile.avatar.medium : ''"
              size="14.3rem"
              alt
            />
            <div class="sac__avatar-upload-icon">
              <IconPhoto class="icon fill-opacity-1" />
            </div>
          </app-upload>
          <app-avatar
            v-else
            class="sac__avatar"
            :src="socialProfile.avatar ? socialProfile.avatar.medium : ''"
            size="14.3rem"
            alt
          />
        </template>
      </div>

      <div class="sac__bottom-content">
        <vue-content-loading
          v-if="fetchingInfo"
          class="sac__loading sac__loading--bottom"
          :width="500"
          :height="32"
        >
          <rect x="0" y="6" rx="6" ry="6" width="500" height="20" />
        </vue-content-loading>

        <template v-else>
          <h4 class="sac__username">{{ socialProfile.fullname }}</h4>

          <div class="sac__bottom-content-right">
            <app-button
              v-if="$route.params.uuid === $store.getters['auth/uuidUser']"
              class="sac__button"
              nuxt
              :to="`/social/account/${$store.getters['auth/uuidUser']}/about`"
              outline
            >Chỉnh sửa hồ sơ</app-button>

            <template v-else>
              <v-popover
                v-if="friendRelationshipStatus === SOCIAL_FRIEND_STATUS.ACTIVE"
                class="d-inline-block"
                placement="bottom-end"
                :open.sync="popoverOpen"
                :popover-inner-class="`tooltip-inner popover-inner px-0 py-3`"
              >
                <app-button class="sac__button" size="sm" :loading="btnFriendLoading">
                  <IconHowToReg class="icon fill-opacity-1 body-1" />
                </app-button>

                <template slot="popover">
                  <div class="sac__dropdown">
                    <a
                      v-if="isFollow"
                      href
                      class="sac__dropdown-item"
                      @click.prevent="popoverOpen = false; unfollowFriend()"
                    >
                      <IconUnSubscriptions2 class="icon fill-opacity-1" />Bỏ theo dõi
                    </a>
                    <a
                      v-else
                      href
                      class="sac__dropdown-item"
                      @click.prevent="popoverOpen = false; followFriend()"
                    >
                      <IconAddToPhotos class="icon fill-opacity-1" />Theo dõi
                    </a>
                    <a
                      href
                      class="sac__dropdown-item"
                      @click.prevent="popoverOpen = false; modalConfirmUnfriend = true;"
                    >
                      <IconPersonAddDisabled class="icon fill-opacity-1" />Hủy kết bạn
                    </a>
                  </div>
                </template>
              </v-popover>

              <v-popover
                v-if="friendRelationshipStatus === SOCIAL_FRIEND_STATUS.INVITING"
                class="d-inline-block"
                placement="bottom-end"
                :open.sync="popoverResonseOpen"
                :popover-inner-class="`tooltip-inner popover-inner px-0 py-3`"
              >
                <app-button class="sac__button" size="sm" :loading="responseFriendLoading">
                  <IconHowToReg class="icon fill-opacity-1 body-1 mr-2" />Phản hồi
                </app-button>

                <template slot="popover">
                  <div class="sac__dropdown">
                    <a
                      href
                      class="sac__dropdown-item"
                      @click.prevent="popoverResonseOpen = false; setAcceptFriend(true)"
                    >
                      <IconDone class="icon fill-opacity-1 body-1 mr-2" />Chấp nhận lời mời
                    </a>
                    <a
                      href
                      class="sac__dropdown-item"
                      @click.prevent="popoverResonseOpen = false; setAcceptFriend(false)"
                    >
                      <IconClose class="icon fill-opacity-1 body-1 mr-2" />Xoá lời mời
                    </a>
                  </div>
                </template>
              </v-popover>

              <app-button
                v-if="friendRelationshipStatus === SOCIAL_FRIEND_STATUS.PENDING"
                class="sac__button"
                size="sm"
                :loading="unfriendLoading"
                @click="unfriend"
              >
                <IconPersonAddDisabled class="icon fill-opacity-1 body-1 mr-2" />Huỷ lời mời kết bạn
              </app-button>

              <app-button
                v-if="friendRelationshipStatus === SOCIAL_FRIEND_STATUS.NONE"
                class="sac__button"
                size="sm"
                :loading="addFriendLoading"
                @click="addFriend"
              >
                <IconPersonAdd class="icon fill-opacity-1 body-1 mr-2" />Thêm bạn bè
              </app-button>

              <app-button class="sac__button" outline size="sm" nuxt :to="`/messages/u/${socialProfile.id}`">
                <IconMessage class="d-block icon fill-opacity-1 body-1" />
              </app-button>
            </template>
          </div>
        </template>
      </div>
    </div>

    <app-modal-confirm
      v-model="modalConfirmUnfriend"
      :title="`Huỷ kết bạn với ${socialProfile.fullname}?`"
      :confirm-loading="btnFriendLoading"
      @ok="unfriend"
      @cancel="modalConfirmUnfriend = false"
      @close="modalConfirmUnfriend = false"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { VueContentLoading } from "vue-content-loading";
import { getBase64 } from "~/utils/common";
import {
  MEDIA_TARGET_TYPES,
  MEDIA_TARGET_SUB_TYPES,
  SOCIAL_FRIEND_STATUS,
} from "~/utils/constants";
import {
  MEDIA as ENDPOINT_MEDIA,
  PROFILE_AVATAR as ENDPOINT_PROFILE_AVATAR,
  PROFILE_COVER as ENDPOINT_PROFILE_COVER,
} from "~/utils/endpoints";
import {
  BASE as ACTION_TYPE_BASE,
  ACCOUNT_PERSONAL as ACTION_ACCOUNT_PERSONAL,
  SOCIAL_ACCOUNT_PROFILE as ACTION_SOCIAL_ACCOUNT_PROFILE,
} from "~/utils/action-types";
import { AUTH as MUTATION_AUTH } from "~/utils/mutation-types";
import FriendsService from "~/services/social/Friends";
import FollowService from "~/services/social/Follow";
import IconPhoto from "~/assets/svg/icons/photo.svg?inline";
import IconCameraAlt from "~/assets/svg/v2-icons/camera_alt_24px.svg?inline";
import IconMessage from "~/assets/svg/v2-icons/message_24px.svg?inline";
import IconPersonAddDisabled from "~/assets/svg/v2-icons/person_add_disabled_24px.svg?inline";
import IconUnSubscriptions2 from "~/assets/svg/icons/unsubscription.svg?inline";
import IconAddToPhotos from "~/assets/svg/v2-icons/add_to_photos_24px.svg?inline";
import IconHowToReg from "~/assets/svg/v2-icons/how_to_reg_24px.svg?inline";
import IconPersonAdd from "~/assets/svg/v2-icons/person_add_24px.svg?inline";
import IconDone from "~/assets/svg/v2-icons/done_24px.svg?inline";
import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline";

export default {
  components: {
    IconPhoto,
    IconCameraAlt,
    IconMessage,
    IconPersonAddDisabled,
    IconUnSubscriptions2,
    IconAddToPhotos,
    IconHowToReg,
    IconPersonAdd,
    VueContentLoading,
    IconDone,
    IconClose,
  },

  props: {
    fetchingInfo: Boolean,
  },

  data() {
    return {
      avatarDisabled: false,
      coverDisabled: false,
      popoverOpen: false,
      popoverResonseOpen: false,
      addFriendLoading: false,
      unfriendLoading: false,
      responseFriendLoading: false,
      btnFriendLoading: false,
      modalConfirmUnfriend: false,
    };
  },

  computed: {
    ...mapState("social/account/profile", ["socialProfile"]),

    friendRelationshipStatus() {
      return this.socialProfile.relationships_status
        ? this.socialProfile.relationships_status.friend
        : null;
    },

    isFollow() {
      return this.socialProfile.relationships_status
        ? this.socialProfile.relationships_status.follow
        : false;
    },
  },

  created() {
    this.SOCIAL_FRIEND_STATUS = Object.freeze(SOCIAL_FRIEND_STATUS);
  },

  methods: {
    ...mapActions("account", [ACTION_ACCOUNT_PERSONAL.LIST]),
    ...mapActions("social/account/profile", [
      ACTION_SOCIAL_ACCOUNT_PROFILE.GET_SOCIAL_PROFILE,
    ]),
    ...mapMutations("auth", [MUTATION_AUTH.SET_TOKEN_AVATAR]),

    async handleUploadAvatarChange(files) {
      try {
        this.avatarDisabled = true;
        // Upload image to server
        const [uploadedData = {}] = await this.uploadMedia(
          files[0],
          MEDIA_TARGET_SUB_TYPES.AVATAR
        );

        if (uploadedData && typeof uploadedData == "object") {
          // Submit image uploaded to api change avatar
          const changeAvatar = await this.$axios.$put(ENDPOINT_PROFILE_AVATAR, {
            avatar_url: uploadedData.path,
          });

          if (!changeAvatar.error) {
            // Re-get profile & re-set store data
            this[ACTION_ACCOUNT_PERSONAL.LIST]();
            this[ACTION_SOCIAL_ACCOUNT_PROFILE.GET_SOCIAL_PROFILE]({
              uuid: this.$route.params.uuid,
            });
            this[MUTATION_AUTH.SET_TOKEN_AVATAR](
              changeAvatar.data ? changeAvatar.data.avatar : {}
            );
          } else {
            this.$toasted.error(changeAvatar.error.message);
          }
        }

        this.avatarDisabled = false;
      } catch (error) {
        this.avatarDisabled = false;
        this.$toasted.error(error.message);
        throw error;
      }
    },

    async handleUploadCoverChange(files) {
      try {
        this.coverDisabled = true;
        // Upload image to server
        const [uploadedData = {}] = await this.uploadMedia(
          files[0],
          MEDIA_TARGET_SUB_TYPES.COVER
        );

        if (uploadedData && typeof uploadedData == "object") {
          // Submit image uploaded to api change avatar
          const changeCover = await this.$axios.$put(ENDPOINT_PROFILE_COVER, {
            cover_url: uploadedData.path,
          });

          if (!changeCover.error) {
            // Re-get profile & re-set store data
            this[ACTION_ACCOUNT_PERSONAL.LIST]();
            this[ACTION_SOCIAL_ACCOUNT_PROFILE.GET_SOCIAL_PROFILE]({
              uuid: this.$route.params.uuid,
            });
          } else {
            this.$toasted.error(changeCover.error.message);
          }
        }

        this.coverDisabled = false;
      } catch (error) {
        this.coverDisabled = false;
        this.$toasted.error(error.message);
        throw error;
      }
    },

    async uploadMedia(file, targetSub) {
      try {
        const formData = new FormData();
        formData.append("target_type", MEDIA_TARGET_TYPES.USER);
        formData.append("target_sub", targetSub);
        formData.append("media", file);

        const doUpload = await this.$axios.$post(ENDPOINT_MEDIA, formData);

        if (!doUpload.error) {
          return doUpload.data;
        } else {
          this.$toasted.error(
            typeof doUpload.error === "object"
              ? doUpload.error.message
              : "Có lỗi xảy ra khi tải lên media"
          );
        }
      } catch (error) {
        this.$toasted.error(error.message);
        throw error;
      }
    },

    async addFriend() {
      try {
        this.addFriendLoading = true;

        const result = await new FriendsService(this.$axios)[
          ACTION_TYPE_BASE.ADD
        ]({
          friend_id: this.socialProfile.id,
        });

        if (!result.error) {
          await this[ACTION_SOCIAL_ACCOUNT_PROFILE.GET_SOCIAL_PROFILE]({
            uuid: this.socialProfile.id,
          });
        } else {
          this.$toasted.error(result.error.message);
        }

        this.addFriendLoading = false;
      } catch (error) {
        this.addFriendLoading = false;
        this.$toasted.error(error.message);
        throw error;
      }
    },

    async unfriend() {
      try {
        this.unfriendLoading = true;
        this.btnFriendLoading = true;

        const result = await new FriendsService(this.$axios)[
          ACTION_TYPE_BASE.DELETE
        ](this.socialProfile.id);

        if (!result.error) {
          await this[ACTION_SOCIAL_ACCOUNT_PROFILE.GET_SOCIAL_PROFILE]({
            uuid: this.socialProfile.id,
          });
        } else {
          this.$toasted.error(result.error.message);
        }

        this.unfriendLoading = false;
        this.btnFriendLoading = false;
        this.modalConfirmUnfriend = false;
      } catch (error) {
        this.unfriendLoading = false;
        this.btnFriendLoading = false;
        this.modalConfirmUnfriend = false;
        this.$toasted.error(error.message);
        throw error;
      }
    },

    async followFriend() {
      try {
        this.btnFriendLoading = true;

        const result = await new FollowService(this.$axios)[
          ACTION_TYPE_BASE.ADD
        ]({
          target_user_id: this.socialProfile.id,
        });

        if (!result.error) {
          await this[ACTION_SOCIAL_ACCOUNT_PROFILE.GET_SOCIAL_PROFILE]({
            uuid: this.socialProfile.id,
          });
        } else {
          this.$toasted.error(result.error.message);
        }

        this.btnFriendLoading = false;
        return result;
      } catch (error) {
        this.btnFriendLoading = false;
        this.$toasted.error(error.message);
        throw error;
      }
    },

    async unfollowFriend() {
      try {
        this.btnFriendLoading = true;

        const result = await new FollowService(this.$axios)[
          ACTION_TYPE_BASE.DELETE_PAYLOAD
        ]({
          target_user_id: this.socialProfile.id,
        });

        if (!result.error) {
          await this[ACTION_SOCIAL_ACCOUNT_PROFILE.GET_SOCIAL_PROFILE]({
            uuid: this.socialProfile.id,
          });
        } else {
          this.$toasted.error(result.error.message);
        }

        this.btnFriendLoading = false;
        return result;
      } catch (error) {
        this.btnFriendLoading = false;
        this.$toasted.error(error.message);
        throw error;
      }
    },

    async setAcceptFriend(isAccept) {
      try {
        this.responseFriendLoading = true;

        const result = await new FriendsService(this.$axios)[
          ACTION_TYPE_BASE.EDIT
        ](this.socialProfile.id, {
          accept: isAccept,
        });

        if (!result.error) {
          await this[ACTION_SOCIAL_ACCOUNT_PROFILE.GET_SOCIAL_PROFILE]({
            uuid: this.socialProfile.id,
          });
        } else {
          this.$toasted.error(result.error.message);
        }

        this.responseFriendLoading = false;
      } catch (error) {
        this.responseFriendLoading = false;
        this.$toasted.error(error.message);
        throw error;
      }
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/social/_social-account-cover.scss";
</style>