<template>
  <app-modal
    centered
    :width="600"
    :component-class="{ 'invite-student-modal': true }"
    :footer="false"
    title="Gửi Email thông báo lịch học"
    @close="close(false)"
  >
    <div slot="content">
      <div>
        <p>
          Gửi thông báo lịch học của <b>{{title}}</b> tới học sinh của bạn.
        </p>
        <div class="mt-4 d-flex-center">
          <strong class="pr-4">Chọn lớp</strong>
          <app-vue-select
            class="app-vue-select filter-form__item__selection"
            style="width: 19rem"
            v-model="classSelected"
            :options="classList"
            label="text"
            placeholder="Chọn lớp"
            has-border
            @input="handleChangedClass"
          ></app-vue-select>
        </div>
      </div>

      <div class="student-list">
        <div class="item">
          <app-checkbox class="ml-auto" @click="handleAllCheckbox" :checked="checkAll">
            <strong>Chọn tất cả danh sách</strong>
          </app-checkbox>
        </div>
        <div class="item" v-for="(item, index) in studentList ? studentList : []" :key="index">
          <app-checkbox
            class="ml-auto"
            @click="handleCheckbox(item.student_id)"
            :checked="arrMember.includes(item.student_id)"
          >{{item.name}}</app-checkbox>
        </div>
      </div>
      <div class="text-center mt-4">
        <app-button color="white" class="mr-4 pl-5 pr-5" square @click="close(false)">Hủy</app-button>
        <app-button square @click="hanldeInvate" class="pl-5 pr-5">Gửi</app-button>
      </div>
    </div>
  </app-modal>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { useEffect, getParamQuery } from "~/utils/common";

const STORE_TEACHING_OLCLASS = "elearning/teaching/olclass";
const STORE_CLASSES = "elearning/teaching/classes";
const STORE_STUDENT = "elearning/teaching/school-students";

export default {
  components: {},
  props: {
    title: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      arrMember: [],
      classSelected: null,
      classList: [],
      studentList: [],
      checkAll: false,
      invateStudent: {
        invitation_ids: ["string"],
        online_class_id: "string",
        student_ids: ["string"]
      }
    };
  },

  methods: {
    close(invite) {
      this.$emit("close", invite);
    },

    arrayToStringIds(data) {
      return data.reduce((result, item) => {
        const com = result ? '","' : "";
        return (result = result + com + item);
      }, "");
    },

    async hanldeInvate() {
      if (this.arrMember.length > 0) {
        const online_class_id = this.$route.params.id
          ? this.$route.params.id
          : "";
        let params = {
          online_class_id: online_class_id,
          student_ids: [...this.arrMember]
        };
        try {
          const result = await this.$store.dispatch(
            `${STORE_TEACHING_OLCLASS}/${actionTypes.TEACHING_OLCLASS_INVITES.ADD}`,
            params
          );
          if (result.success) {
            this.$toasted.success("Đã gửi thông báo lịch học thành công");
            this.close(true);
          } else {
            this.$toasted.error("Gửi thông báo thất bại");
          }
        } catch (e) {
        } finally {
        }
      }
    },

    async handleChangedClass() {
      this.checkAll = false;
      this.arrMember = [];

      let params = {
        size: 9999
      };

      if (this.classSelected) params.class_id = this.classSelected.value;

      try {
        await this.$store.dispatch(
          `${STORE_STUDENT}/${actionTypes.TEACHING_SCHOOL_STUDENTS.LIST}`,
          {params}
        );
        this.studentList = this.get(this.stateStudents,"content",[]);
      } catch (e) {
      } finally {
      }
    },

    handleAllCheckbox() {
      this.checkAll = !this.checkAll;
      this.$nextTick(() => {
        if (this.checkAll) {
          this.studentList.forEach(item => {
            if (item.student_id) this.arrMember.push(item.student_id);
          });
        } else {
          this.arrMember = [];
        }
      });
    },

    handleCheckbox(_id) {
      if (this.arrMember.includes(_id)) {
        this.arrMember = this.arrMember.filter(item => item !== _id);
      } else {
        this.arrMember.push(_id);
      }

      this.checkAll && (this.checkAll = false);
      this.$nextTick(() => {
        this.arrMember.length === this.studentList.length &&
          (this.checkAll = true);
      });
    },

    async getSchoolClasses() {
      try {
        let params = {
          size: 9999
        };
        await this.$store.dispatch(
          `${STORE_CLASSES}/${actionTypes.ELEARNING_TEACHING_CLASS.LIST}`, {params}
        );
        let lessonList = this.get(this.stateClasses, "content", []);
        let list = [];
        list.push({
          value: null,
          text: "Tất cả"
        });
        lessonList.forEach(element => {
          list.push({
            value: element.id,
            text: element.name
          });
        });
        this.classList = list;
      } catch (e) {
      } finally {
      }
    },

    get
  },

  computed: {
    ...mapState(STORE_CLASSES, {
      stateClasses: "teachingClasses"
    }),
    ...mapState(STORE_STUDENT, {
      stateStudents: "students"
    })
  },

  created() {
    this.getSchoolClasses();
    this.handleChangedClass();
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/olclass/invite-student.scss";
</style>