<template>
  <div>
    <app-modal title="Thêm người vào nhóm" :footer="false" @close="close">
      <template #content>
        <div class="content">
          <div class="modal-search" :class="{'px-4': showCheck}">
            <app-select
              class="w-100"
              v-if="tags.length > 0"
              mode="tags"
              v-model="tags"
              :options="tagOptions"
              :forceHideOptions="true"
              @search="handleSearchUser"
            ></app-select>
            <app-input
              v-else
              placeholder="Tìm kiếm"
              class="input-no-border mb-0"
              @input="handleSearchUser"
            />
          </div>

          <div class="modal-add">
            <div class="modal-add__title">Danh sách bạn bè</div>

            <div class="modal-add__list">
              <ul>
                <li v-for="(item, index) in filterFriendList ? filterFriendList : []" :key="index">
                  <div
                    class="list-item d-flex align-items-center justify-content-between"
                    @click="!arrIdMember.includes(item.id) ? handleCheck(item.id) : ''"
                  >
                    <div class="name d-flex align-items-center">
                      <img
                        :src="item.avatar && item.avatar.low ? item.avatar.low : '' || require('~/assets/svg/images/default-avatar.svg?data')"
                        alt
                      />
                      <span>{{item.fullname}}</span>
                    </div>

                    <div class="click-check" v-if="arrIdMember.includes(item.id)">
                      <span>Đã thêm</span>
                    </div>
                    <div class="click-check" v-else>
                      <IconCheck24px
                        v-if="tags.includes(item.id)"
                        class="icon fill-primary heading-4"
                      />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="modal-btn text-center">
            <app-button outline color="primary" class="mr-4" @click="close">Hủy</app-button>
            <app-button color="primary" @click="hanldeAddMember">Thêm</app-button>
          </div>
        </div>
      </template>
    </app-modal>
  </div>
</template>

<script>
import IconCheck24px from "~/assets/svg/v2-icons/check_24px.svg?inline";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
export default {
  components: {
    IconCheck24px,
  },

  data() {
    return {
      showCheck: false,
      tags: [],
      keyword: "",
    };
  },
  computed: {
    ...mapState("chat", ["friendList", "memberList"]),
    tagOptions() {
      return (
        this.friendList &&
        this.friendList.map((item) => ({
          value: item && item.profile && item.profile.id ? item.profile.id : "",
          text:
            item && item.profile && item.profile.fullname
              ? item.profile.fullname
              : "",
          avatarFriend:
            item &&
            item.profile &&
            item.profile.avatar &&
            item.profile.avatar.low
              ? item.profile.avatar.low
              : "",
        }))
      );
    },
    filterFriendList() {
      return this.friendList
        ? this.friendList.map((item) => {
            return item.profile;
          })
        : [];
    },
    arrIdMember() {
      const data = this.memberList ? this.memberList : [];
      console.log(
        "data",
        data.map((item) => item.id)
      );
      return data.map((item) => item.id);
    },
  },

  methods: {
    ...mapActions("chat", [
      "roomAddMember",
      "getMemberList",
      "searchUserSocialList",
      "getFriendsList",
    ]),
    handleSearchUser(val) {
      console.log("search", val);
      this.keySearch = val;
      if (val) {
        const data = {
          q: val,
          fetch_size: 20,
          fetch_type: "search",
        };
        setTimeout(() => {
          this.searchUserSocialList(data);
        }, 500);
      } else {
        const params = {
          fetch_size: 20,
        };
        this.getFriendsList(params);
      }
    },
    hanldeAddMember() {
      const paramsOptions = {};
      const data = {
        id: this.$route.params.id,
        payload: { member_ids: this.tags },
        end: "members",
      };
      // const params = {
      //   room_id: this.$route.params.id
      // };
      this.roomAddMember(data).then((result) => {
        if (!result.error) {
          this.getMemberList({
            paramsOptions,
            id: this.$route.params.id,
            end: "members",
          });
          this.$emit("close");
          this.$toasted.success("Thêm thành viên thành công");
        } else {
          this.$toasted.error(result.error.message);
        }
      });
    },
    handleCheck(_id) {
      if (this.keySearch) {
        const params = {
          fetch_size: 20,
        };
        this.getFriendsList(params);
        this.keySearch = "";
      }
      if (this.tags.includes(_id)) {
        this.tags = this.tags.filter((item) => item !== _id);
      } else {
        this.tags.push(_id);
      }
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/chat/_modal-add-people.scss";
</style>