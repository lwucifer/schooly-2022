<template>
  <div class="exams-create-setting">
    <sub-block-section title="Cài đặt">
      <template v-slot:content>
        <div class="exams-create-setting__content">
          <div class="group-form">
            <span class="text-left">Chế độ hiển thị</span>
            <app-select
              placeholder="Chọn chế độ"
              class="ecs__select"
              :options="otpRegime"
              v-model="regime"
            />
          </div>
          <div
            class="exams-create-setting__wrap-select-class"
            v-if="regime != 'PUBLIC'"
          >
            <div>
              <button
                class="btn-tab mr-3"
                @click="tab = 1;"
                :class="tab == 1 ? 'active' : ''"
              >
                Lớp trực thuộc trường
              </button>
              <button
                class="btn-tab"
                @click="tab = 2;"
                :class="tab == 2 ? 'active' : ''"
              >
                Nhóm học tập
              </button>
            </div>
            <p class="my-3" v-if="tab == 1">
              Chỉ định hiển thị kỳ thi này cho một hoặc nhiều lớp trong trường
              của bạn
            </p>
            <p class="my-3" v-if="tab == 2">
              Chỉ định hiển thị kỳ thi này cho một hoặc nhiều nhóm học tập của bạn
            </p>
            <div>
              <p>{{ tab == 1 ? "Chọn lớp" : "Chọn nhóm" }}</p>
              <div class="box-checkbox" v-if="tab == 1" :class="validate.assign == 2 ? 'border border-red':''">
                <div class="select-all"></div>
                <div
                  v-for="(item, index) in classList"
                  :key="index"
                  class="mt-3"
                >
                  <AppCheckbox
                    :label="item.name"
                    @change="e => handleCheckboxClass(item.id, e)"
                    :checked="!!assignClass.find(g => g.id == item.id)"
                  />
                </div>
              </div>
              <div class="box-checkbox" v-if="tab == 2" :class="validate.assign == 2 ? 'border border-red':''">
                <div class="select-all"></div>
                <div
                  v-for="(item, index) in groupList"
                  :key="index"
                  class="mt-3"
                >
                  <AppCheckbox
                    :label="item.name"
                    @change="e => handleCheckboxGroup(item.id, e)"
                    :checked="!!assignGroup.find(g => g.id == item.id)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="group-form">
            <span class="text-left">Lệ phí kỳ thi</span>
            <app-select
              placeholder="Chọn lệ phí"
              class="ecs__select"
              size="md"
              :options="otpFee"
              v-model="free"
              @change="handleChangeFee"
            />
            <app-input class="mb-0" v-if="free" v-model="payload.fees">
              <template v-slot:append-inner>
                <div class="pr-3 d-flex align-items-center">đ</div>
              </template>
            </app-input>
          </div>
          <div class="group-form">
            <span class="text-left">Số thí sinh tối đa</span>
            <app-input
              class="mb-0 ecs__select"
              type="number"
              v-model="payload.limit"
            />
          </div>
          <span class="text-left">Cài đặt thời gian</span>
          <div class="group-pick-time">
            <span class="text-left font-weight-normal">Thời gian mở đề</span>
            <app-date-picker
              class="mr-4"
              :class="validate.start_time == 2 ? 'border-red':''"
              v-model="payload.start_time"
              :valueFormat="'YYYY-MM-DD HH:mm:ss'"
              :type="'datetime'"
              :disabled="!payload.starttime_enable"
              :clearDate="!payload.starttime_enable"
            >
              <template v-slot:icon-calendar>
                <IconCalendarV2 />
              </template>
            </app-date-picker>
            <app-checkbox
              label="Áp dụng"
              class="ml-5"
              v-model="payload.starttime_enable"
            ></app-checkbox>
          </div>
          <div class="group-pick-time">
            <span class="text-left font-weight-normal">Thời gian đóng đề</span>
            <app-date-picker
              class="mr-4"
              :class="validate.end_time == 2 ? 'border-red':''"
              v-model="payload.end_time"
              :valueFormat="'YYYY-MM-DD HH:mm:ss'"
              :type="'datetime'"
              :disabled="!payload.endtime_enable"
              :clearDate="!payload.endtime_enable"
            >
              <template v-slot:icon-calendar>
                <IconCalendarV2 />
              </template>
            </app-date-picker>
            <app-checkbox
              label="Áp dụng"
              class="ml-5"
              v-model="payload.endtime_enable"
            ></app-checkbox>
          </div>
          <div class="text-center my-4 pt-4">
            <app-button class="mr-4" color="white" @click="$emit('go-back')">
              Hủy
            </app-button>
            <app-button @click="handleSetting" :loading="loading"
              >Xác nhận</app-button
            >
          </div>
        </div>
      </template>
    </sub-block-section>
  </div>
</template>

<script>
import IconCalendarV2 from "~/assets/svg/icons/calendar-v2.svg?inline";
import { get } from "lodash";
import { mapGetters, mapActions, mapState } from "vuex";
import { RESPONSE_SUCCESS } from "~/utils/config";
import { getDateHH_MM_SS } from "~/utils/moment";

export default {
  components: {
    IconCalendarV2
  },
  data() {
    return {
      loading: false,
      tab: 1,
      payload: {
        exam_id: null,
        privacy: "PUBLIC",
        assign_ids: [],
        start_time: null,
        starttime_enable: false,
        end_time: null,
        endtime_enable: false,
        fees: 0,
        limit: 0
      },
      otpRegime: [
        {
          value: "PUBLIC",
          text: "Công khai"
        },
        {
          value: "NONE_PUBLIC",
          text: "Chỉ định"
        }
      ],
      otpFee: [
        {
          value: false,
          text: "Miễn phí"
        },
        {
          value: true,
          text: "Có phí"
        }
      ],
      free: false,
      regime: "PUBLIC",
      selectedCItems: [],
      selectedGItems: [],
      assignClass: [],
      assignGroup: [],
      validate: {
        start_time: 0,
        end_time: 0,
        assign: 0
      }
    };
  },

  computed: {
    ...mapState("elearning/study-group/group", {
      groups: "groups"
    }),
    ...mapState("elearning/public/public-grades", [
      "classes"
    ]),
    ...mapState("elearning/semester/setting", {
      setting: "setting"
    }),

    classList() {
      console.log("[classList]", this.classes);
      return get(this, "classes", []);
    },
    groupList() {
      console.log("[groupList]", this.groups);
      return get(this.groups, "content", []);
    }
  },

  watch: {
    'payload.start_time'(newValue, oldValue) {
      this.validate.start_time = 0
    },
    'payload.starttime_enable'(newValue, oldValue) {
      this.validate.start_time = 0
    },
    'payload.end_time'(newValue, oldValue) {
      this.validate.end_time = 0
    },
    'payload.endtime_enable'(newValue, oldValue) {
      this.validate.end_time = 0
    },
    'tab'(newValue, oldValue) {this.validate.assign = 0},
    'assignClass'(newValue, oldValue) {this.validate.assign = 0},
    'assignGroup'(newValue, oldValue) {this.validate.assign = 0},
    'regime'(newValue, oldValue) {this.validate.assign = 0},
  },

  methods: {
    ...mapActions("elearning/study-group/group", ["getListStudyGroup"]),
    ...mapActions("elearning/semester/setting", [
      "viewSemesterExamSetting",
      "postSemesterExamSetting"
    ]),
    // ...mapActions("elearning/semester/manage-exam", [
    //   "getDetailSemesterExam"
    // ]),

    handleChangeFee(val) {
      this.free = val;
      if(!this.free){
        this.payload.fees = 0;
      }
    },

    checkValidate() {
      let check = false;
      
      if (
        (this.payload.start_time == null || this.payload.start_time == '')
        && this.payload.starttime_enable == true
      ) {
        this.validate.start_time = 2;
        check = true
      }
      if (
        (this.payload.end_time == null || this.payload.end_time == '')
        && this.payload.endtime_enable == true
      ) {
        this.validate.end_time = 2;
        check = true
      }

      if (
        (this.assignClass.length == 0 && this.regime != 'PUBLIC' && this.tab == 1) ||
        (this.assignGroup.length == 0 && this.regime != 'PUBLIC' && this.tab == 2)
      ) {
        this.validate.assign = 2;
        check = true
      }

      return check
    },

    async handleSetting() {
      if (this.checkValidate()) return

      this.loading = true;

      if (this.regime != "PUBLIC") {
        this.payload.privacy = this.tab == 1 ? "ASSIGN_CLASS" : "ASSIGN_GROUP";
        this.payload.assign_ids =
          this.tab == 1
            ? this.assignClass.map(item => item.id)
            : this.assignGroup.map(item => item.id);
      } else {
        this.payload.privacy = "PUBLIC";
      }
      delete this.payload.status;

      if (get(this.$route, 'query.id', false)) this.payload.exam_id = this.$route.query.id;

      const result = await this.postSemesterExamSetting(this.payload);
      if (result.success == RESPONSE_SUCCESS) {
        this.$toasted.success("Cài đặt kỳ thi thành công");
        this.$emit("go-exam");
      } else {
         this.$toasted.error(get(result, 'message', 'Cài đặt kỳ thi thất bại'));
      }

      this.loading = false;
      this.selectedGItems = [];
      this.selectedCItems = [];
    },

    handleCheckboxGroup(id, e) {
      if (e) {
        this.selectedGItems.push(id);
      } else {
        this.selectedGItems = [...this.selectedGItems].filter(item => {
          return item != id;
        });
      }
      this.assignGroup = [...this.groupList].filter(item => {
        return this.selectedGItems.includes(item.id);
      });
    },

    handleCheckboxClass(id, e) {
      if (e) {
        this.selectedCItems.push(id);
      } else {
        this.selectedCItems = [...this.selectedCItems].filter(item => {
          return item != id;
        });
      }
      this.assignClass = [...this.classList].filter(item => {
        return this.selectedCItems.includes(item.id);
      });
    },

    async handleData() {
      await this.getListStudyGroup();
      if (
        get(this.$route, "query.id", false)
      ) {
        await this.viewSemesterExamSetting({
          params: { exam_id: this.$route.query.id }
        });
      }
      this.payload = Object.assign({}, this.payload, this.setting);
      if (this.setting.privacy == 'ASSIGN_GROUP') {
        this.assignGroup = this.setting.assigns;
        this.selectedGItems = this.assignGroup.map(item => {
          return item.id;
        });
        this.regime = "NONE_PUBLIC";
        this.tab = 2;
      } else if (this.setting.privacy == 'ASSIGN_CLASS') {
        this.assignClass = this.setting.assigns;
        this.selectedCItems = this.assignClass.map(item => {
          return item.id;
        });
        this.regime = "NONE_PUBLIC";
        this.tab = 1;
      } else {
        this.regime = "PUBLIC";
      }

      if (this.setting.fees > 0) {
        this.free = true;
      } else {
        this.free = false;
      }

      console.log("handleData", this.payload, this.assignGroup, this.assignClass);
    }
  },

  created() {
    this.handleData();
  },

};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/exams/_exams-create-setting.scss";
</style>
