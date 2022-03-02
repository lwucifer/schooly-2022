<template>
  <div>
    <div class="container">
      <breadcrumb />

      <div class="row">
        <div class="col-md-3 sub-side">
          <sub-side>
            <template v-slot:content>
              <ElearningManagerSide active="3" />
            </template>
          </sub-side>
        </div>
        <div class="col-md-9">
          <sub-block-section title="Tạo phòng học online" has-icon>
            <template v-slot:content>
              <div class="olclasses-create-main">
                <div class="mt-2">
                  <div class="row mb-5">
                    <app-radio
                      class="col-md-3"
                      :checked="true"
                      name="checkType"
                      @input="
                        (checkRadio = 'elearning'),
                          (params.assignment_type = 'ELEARNING')
                      "
                      >Bài giảng khóa học</app-radio
                    >
                    <app-radio
                      class="col-md-3"
                      name="checkType"
                      @input="
                        (checkRadio = 'class'),
                          (params.assignment_type = 'CLASS')
                      "
                      >Lớp học</app-radio
                    >
                    <app-radio
                      class="col-md-3"
                      name="checkType"
                      @input="
                        (checkRadio = 'group'),
                          (params.assignment_type = 'GROUP')
                      "
                      >Nhóm học tập</app-radio
                    >
                  </div>

                  <div class="form-item" v-if="checkRadio == 'class'">
                    <label>
                      <strong>Thuộc lớp học</strong>
                    </label>
                    <app-vue-select
                      multiple
                      style="width: 25rem"
                      class="app-vue-select form-item__selection"
                      label="name"
                      placeholder="Chọn lớp học"
                      has-border
                      v-model="filterClass"
                      :reduce="(item) => item"
                      :options="classList"
                      @input="(e) => handleChangedClass(e)"
                    ></app-vue-select>
                  </div>

                  <div class="form-item" v-else-if="checkRadio == 'group'">
                    <label>
                      <strong>Thuộc nhóm học tập</strong>
                    </label>
                    <app-vue-select
                      multiple
                      style="width: 25rem"
                      class="app-vue-select form-item__selection"
                      placeholder="Chọn nhóm học tập"
                      has-border
                      v-model="filterClassGroup"
                      :options="classGroup"
                      :reduce="(item) => item"
                      @input="(e) => handleChangedClassGroup(e)"
                      label="name"
                    ></app-vue-select>
                  </div>

                  <div class="form-item" v-else-if="checkRadio == 'elearning'">
                    <label>
                      <strong>Thuộc bài giảng/ khóa học</strong>
                    </label>
                    <app-vue-select
                      style="width: 25rem"
                      class="app-vue-select form-item__selection"
                      v-model="filterCourse"
                      :options="courses"
                      label="text"
                      placeholder="Chọn bài giảng/khóa học"
                      @input="(e) => handleChangedCourse(e)"
                      has-border
                    ></app-vue-select>
                  </div>

                  <div class="form-item">
                    <label>
                      <strong>Tên phòng học</strong> (Tối đa 150 ký tự)
                    </label>
                    <div class="input-limit">
                      <input
                        type="text"
                        :value="params.name"
                        @input="changeName"
                      />
                      <span class="limit">{{ params.name.length }}</span>
                    </div>
                  </div>

                  <div class="form-item">
                    <p>
                      <strong>Lịch học</strong> (Việc tạo lịch học là bắt buộc)
                    </p>

                    <div
                      class="box22 border mt-3"
                      v-for="(item, index) in params.schedules"
                      :key="index"
                    >
                      <div v-if="indexEdit === index || indexShow === index">
                        <div class>
                          <div class="d-flex-center">
                            <h6 class="mb-3">Giờ học</h6>
                            <div class="ml-auto" v-if="indexEdit === index">
                              <button v-on:click="indexEdit = null">
                                <IconCreate
                                  height="20"
                                  width="20"
                                  class="fill-primary"
                                />
                              </button>
                              <button v-on:click="removeSchedule(index, true)">
                                <IconTrashAlt
                                  height="20"
                                  width="20"
                                  class="fill-red"
                                />
                              </button>
                            </div>
                          </div>
                          <div class="d-flex-center">
                            <div class="d-flex-center mb-4 mr-6">
                              <label class="mr-3">Bắt đầu vào lúc</label>
                              <app-date-picker
                                class="ml-3"
                                v-model="schedules[index].start_time"
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
                              <!-- <app-vue-select
                                style="width: 7.6rem"
                                class="app-vue-select form-item__selection mr-3"
                                label="text"
                                placeholder="Giờ"
                                has-border
                              ></app-vue-select> -->
                              <!-- <app-vue-select
                                style="width: 7.6rem"
                                class="app-vue-select form-item__selection"
                                label="text"
                                placeholder="Buổi"
                                :options="typeSession"
                                has-border
                              ></app-vue-select> -->
                            </div>
                            <div class="d-flex-center mb-4">
                              <label class="mr-3">Thời lượng</label>
                              <app-date-picker
                                class="ml-3"
                                v-model="schedules[index].duration"
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
                              <!-- <app-vue-select
                                style="width: 7.6rem"
                                class="app-vue-select form-item__selection mr-3"
                                label="text"
                                placeholder="Giờ"
                                :options="hours"
                                has-border
                              ></app-vue-select>
                              <app-vue-select
                                style="width: 7.6rem"
                                class="app-vue-select form-item__selection"
                                label="text"
                                placeholder="Phút"
                                :options="minute"
                                has-border
                              ></app-vue-select> -->
                            </div>
                          </div>
                        </div>

                        <div class="form-item mb-5">
                          <label>
                            <strong>Ngày học trong tuần</strong>
                          </label>
                          <div class="d-flex-center mt-3">
                            <app-checkbox
                              @change="check($event, 'MON', index)"
                              :checked="
                                checkIncules(selectedItems[index], 'MON')
                              "
                              label="Thứ 2"
                              :isChangeLabelColor="true"
                            ></app-checkbox>
                            <app-checkbox
                              @change="check($event, 'TUE', index)"
                              :checked="
                                checkIncules(selectedItems[index], 'TUE')
                              "
                              label="Thứ 3"
                              :isChangeLabelColor="true"
                            />
                            <app-checkbox
                              @change="check($event, 'WED', index)"
                              :checked="
                                checkIncules(selectedItems[index], 'WED')
                              "
                              label="Thứ 4"
                              :isChangeLabelColor="true"
                            />
                            <app-checkbox
                              @change="check($event, 'THU', index)"
                              :checked="
                                checkIncules(selectedItems[index], 'THU')
                              "
                              label="Thứ 5"
                              :isChangeLabelColor="true"
                            />
                            <app-checkbox
                              @change="check($event, 'FRI', index)"
                              :checked="
                                checkIncules(selectedItems[index], 'FRI')
                              "
                              label="Thứ 6"
                              :isChangeLabelColor="true"
                            />
                            <app-checkbox
                              @change="check($event, 'SAT', index)"
                              :checked="
                                checkIncules(selectedItems[index], 'SAT')
                              "
                              label="Thứ 7"
                              :isChangeLabelColor="true"
                            />
                            <app-checkbox
                              @change="check($event, 'SUN', index)"
                              :checked="
                                checkIncules(selectedItems[index], 'SUN')
                              "
                              label="Chủ nhật"
                              :isChangeLabelColor="true"
                            />
                          </div>
                        </div>

                        <div class="d-flex">
                          <div class="form-item mb-0">
                            <label>
                              <strong>Thời gian áp dụng</strong>
                            </label>
                            <div>
                              <div class="d-flex-center mt-15">
                                <div class="d-flex-center mr-4">
                                  <label>Từ</label>
                                  <app-date-picker
                                    class="ml-3"
                                    v-model="schedules[index].from_date"
                                    square
                                    size="sm"
                                    placeholder="yyyy-mm-dd"
                                    valueFormat="YYYY-MM-DD"
                                    @input="
                                      (e) =>
                                        schedulesDateChange(e, index, false)
                                    "
                                    :clearDate="fromClear"
                                  >
                                    <template v-slot:icon-calendar>
                                      <IconCalendar />
                                    </template>
                                  </app-date-picker>
                                </div>
                                <div class="d-flex-center">
                                  <label>Đến</label>
                                  <app-date-picker
                                    class="ml-3"
                                    v-model="schedules[index].to_date"
                                    square
                                    size="sm"
                                    placeholder="yyyy-mm-dd"
                                    valueFormat="YYYY-MM-DD"
                                    @input="
                                      (e) => schedulesDateChange(e, index, true)
                                    "
                                    :clearDate="toClear"
                                  >
                                    <template v-slot:icon-calendar>
                                      <IconCalendar />
                                    </template>
                                  </app-date-picker>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="form-item mb-0 ml-5">
                            <label>
                              <strong>Phụ trách giảng dạy</strong>
                            </label>
                            <div class="pt-2">
                              <app-vue-select
                                :disabled="!assignableCheck"
                                style="width: 15rem"
                                class="app-vue-select form-item__selection"
                                label="text"
                                placeholder="Chọn giáo viên"
                                :options="teacherList"
                                @input="(e) => handleChangedTeacher(e, index)"
                                has-border
                              ></app-vue-select>
                            </div>
                          </div>
                        </div>
                        <div class="mt-5">
                          <app-button
                            color="white"
                            class="mr-4 color-red border"
                            @click="cancelTime(index)"
                            v-if="schedules.length > 1 || index == indexEdit"
                            >Hủy</app-button
                          >
                          <app-button
                            @click="saveTime(index)"
                            :disabled="!checkSchedule"
                          >
                            <span v-if="index == indexEdit">Cập nhật</span>
                            <span v-else>Thêm lịch học</span>
                          </app-button>
                        </div>
                      </div>

                      <div v-else class="d-flex-center">
                        <div class="mr-4">
                          {{ getTimeHH_MM_A(schedules[index].start_time) }} -
                          {{
                            getEndTime(
                              schedules[index].start_time,
                              schedules[index].duration
                            )
                          }}
                        </div>
                        <div class="mr-4">
                          {{ convertDay(index) }}
                        </div>
                        <div>
                          {{ getDateBirthDay(item.from_date) }} -
                          {{ getDateBirthDay(item.to_date) }}
                        </div>
                        <div style="margin-left:4rem">
                          {{ teacherChoice[index] }}
                        </div>
                        <div class="ml-auto" style="display: flex">
                          <button v-on:click="editSchedule(index)">
                            <IconCreate
                              height="20"
                              width="20"
                              class="fill-primary"
                            />
                          </button>
                          <button v-on:click="removeSchedule(index)">
                            <IconTrashAlt
                              height="20"
                              width="20"
                              class="fill-red ml-3"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="mt-4 mb-4"
                  v-if="indexEdit === null && indexShow === null"
                >
                  <button class="d-flex-center color-primary" @click="addTime">
                    <IconPlus class="fill-primary mr-2" />Thêm lịch học
                  </button>
                </div>
              </div>

              <div class="mt-4 mb-4 text-right">
                <app-button @click="fnSave" :disabled="!fullParams" class="">
                  <IconRight class="fill-white mr-3" />Tạo phòng học
                </app-button>
              </div>
            </template>
          </sub-block-section>
        </div>
      </div>
    </div>

    <app-modal-confirm
      v-if="showModalConfirm"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      :width="550"
      @cancel="handleCancelModal"
      title="Bạn muốn tạo phòng học này?"
      description="Các thông tin phòng học không thể thay đổi sau khi được tạo."
    />

    <app-modal-notify
      :width="550"
      @ok="okNotify"
      @close="okNotify"
      v-if="showNotify"
      :footer="false"
      :header="false"
      title=""
      :description="message"
    >
    </app-modal-notify>
  </div>
</template>

<script>
import IconCalendar from "~/assets/svg/icons/calendar2.svg?inline";
import IconPlus from "~/assets/svg/icons/plus2.svg?inline";
import IconCreate from "~/assets/svg/icons/edit.svg?inline";
import IconTrashAlt from "~/assets/svg/icons/trash-alt.svg?inline";
import IconTrash from "~/assets/svg/v2-icons/trash-alt.svg?inline";
import IconClock from "~/assets/svg/icons/clock.svg?inline";
import IconRight from "~/assets/svg/v2-icons/arrow-right.svg?inline";
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";

import {
  getDateBirthDay,
  getUTCDateTime,
  getTimeHH_MM_A,
  getUTCDateTimeHH_MM_A,
  getEndTime,
  hoursToMinutes,
} from "~/utils/moment";
import moment from "moment";
import { get, reject } from "lodash";
import { mapState, mapGetters } from "vuex";
import * as actionTypes from "~/utils/action-types";
import {
  useEffect,
  getParamQuery,
  initBreadcrumb,
  createPageTitle,
  initPageTitle,
} from "~/utils/common";
import { addAllOptionSelect } from "~/utils/common";

const STORE_NAMESPACE = "elearning/teaching/olclass";
const STORE_PUBLIC_SEARCH = "elearning/public/public-search";

const initialSchedule = {
  from_date: "",
  to_date: "",
  start_time: "",
  duration: "",
  days_of_week: "",
  teacher_id: "",
};

function initialState() {
  return {
    schedulesUpdate: 0,
    fromClear: false,
    success: false,
    toClear: false,
    indexEdit: null,
    indexShow: 0,
    tab: 1,
    // hours: Array.from({ length: 12 }).map((_, i) => i+1 + ' ' + 'giờ'),
    hours: [
      {
        text: "1 giờ",
        value: 1,
      },
      {
        text: "2 giờ",
        value: 2,
      },
      {
        text: "3 giờ",
        value: 4,
      },
      {
        text: "4 giờ",
        value: 4,
      },
      {
        text: "5 giờ",
        value: 5,
      },
      {
        text: "6 giờ",
        value: 6,
      },
      {
        text: "7 giờ",
        value: 7,
      },
      {
        text: "8 giờ",
        value: 8,
      },
      {
        text: "9 giờ",
        value: 9,
      },
      {
        text: "10 giờ",
        value: 10,
      },
      {
        text: "11 giờ",
        value: 11,
      },
      {
        text: "12 giờ",
        value: 12,
      },
    ],
    minute: [
      {
        text: "5 phút",
        value: 5,
      },
      {
        text: "10 phút",
        value: 10,
      },
      {
        text: "15 phút",
        value: 15,
      },
      {
        text: "20 phút",
        value: 20,
      },
      {
        text: "25 phút",
        value: 25,
      },
      {
        text: "30 phút",
        value: 30,
      },
      {
        text: "35 phút",
        value: 5,
      },
      {
        text: "40 phút",
        value: 40,
      },
      {
        text: "45 phút",
        value: 45,
      },
      {
        text: "50 phút",
        value: 50,
      },
      {
        text: "55 phút",
        value: 55,
      },
    ],
    typeSession: [
      {
        text: "AM",
        value: "AM",
      },
      {
        text: "PM",
        value: "PM",
      },
    ],
    teacherChoice: [],
    message: "",
    sendMess: false,
    downloadVideo: false,
    showModalConfirmDraf: false,
    showModalConfirm: false,
    showNotify: false,
    confirmLoading: false,
    confirmDrafLoading: false,
    showBonus: false,
    schedules: [
      {
        from_date: "",
        to_date: "",
        start_time: "",
        duration: "",
        days_of_week: "",
        teacher_id: "",
      },
    ],
    filterCourse: null,
    filterClass: null,
    filterClassGroup: null,
    filterTeacher: null,
    courses: [],
    filterPrivacy: {
      value: true,
      text: "Công khai",
    },
    privacies: [
      {
        value: true,
        text: "Công khai",
      },
      {
        value: false,
        text: "Riêng tư",
      },
    ],
    selectedItems: [[]],
    params: {
      elearning_id: "",
      assign_class_ids: [],
      assign_group_ids: [],
      assignment_type: "ELEARNING",
      name: "",
      is_invite_all: false,
      is_allow_download: false,
      schedules: [initialSchedule],
    },
    checkRadio: "elearning",
  };
}

export default {
  name: "onlineclass",

  components: {
    IconTrash,
    IconClock,
    IconPlus,
    IconCalendar,
    IconTrashAlt,
    IconCreate,
    IconRight,
    ElearningManagerSide,
  },

  middleware: ["teacher-role"],

  data() {
    return initialState();
  },
  computed: {
    ...mapState("auth", ["loggedUser"]),
    ...mapState(STORE_PUBLIC_SEARCH, {
      stateElearnings: "Elearnings",
    }),
    ...mapState("elearning/study-group/group", {
      classes: "classes",
      groups: "groups",
      teacher: "teacher",
    }),
    ...mapGetters("auth", ["organizationId", "assignableCheck"]),
    classList() {
      console.log("[classList]", this.classes);
      // return this.classes && this.classes.filter(item => !item.is_hidden);
      return this.classes;
    },
    classGroup() {
      // return this.groups && this.groups.content && this.groups.content.filter(item => !item.is_hidden);
      return this.groups && this.groups.content;
    },
    teacherList() {
      return this.teacher.map((item) => {
        return {
          value: item.id,
          text: item.name,
        };
      });
    },
    fullParams() {
      return (
        (this.params.elearning_id ||
          this.params.assign_class_ids ||
          this.params.assign_group_ids) &&
        this.params.name &&
        this.indexShow === null &&
        this.indexEdit === null
      );
    },
    checkSchedule() {
      console.log("checkSchedule");
      let index = this.indexEdit != null ? this.indexEdit : this.indexShow;
      let update = this.schedulesUpdate;
      let item = this.schedules[index];
      return (
        this.schedules[index].from_date &&
        this.schedules[index].to_date &&
        this.schedules[index].start_time &&
        this.schedules[index].duration &&
        this.schedules[index].duration &&
        this.schedules[index].days_of_week
      );
    },
  },

  watch: {
    sendMess(newValue, oldValue) {
      this.params.is_invite_all = newValue;
    },
    downloadVideo(newValue, oldValue) {
      this.params.is_allow_download = newValue;
    },
    schedulesUpdate(newValue, oldValue) {
      this.updateSchedules();
    },
    schedules: {
      handler: function(newValue, oldValue) {
        this.updateSchedules();
      },
      deep: true,
    },
  },

  methods: {
    getTimeHH_MM_A,
    getDateBirthDay,
    getEndTime,

    changeSchedules(e) {
      console.log("changeSchedules", e);
      this.schedulesUpdate++;
    },

    updateSchedules() {
      console.log("updateSchedules");
      let schedules = [...this.schedules].reduce((result, item) => {
        let start_time = getUTCDateTimeHH_MM_A(
          new Date("2020-01-01 " + item.start_time)
        );
        let duration = hoursToMinutes(item.duration);
        result.push({ ...item, start_time: start_time, duration: duration });
        return result;
      }, []);
      this.params = { ...this.params, schedules: schedules };
    },

    schedulesDateChange(e, index, isTo) {
      this.fromClear = false;
      this.toClear = false;
      if (isTo) {
        if (
          this.schedules[index].from_date &&
          this.schedules[index].from_date > e
        ) {
          this.fromClear = true;
          this.schedules[index] = { ...this.schedules[index], from_date: null };
        } else {
          this.schedules[index] = { ...this.schedules[index], to_date: e };
        }
      } else {
        if (
          this.schedules[index].to_date &&
          this.schedules[index].to_date < e
        ) {
          this.toClear = true;
          this.schedules[index] = { ...this.schedules[index], to_date: null };
        } else {
          this.schedules[index] = { ...this.schedules[index], from_date: e };
        }
      }
      this.schedulesUpdate++;
      console.log("schedulesDateChange", this.schedules);
    },

    checkIncules(list, val) {
      let result = list ? list.includes(val) : false;
      return result;
    },

    convertDay(index) {
      const items = this.selectedItems[index];
      const sorter = {
        mon: 1,
        tue: 2,
        wed: 3,
        thu: 4,
        fri: 5,
        sat: 6,
        sun: 7,
      };
      let tmp = {};
      items.forEach(function(value) {
        let index = sorter[value.toLowerCase()];
        tmp[index] = value;
      });

      let i = 0;
      return Object.values(tmp).reduce((result, item) => {
        let text = "";
        if (item) i++;
        switch (item) {
          case "MON":
            text = "2";
            break;
          case "TUE":
            text = "3";
            break;
          case "WED":
            text = "4";
            break;
          case "THU":
            text = "5";
            break;
          case "FRI":
            text = "6";
            break;
          case "SAT":
            text = "7";
            break;
          case "SUN":
            text = "CN";
            break;
        }
        const com = i > 1 ? ", " : "";
        return (result = result + com + text);
      }, "Hàng tuần vào thứ ");
    },

    removeSchedule(index, editting) {
      this.schedules = _.reject([...this.schedules], (i, inx) => inx === index);
      this.selectedItems = _.reject(
        [...this.selectedItems],
        (i, inx) => inx === index
      );
      if (this.schedules.length === 0) {
        this.schedules.push(initialSchedule);
        this.selectedItems.push([]);
        this.indexShow = 0;
      } else {
        if (this.indexShow != null && this.indexShow > index)
          this.indexShow = this.indexShow - 1;
        if (this.indexEdit != null && this.indexEdit > index)
          this.indexEdit = this.indexEdit - 1;
        if (editting) this.indexEdit = null;
      }
      this.teacherChoice.splice(index, 1);
    },
    editSchedule: function(index) {
      if (this.indexShow != null) {
        this.schedules.pop();
        this.selectedItems.pop();
      }
      this.indexEdit = index;
      this.indexShow = null;
    },

    addTime() {
      this.indexEdit = null;
      this.indexShow = this.schedules.length;
      this.schedules.push(initialSchedule);
      this.selectedItems.push([]);
    },

    cancelTime(index) {
      if (
        this.schedules.length === index + 1 &&
        this.indexEdit == null &&
        index > 0
      ) {
        this.schedules.pop();
        this.selectedItems.pop();
        this.indexShow = null;
      } else if (this.schedules.length > 1) {
        this.indexShow = null;
        this.indexEdit = null;
      } else {
        this.indexShow = null;
        this.indexEdit = null;
      }
    },
    saveTime(index) {
      if (this.checkSchedule) {
        this.indexEdit = null;
        this.indexShow = null;
      }
    },

    changeName(e) {
      if (e.target.value.length < 151) {
        this.params.name = e.target.value;
      } else {
        e.target.value = this.params.name;
      }
    },

    async handleOk() {
      try {
        for (let index = 0; index < this.params.schedules.length; index++) {
          const el = this.params.schedules[index];
          const that = this;
          console.log("handleOk");
          if (el.start_time.lastIndexOf("PM" != -1)) {
            const indexOfCheck = el.start_time.lastIndexOf(" ");
            const checkData = el.start_time.slice(0, indexOfCheck);
            const date1 = Date.parse(`01/01/2020 ${checkData}`);
            const date2 = Date.parse("01/01/2020 5:00");
            if (date1 > date2) {
              that.params.schedules[index].from_date = moment(el.from_date)
                .subtract(1, "days")
                .format("YYYY-MM-DD");
            }
          }
        }
        this.confirmLoading = true;
        const doCreate = await this.$store.dispatch(
          `${STORE_NAMESPACE}/${actionTypes.TEACHING_OLCLASSES.ADD}`,
          JSON.stringify({ ...this.params, enable: true })
        );
        if (doCreate.success) {
          this.fnCancel();
          this.message = "Tạo phòng học thành công!";
          this.showNotify = true;
          this.success = true;
        } else if (doCreate.message) {
          this.message = doCreate.message;
          this.showNotify = true;
        }
      } catch (e) {
        this.message = e;
        this.showNotify = true;
      } finally {
        this.confirmLoading = false;
        this.showModalConfirm = false;
      }
    },

    fnCancel() {
      let temp = [...this.courses];
      Object.assign(this.$data, initialState());
      this.courses = [...temp];
    },

    fnSave() {
      if (this.fullParams) {
        this.showModalConfirm = true;
      }
    },

    handleCancelModal() {
      this.showModalConfirm = false;
      this.confirmLoading = false;
    },

    handleDrafCancelModal() {
      this.showModalConfirmDraf = false;
      this.confirmDrafLoading = false;
    },

    async getElearnings() {
      try {
        let userId = this.$store.state.auth.token
          ? this.$store.state.auth.token.id
          : "";
        await this.$store.dispatch(
          `${STORE_PUBLIC_SEARCH}/${actionTypes.ELEARNING_PUBLIC_ELEARNING.LIST}`,
          { params: { teacher_id: userId, status: "APPROVED" } }
        );
        let lessonList = this.get(this.stateElearnings, "data", []);
        let list = [];
        lessonList.forEach((element) => {
          if (!element.is_hidden && !element.is_has_active_online_class) {
            list.push({
              value: element.id,
              text: element.name,
              privacy: element.privacy == "PUBLIC" ? true : false,
            });
          }
        });
        this.courses = list;
      } catch (e) {
      } finally {
      }
    },

    handleChangedClass(e) {
      console.log("handleChangedClass", e);
      const itemIndex = e[e.length - 1];
      if (itemIndex && itemIndex.is_has_active_online_class) {
        this.$router.push(
          `/elearning/manager/online-class/edit/${itemIndex.online_class_id}`
        );
      } else {
        this.params.assign_class_ids = e.map((k) => {
          return k.id;
        });
      }
    },

    handleChangedClassGroup(e) {
      console.log("handleChangedClassGroup", e);
      // this.params.assign_group_ids = e;
      const itemIndex = e[e.length - 1];
      if (itemIndex && itemIndex.is_has_active_online_class) {
        this.$router.push(
          `/elearning/manager/online-class/edit/${itemIndex.online_class_id}`
        );
      } else {
        this.params.assign_group_ids = e.map((k) => {
          return k.id;
        });
      }
    },

    handleChangedCourse(e) {
      console.log("handleChangedCourse", e);
      this.params.elearning_id = (e && e.value) || "";
      this.filterPrivacy = {
        value: e && e.privacy,
        text: e && e.privacy ? "Công khai" : "Riêng tư",
      };
    },

    handleChangedTeacher(e, index) {
      console.log("handleChangedTeacher", e.value);
      this.schedules[index].teacher_id = e && e.value;
      this.params.schedules[index].teacher_id = e && e.value;
      if (this.teacherChoice[index] || this.teacherChoice[index] == "") {
        this.teacherChoice[index] = e && e.text;
      } else {
        if (this.teacherChoice.length < index) {
          for (let i = 0; i < index; i++) {
            this.teacherChoice.push("");
          }
        }
        this.teacherChoice.push(e && e.text);
      }
    },
    handleChangedPrivacy() {
      this.params.privacy = this.filterPrivacy.value;
    },

    check(checked, item, index) {
      if (checked) {
        this.pushSelectedIndexes(item, index);
      } else {
        this.popSelectedIndexes(item, index);
      }
    },
    popSelectedIndexes(item, index) {
      if (this.selectedItems[index].includes(item)) {
        let temp = [...this.selectedItems[index]].filter((i) => {
          return i !== item;
        });
        this.selectedItems.splice(index, 1, temp);
        this.schedules.splice(index, 1, {
          ...this.schedules[index],
          days_of_week: this.arrayToString(this.selectedItems[index]),
        });
      }
    },
    pushSelectedIndexes(item, index) {
      if (!_.some(this.selectedItems[index], item)) {
        this.selectedItems[index].push(item);
        this.schedules.splice(index, 1, {
          ...this.schedules[index],
          days_of_week: this.arrayToString(this.selectedItems[index]),
        });
      }
    },

    okNotify() {
      this.showNotify = false;
      if (this.success) this.$router.push("./");
    },

    arrayToString(data) {
      return data.reduce((result, item) => {
        const com = result ? "," : "";
        return (result = result + com + item);
      }, "");
    },

    get,
  },

  created() {
    this.getElearnings();
    const params = {
      page: 1,
      size: 999,
      school_id: get(this, "organizationId", ""),
      type: "CLASS",
    };
    const paramTeacher = {
      organization_id: get(this, "organizationId", ""),
    };
    this.$store.dispatch(
      "elearning/study-group/group/getClassesAssignment",
      params
    );
    this.$store.dispatch(
      `elearning/study-group/group/${actionTypes.STUDY_GROUP.LIST}`,
      params
    );
    this.assignableCheck &&
      this.$store.dispatch(
        "elearning/study-group/group/getTeacher",
        paramTeacher
      );
  },
  mounted() {
    const breadcrumb = [
      {
        title: "Quản lý E-learning",
        to: "/elearning/manager",
      },
      {
        title: "Phòng học online",
        to: "/elearning/manager/online-class",
      },
      {
        title: "Tạo mới",
        to: ``,
      },
    ];
    initBreadcrumb(this, breadcrumb);
    initPageTitle(this, createPageTitle("Quản lý phòng học online"));
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/manager/_elearning-olclasses.scss";
strong {
  color: #222;
}
.input-limit {
  position: relative;
  input {
    border: 1px solid #e0e0e0;
    border-radius: 2px;
    height: 4rem;
    width: 100%;
    padding: 0 5rem 0 1.5rem;
  }
  .limit {
    background: $color-primary;
    padding: 0 1rem;
    color: #fff;
    position: absolute;
    right: 0;
    top: 0;
    height: 4rem;
    width: 4rem;
    line-height: 4rem;
    text-align: center;
  }
}
</style>
