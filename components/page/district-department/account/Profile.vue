<template>
  <div>
    <content-box
      title="Thông tin tài khoản"
    >
      <template v-slot:content>
        <div class="account__profile mt-3">
          <div class="account__profile__form row">
            <div class="col-md-5">
              <div class="form__item">
                <label class="label" for="">Tên phòng giáo dục</label>
                <app-input
                  :value="info.name"
                  disabled
                />
              </div>
              <div class="form__item">
                <label class="label" for="">Tên phòng giáo dục</label>
                  <app-input v-model="info.address"/>
              </div>
              <div class="form__item">
                <label class="label" for="">Email</label>
                <app-input v-model="info.email"/>
              </div>
            </div>
            <div class="col-md-2"></div>
            <div class="col-md-5">
              <div class="form__item">
                <label class="label" for="">Mã phòng giáo dục</label>
                <app-input :value="info.code" disabled/>
              </div>

              <div class="form__item">
                <label class="label" for="">Số điện thoại</label>
                <app-input v-model="info.phone"/>
              </div>
            </div>
          </div>
          <app-button
            color="red"
            square
            size="sm"
            normal
          >
            <span>Thay đổi mật khẩu</span>
          </app-button>
          <div class="text-center mt-4">
            <app-button
              square
              size="sm"
              normal
            >
              Lưu thay đổi
            </app-button>
          </div>
        </div>
      </template>
    </content-box>
  </div>
</template>

<script>
  import ContentBox from "~/components/page/district-department/account/ContentBox"

  export default {
    components: {
      ContentBox,
    },
    data() {
      return {
        info: {
          name: 'Trường THCS Nguyễn Trãi',
          address: '',
          email: '',
          code: '59AJFLDJL',
          phone: '098702312'
        }
      }
    },
    mounted() {

    }
  }
</script>

<style lang="scss" scoped>
  @import "~/assets/scss/components/district-department/account/_profile.scss";
</style>