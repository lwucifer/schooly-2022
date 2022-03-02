<template>
  <div class="d-flex">
    <div class="mr-4">
      <app-avatar
        :src="avatarSrc"
        :size="96"
        shape="square"
        style="border-radius: 4px;"
        class="d-flex flex-column"
      />
    </div>
    <div>
      <p class="mb-3">
        <b>Thay ảnh đại diện</b>
      </p>
      <p class="mb-4">Click vào nút Upload dưới đây để thay đổi ảnh đại diện của bạn.</p>
      <app-upload class @change="handleUploadAvatar">
        <template>
          <div class>
            <app-button normal size="sm" color="white">Upload</app-button>
            <!--<IconPhoto width="13" height="13" />-->
          </div>
        </template>
      </app-upload>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { getBase64 } from "~/utils/common";

export default {
  props: {
    avSrc: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      avatar: [],
      avatarSrc: this.avSrc,
      avatarFull: {}
    };
  },
  computed: {
    ...mapGetters("auth", ["uuidUser"])
  },
  methods: {
    ...mapActions("account", [
      "accountPersonalEditAvatar",
      "accountPersonalList"
    ]),
    ...mapActions("chat", ["uploadMedia"]),
    ...mapMutations("auth", ["setTokenAvatar"]),
    async handleUploadAvatar(fileList, event) {
      this.avatar = Array.from(fileList);

      getBase64(this.avatar[0], src => {
        this.avatarSrc = src;
      });
      const body = new FormData();
      body.append("media", fileList[0]);
      body.append("target_id", this.uuidUser);
      body.append("target_type", "user");
      body.append("target_sub", "avatar");
      // console.log("[room_avatar]", fileList[0]);
      await this.uploadMedia(body).then(result => {
        if (result.data) {
          this.avatarUrl = result.data[0].path ? result.data[0].path : "";
          this.avatarFull = result.data[0].full_path;
          const data = {
            avatar_url: this.avatarUrl
          };
          console.log("avatar", data);
          this.accountPersonalEditAvatar(data).then(res => {
            if (res.data) {
              this.setTokenAvatar(this.avatarFull);
              this.accountPersonalList();
            }
          });
        }
      });
    }
    // async handleUploadAvatar(fileList, event) {
    //   this.avatar = Array.from(fileList);
    //   getBase64(this.avatar[0], src => {
    //     this.avatarSrc = src;
    //   });
    //   const body = new FormData();
    //   body.append("avatar_images", fileList[0]);
    //   console.log("[avatar_images]", fileList[0]);
    //   this.accountPersonalEditAvatar(body).then(result => {
    //     if (result.success) {
    //       setTimeout(() => {
    //         this.setTokenAvatar(result.data.avatar);
    //       }, 1000);
    //     }
    //   });
    // }
  }
};
</script>

<style lang="scss">
</style>