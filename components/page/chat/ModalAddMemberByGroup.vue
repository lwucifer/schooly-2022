<template>
  <app-modal
    centered
    :width="480"
    :component-class="{ 'create-group-chat-modal': true }"
    :header="false"
    :footer="false"
  >
    <div slot="content">
      <h2>Thêm bạn</h2>
      <app-search
        class="mt-4"
        :placeholder="'Nhập để tìm kiếm...'"
        bordered
        v-model="keyword"
        :size="'sm'"
        @input="search"
      ></app-search>
      <div class="contact-list">
        <div
          class="item d-flex-center"
          v-for="(item, index) in filterFriendList ? filterFriendList : []"
          :key="index"
        >
          <app-avatar
            :src="item && item.avatar && item.avatar.low ? item.avatar.low : ''"
            :size="30"
            class="mr-3"
          />
          <span>{{item.fullname}}</span>
          <span class="ml-auto" v-if="arrIdMember.includes(item.id)">Đã thêm</span>
          <app-checkbox v-else class="ml-auto" @change="handelCheckbox(item.id)" />
        </div>
      </div>
      <div class="text-center mt-4">
        <app-button size="sm" color="info" class="mr-3" square @click="close()">Hủy</app-button>
        <app-button size="sm" square @click="hanldeAddMember">Thêm</app-button>
      </div>
    </div>
  </app-modal>
</template>

<script>
import { mapState, mapActions } from "vuex";
import * as constants from "~/utils/constants";

export default {
  components: {},

  props: {
    // friends: {
    //   type: Array,
    //   default: () => [],
    //   required: true
    // }
  },

  data() {
    return {
      arrMember: [],
      name: "",
      keyword: "",
    };
  },

  computed: {
    // ...mapState("account", ["friendList"]),
    // ...mapState("message", ["memberList"]),
    ...mapState("chat", ["memberList", "friendList"]),
    arrIdMember() {
      const data = this.memberList ? this.memberList : [];
      console.log(
        "data",
        data.map((item) => item.id)
      );
      return data.map((item) => item.id);
    },
    filterFriendList() {
      return this.friendList
        ? this.friendList.map((item) => {
            return item.profile;
          })
        : [];
    },
  },
  methods: {
    // ...mapActions("message", ["addMember", "getMemberList"]),
    ...mapActions("chat", [
      "roomAddMember",
      "getMemberList",
      "searchUserSocialList",
      "getFriendsList",
    ]),
    close() {
      this.$emit("close");
    },
    search() {
      console.log("search");
      if (this.keyword) {
        const data = {
          q: this.keyword,
          limit: 10,
        };
        this.searchUserSocialList(data);
      } else {
        const params = {
          fetch_size: 20,
        };
        this.getFriendsList(params);
      }
    },
    // create() {
    //   this.$emit("create", this.arrMember, this.name);
    // },
    handelCheckbox(_id) {
      if (this.arrMember.includes(_id)) {
        this.arrMember = this.arrMember.filter((item) => item !== _id);
      } else {
        this.arrMember.push(_id);
      }
      console.log("arrayMember", this.arrMember);
    },
    hanldeAddMember() {
      const paramsOptions = {};
      const data = {
        id: this.$route.params.id,
        payload: { member_ids: this.arrMember },
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
  },
};
</script>