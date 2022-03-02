<template>
    <header-frame search-placeholder="Tìm kiếm bài giảng và khóa học của bạn" class="header-back-home">
        <template v-slot:functionMenu>
            <div class="d-md-flex">
                <app-button
                size="sm"
                square
                normal
                class="ml-4 btn-secondary-header"
                >
                Quay lại trang chủ
                </app-button>
            </div>
        </template>
        <template v-slot:rightMenu>
            <div v-if="isAuthenticated">
                <app-notification-header />
            </div>

            <div v-if="isAuthenticated" class="the-header__user">
                <user-header/>
            </div>

            <div v-else class="d-flex">
                <app-button class="mr-3 btn-login" @click.prevent="redirectSignin">Đăng nhập</app-button>
                <n-link
                class="btn btn--size-md btn-outline btn-outline--color-primary btn--square"
                :to="'/auth/signup'"
                >Đăng ký</n-link>
            </div>

            <div v-else class="d-flex">
                <app-button class="mr-3 btn-login" @click.prevent="redirectSignin">Đăng nhập</app-button>
                <n-link
                class="btn btn--size-md btn-outline btn-outline--color-primary btn--square"
                :to="'/auth/signup'"
                >Đăng ký</n-link>
            </div>

            <ModalSigninByPhone :visible="showLogin" @click-close="showLogin = false" />
        </template>
    </header-frame>
</template>

<script>
import HeaderFrame from "~/components/common/header/HeaderFrame";
export default {
    components:{
        HeaderFrame
    },
    data: () => ({
    showLogin: false
  }),
  computed: {
    isAuthenticated() {
      return true;
      return this.$store.getters["auth/isAuthenticated"];
    }
  },
  methods: {
    redirectSignin() {
      this.$router.push("/auth/signin");
    }
  }
}
</script>

<style lang="scss">

</style>