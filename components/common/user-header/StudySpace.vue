<template>
  <div class="wrap-study-space">
    <app-dropdown
      position="left"
      v-model="dropdownCourse"
      class="link--dropdown link--dropdown-course"
    >
      <n-link slot="activator" class="item" to="/elearning/mycourses">
        Góc học tập
        <IconArrowDropDown24px />
      </n-link>
      <div class="link--dropdown__content wrap-arrow__content">
        <ul>
          <template v-for="(elearning,index) in filterElearningStudy">
            <li :key="index" v-if="index < 3" @click="handleClickLink">
              <template>
                <n-link :to="'/elearning/'+ elearning.elearning_id">
                  <div>
                    <div class="d-flex">
                      <img v-lazy="elearning.avatar.low" class="avatar-elearning__study" />
                      <span class="ml-2 name-elearning__study">{{elearning.name}}</span>
                    </div>
                    <div class="proccess-bar-study-border">
                      <div class="percent-proccess" v-bind:style="{width: elearning.progress +'%'}"></div>
                    </div>
                    <div>
                      <span>Đã hoàn thành:</span>
                      <strong class="color-primary">{{elearning.progress}}%</strong>
                    </div>
                  </div>
                </n-link>
              </template>
            </li>
          </template>
          <li class="text-center" @click.prevent="pushMycourses">
            <!-- <n-link to="/elearning/mycourses">Xem thêm</n-link> -->
            <n-link to>Xem thêm</n-link>
          </li>
        </ul>
      </div>
    </app-dropdown>
  </div>
</template>

<script>
import IconArrowDropDown24px from "~/assets/svg/v2-icons/arrow_drop_down_24px.svg?inline";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { isCommonElementIn2Array } from "~/utils/common";
import { USER_ROLES } from "~/utils/constants";
export default {
  data() {
    return {
      dropdownCourse: false,
      elearningListHeader: []
    };
  },
  components: {
    IconArrowDropDown24px
  },
  // async fetch({ params, query, store }) {
  //   const payload = {
  //     params: {
  //       types: "ALL",
  //       size: 3,
  //       page: 1
  //     }
  //   };
  //   await Promise.all([
  //     store.dispatch(
  //       `elearning/study/study-student-space/${actionTypes.ELEARNING_STUDY_STUDENT.LIST}`,
  //       payload
  //     )
  //   ]);
  // },
  methods: {
    async fetchElearningList() {
      const payload = {
        params: {
          types: "ALL",
          size: 3,
          page: 1
        }
      };
      await this.$store.dispatch(
        `elearning/study/study-student-space/${actionTypes.ELEARNING_STUDY_STUDENT.LIST}`,
        payload
      );
    },
    async fetchProfile() {
      await Promise.all([
        this.$store.dispatch(`account/${actionTypes.ACCOUNT_PROFILE.LIST}`)
      ]);
    },
    checRoleStudent() {
      let isValid = true;
      isValid = isCommonElementIn2Array(this.userRoles, [
        USER_ROLES.ROLE_STUDENT
      ]);
      return isValid;
    },
    pushMycourses() {
      this.dropdownCourse = false;
      this.$router.push("/elearning/mycourses/courses");
    },
    handleClickLink(){
      this.dropdownCourse = false;
    },
    get
  },
  computed: {
    ...mapState("elearning/study/study-student-space", {
      elearningStudyStudent: "elearningStudyStudent"
    }),
    ...mapState("account", { profile: "profileList" }),
    userRoles() {
      return this.get(this, "profile.role.authority", false) || [];
    },
    filterElearningStudy() {
      return this.elearningStudyStudent && this.elearningStudyStudent.content
        ? this.elearningStudyStudent.content
        : [];
    }
  },
  async mounted() {
    await Promise.all([
      this.fetchElearningList(),
      this.fetchProfile(),
    ])
    this.checRoleStudent();
    // this.elearningListHeader = get(this, "elearningStudyStudent.content", []);
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-study-space.scss";
</style>
