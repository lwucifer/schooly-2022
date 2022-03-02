<template>
  <div>
    <app-modal
      centered
      :width="610"
      :component-class="{ 'invite-student-modal': true }"
      :footer="false"
      @close="close(false)"
      title="Mời thêm học sinh"
    >
      <div slot="content">
        <div>
          <p>
            Gửi lời mời tham gia
            <b>{{elearningInfo && elearningInfo.name ? elearningInfo.name : ''}}</b>
            của bạn tới học sinh trong {{organizationName}}
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
              @input="handleChangedClass"
              has-border
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
          <app-button square @click="hanldeInvate" class="pl-5 pr-5">Mời</app-button>
        </div>
      </div>
    </app-modal>
    <app-modal-notify
      v-if="notify.showNotify"
      :title="notify.title"
      :type="notify.type"
      :okText="notify.okText"
      @close="closeNotify"
      @ok="closeNotify"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { useEffect, getParamQuery } from "~/utils/common";
import result from "../../../../../store/elearning/teaching/result";

const STORE_TEACHING_OLCLASS = "elearning/teaching/olclass";
const STORE_SCHOOL_CLASSES = "elearning/teaching/classes";
const STORE_TEACHING_INVITES = "elearning/teaching/invites";
const STORE_SCHOOL_STUDENT = "elearning/teaching/school-students";

export default {
  components: {},
  props: {
    elearningInfo: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      arrMember: [],
      name: "",
      classSelected: null,
      classList: [],
      studentList: [],
      checkAll: false,
      invateStudent: {
        invitation_ids: ["string"],
        online_class_id: "string",
        student_ids: ["string"],
      },
      notify: {
        type: "",
        title: "",
        showNotify: false,
        okText: "",
      },
    };
  },

  methods: {
    closeNotify() {
      this.notify.showNotify = false;
    },

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
        const elearningId =
          this.$route.query && this.$route.query.elearning_id
            ? this.$route.query.elearning_id
            : "";
        let params = {
          elearning_id: elearningId,
          student_ids: [...this.arrMember],
        };
        try {
          await this.$store
            .dispatch(
              `${STORE_TEACHING_INVITES}/${actionTypes.TEACHING_ELEARNING_INVITES.ADD}`,
              params
            )
            .then((result) => {
              if (result.success) {
                this.notify = {
                  title: "Gửi lời mời thành công!",
                  showNotify: true,
                  okText: "Đóng",
                  type: "success",
                };
                setTimeout(() => {
                  this.close(false);
                }, 2500);
              } else {
                this.notify = {
                  title: "Gửi lời mời thất bại!",
                  showNotify: true,
                  okText: "Đóng",
                  type: "error",
                };
              }
            });
        } catch (e) {
        } finally {
          this.close(true);
        }
      }
    },

    async handleChangedClass() {
      this.checkAll = false;
      this.arrMember = [];

      let params = {
        size: 9999,
      };

      if (this.classSelected) params.class_id = this.classSelected.value;

      try {
        await this.$store.dispatch(
          `${STORE_SCHOOL_STUDENT}/${actionTypes.TEACHING_SCHOOL_STUDENTS.LIST}`,
          { params }
        );
        this.studentList = this.get(this.stateSchoolStudents, "content", []);
      } catch (e) {
      } finally {
      }
    },

    handleAllCheckbox() {
      this.checkAll = !this.checkAll;
      this.$nextTick(() => {
        if (this.checkAll) {
          this.studentList.forEach((item) => {
            if (item.student_id) this.arrMember.push(item.student_id);
          });
        } else {
          this.arrMember = [];
        }
      });
    },

    handleCheckbox(_id) {
      if (this.arrMember.includes(_id)) {
        this.arrMember = this.arrMember.filter((item) => item !== _id);
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
          size: 9999,
        };
        await this.$store.dispatch(
          `${STORE_SCHOOL_CLASSES}/${actionTypes.ELEARNING_TEACHING_CLASS.LIST}`,
          { params }
        );
        let lessonList = this.get(this.stateSchoolClasses, "content", []);
        let list = [];
        list.push({
          value: null,
          text: "Tất cả",
        });
        lessonList.forEach((element) => {
          list.push({
            value: element.id,
            text: element.name,
          });
        });
        this.classList = list;
      } catch (e) {
      } finally {
      }
    },

    get,
  },

  computed: {
    ...mapState(STORE_SCHOOL_CLASSES, {
      stateSchoolClasses: "teachingClasses",
    }),
    ...mapState(STORE_SCHOOL_STUDENT, {
      stateSchoolStudents: "students",
    }),
    ...mapGetters("auth", ["organizationName"]),
  },

  created() {
    this.getSchoolClasses();
    this.handleChangedClass();
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/olclass/invite-student.scss";

.invite-student-modal .app-modal-content {
  padding: 2rem 1.5rem;
}
</style>