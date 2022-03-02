<template>
  <div>
    <div class>
      <div class="d-flex-center">
        <h6 class="mb-3 body-1">Giờ học</h6>
      </div>

      <div class="d-flex-center mb-3">
        <div class="d-flex-center mb-4 mr-6">
          <label class="text-gray-3 mr-3">Bắt đầu vào lúc</label>
          <app-date-picker
            class="ml-3"
            v-model="startTime"
            @input="changeSchedules"
            square
            size="sm"
            valueFormat="HH:mm"
            placeholder="giờ:phút"
            type="time"
            :minuteStep="5"
          >
            <template v-slot:icon-calendar>
              <IconClock />
            </template>
          </app-date-picker>
        </div>
        
        <div class="d-flex-center mb-4">
          <label class="text-gray-3 mr-3">Thời lượng</label>
          <app-date-picker
            class="ml-3"
            v-model="duration"
            @input="changeSchedules"
            square
            size="sm"
            :minute-step="5"
            valueFormat="HH:mm"
            type="time"
            placeholder="giờ:phút"
          >
            <template v-slot:icon-calendar>
              <IconClock />
            </template>
          </app-date-picker>
        </div>
      </div>
    </div>

    <div class="form-item mb-4">
      <h6 class="mb-3 body-1">Ngày học trong tuần</h6>
      <div class="d-flex-center flex-wrap">
        <app-checkbox class="mr-5 mb-3" label="Thứ 2" :isChangeLabelColor="true"></app-checkbox>
        <app-checkbox class="mr-5 mb-3" label="Thứ 3" :isChangeLabelColor="true" />
        <app-checkbox class="mr-5 mb-3" label="Thứ 4" :isChangeLabelColor="true" />
        <app-checkbox class="mr-5 mb-3" label="Thứ 5" :isChangeLabelColor="true" />
        <app-checkbox class="mr-5 mb-3" label="Thứ 6" :isChangeLabelColor="true" />
        <app-checkbox class="mr-5 mb-3" label="Thứ 7" :isChangeLabelColor="true" />
        <app-checkbox class="mb-3" label="Chủ nhật" :isChangeLabelColor="true" />
      </div>
    </div>

    <div class="d-flex">
      <div class="form-item mb-0">
        <h6 class="mb-3 body-1">Thời gian áp dụng</h6>
        <div>
          <div class="d-flex-center">
            <div class="d-flex-center mr-4">
              <label class="text-dark font-weight-medium">Từ</label>
              <app-date-picker
                class="ml-3"
                v-model="fromDate"
                square
                size="sm"
                placeholder="yyyy-mm-dd"
                valueFormat="YYYY-MM-DD"
              >
                <template v-slot:icon-calendar>
                  <IconCalendar />
                </template>
              </app-date-picker>
            </div>
            <div class="d-flex-center">
              <label class="text-dark font-weight-medium">Đến</label>
              <app-date-picker
                class="ml-3"
                v-model="toDate"
                square
                size="sm"
                placeholder="yyyy-mm-dd"
                valueFormat="YYYY-MM-DD"
              >
                <template v-slot:icon-calendar>
                  <IconCalendar />
                </template>
              </app-date-picker>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-6 text-center">
      <app-button color="white" class="mr-4 color-red border">Hủy</app-button>
      <app-button>Cập nhật</app-button>
    </div>
  </div>
</template>

<script>
import IconClock from "~/assets/svg/icons/clock.svg?inline";
import IconCalendar from "~/assets/svg/icons/calendar2.svg?inline";

export default {
  components: {
    IconClock,
    IconCalendar,
  },

  data() {
    return {
      startTime: null,
      duration: null,
      fromDate: null,
      toDate: null,
    };
  },

  methods: {
    changeSchedules() {},
  },
};
</script>

<style>
</style>