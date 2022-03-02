<template>
  <app-modal
    centered
    :width="420"
    :component-class="{ 'create-group-chat-modal': true }"
    :header="false"
    :footer="false"
  >
    <div slot="content">
      <h5>Thêm bạn</h5>
      <div class="d-flex-center">
        <input type="text" class="input-name-group" placeholder="Tên nhóm chat" v-model="name" />
      </div>
      <app-search class="mb-0" />
      <div class="contact-list">
        <div
          class="item d-flex-center"
          v-for="(item, index) in friendList.listFriend ? friendList.listFriend : []"
          :key="index"
        >
          <app-avatar
            :src="item.avatar && item.avatar.low ? item.avatar.low : ''"
            :size="30"
            class="mr-3"
          />
          <span>{{item.fullname}}</span>
          <app-checkbox class="ml-auto" @change="handelCheckbox(item.id)" />
        </div>
      </div>
      <div class="text-center mt-4">
        <app-button size="sm" color="info" class="mr-3" square @click="close()">Hủy</app-button>
        <app-button size="sm" square @click="hanldeCreateGroup">Tạo</app-button>
      </div>
    </div>
  </app-modal>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  components: {},

  props: {
    friends: {
      type: Array,
      default: () => [],
      required: true
    }
  },

  data() {
    return {
      arrMember: [],
      name: ""
    };
  },

  methods: {
    ...mapActions("message", ["createGroup", "getGroupList"]),
    close() {
      this.$emit("close");
    },
    // create() {
    //   this.$emit("create", this.arrMember, this.name);
    // },
    handelCheckbox(_id) {
      if (this.arrMember.includes(_id)) {
        this.arrMember = this.arrMember.filter(item => item !== _id);
      } else {
        this.arrMember.push(_id);
      }
      console.log("arrayMember", this.arrMember);
    },
    async handleUploadChange(fileList, event) {
      this.avatar = Array.from(fileList);

      getBase64(this.avatar[0], src => {
        this.avatarSrc = src;
      });
      const body = new FormData();
      body.append("avatar_images", fileList[0]);
      console.log("[avatar_images]", fileList[0]);
      this.accountPersonalEditAvatar(body).then(result => {});
    },
    hanldeCreateGroup(arrMember) {
      const data = {
        type: 2,
        members: this.arrMember.toString(),
        name: this.name
      };
      this.createGroup(data).then(result => {
        if (result.success == true) {
          this.getGroupList();
          this.$emit("close");
          this.$toasted.show("success");
        } else {
          this.$toasted.error(result.message);
        }
      });
    }
  },

  computed: {
    ...mapState("message", ["friendList"])
  }
};
</script>