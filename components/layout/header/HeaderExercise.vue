<template>
  <header-frame
    search-placeholder="Tìm kiếm bài giảng và khóa học của bạn"
  >
    <template v-slot:functionMenu>
      <div class="d-md-flex">
        <app-button
          size="sm"
          square
          normal
          class="btn-primary-header"
          v-if="isShowCreateCouse"
        >
          <IconPlus/> &nbsp;
          Tạo bài giảng khóa học
        </app-button>

        <app-button
          nuxt
          size="sm"
          square
          normal
          class="ml-4 btn-secondary-header"
          to="/"
        >
          Quay lại trang chủ
        </app-button>
      </div>
    </template>

    <template v-slot:rightMenu>
      <div v-if="isAuthenticated">
        <app-notification-header/>
      </div>

      <div v-if="isAuthenticated">
        <user-header/>
      </div>

      <div v-else class="d-flex">
        <app-button class="mr-3 btn-login" @click.prevent="redirectSignin">Đăng nhập</app-button>
        <n-link
          class="btn btn--size-md btn-outline btn-outline--color-primary btn--square"
          :to="'/auth/signup'"
        >Đăng ký
        </n-link>
      </div>

      <!-- <div v-else class="d-flex">
        <app-button class="mr-3 btn-login" @click.prevent="redirectSignin">Đăng nhập</app-button>
        <n-link
          class="btn btn--size-md btn-outline btn-outline--color-primary btn--square"
          :to="'/auth/signup'"
        >Đăng ký
        </n-link>
      </div> -->

      <ModalSigninByPhone :visible="showLogin" @click-close="showLogin = false"/>
    </template>
  </header-frame>
</template>

<script>
  import ModalSigninByPhone from "~/components/page/auth/ModalSigninByPhone";
  import HeaderFrame from "~/components/common/header/HeaderFrame";
  import UserHeader from "~/components/common/user-header/UserHeader";
  import IconPlus from "~/assets/svg/icons/plus3.svg?inline";

  export default {
    components: {
      HeaderFrame,
      UserHeader,
      ModalSigninByPhone,
      IconPlus
    },

    data: () => ({
      showLogin: false
    }),
    computed: {
      isAuthenticated() {
        return true;
        return this.$store.getters["auth/isAuthenticated"];
      },
      isShowCreateCouse(){
        if(this.$route.path === "/elearning/manager/courses/create"){
          return false
        }
        else{
          return true
        }
      }
    },
    methods: {
      redirectSignin() {
        this.$router.push("/auth/signin");
      }
    }
  };
</script>

<style lang="scss">
  @import "~/assets/scss/components/header-exercise/_header-exercise.scss";
</style>