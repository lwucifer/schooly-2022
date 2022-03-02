<template>
  <div>
    <div class="mb-5">
      <h6 class="mb-3 body-1">Mô tả</h6>
      <div
        class="text-gray-3"
      >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse proin risus, facilisi at potenti donec vitae. Vitae vitae, suscipit dignissim magna neque sem nec libero, magna. In nulla bibendum praesent posuere. Feugiat tristique aliquet nulla felis fames pellentesque pharetra curabitur faucibus. Consequat lectus neque quam condimentum odio lorem. Dui elementum aliquet nunc imperdiet massa tristique pulvinar etiam. Augue ipsum eu in molestie varius a. Pellentesque massa ultricies id odio aliquam. Odio.</div>
    </div>

    <div class="mb-5 d-flex justify-content-between">
      <div class="mr-3 body-1 text-dark font-weight-bold">
        Môn học:
        <span class="text-primary">Toán</span>
      </div>
      <div class="mr-3 body-1 text-dark font-weight-bold">
        Khối:
        <span class="text-primary">10</span>
      </div>
      <div class="mr-3 body-1 text-dark font-weight-bold">
        Hình thức:
        <span class="text-primary">Công khai</span>
      </div>
      <div class="body-1 text-dark font-weight-bold">
        Học phí:
        <span class="text-primary">
          100.000đ
          <span class="text-gray-3 font-weight-normal">/ buổi</span>
        </span>
      </div>
    </div>

    <div class="mb-5">
      <h6 class="body-1">Lịch học</h6>
      <div class="table-schedule-wrapper">
        <table class="table-schedule">
          <tbody>
            <tr>
              <td>08:00 - 10:00</td>
              <td>Hàng tuần vào thứ 3,5,7</td>
              <td>30/03/2020 - 30/04/2020</td>
              <td>
                <app-button class="px-2" color="default" size="sm" flat>
                  <IconBorderColor class="icon fill-opacity-1 text-primary body-1" />
                </app-button>
                <app-button class="px-2" color="default" size="sm" flat>
                  <IconTrashAlt class="icon fill-opacity-1 text-secondary body-1" />
                </app-button>
              </td>
            </tr>
            <tr>
              <td>08:00 - 10:00</td>
              <td>Hàng tuần vào thứ 3,5,7</td>
              <td>30/03/2020 - 30/04/2020</td>
              <td>
                <app-button class="px-2" color="default" size="sm" flat>
                  <IconBorderColor class="icon fill-opacity-1 text-primary body-1" />
                </app-button>
                <app-button class="px-2" color="default" size="sm" flat>
                  <IconTrashAlt class="icon fill-opacity-1 text-secondary body-1" />
                </app-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

      <div class="text-center mt-4">
        <app-button @click="$emit('close')">Đóng</app-button>
      </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/pages/elearning/mytutor/olclass/_create.scss";
</style>