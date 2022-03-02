<template>
  <sub-block-section title="Thông tin đơn vị công tác">
    <template v-slot:content>
      <div class="form--normal">
        <div class="row">
          <div class="col-md-3">
            <label for class="form--normal__title">Tên trường</label>
          </div>
          <div class="col-md-9">
            <app-input v-model="organization.name" disabled />
          </div>
          <div class="col-md-3">
            <label for class="form--normal__title">Mã trường</label>
          </div>
          <div class="col-md-9">
            <app-input v-model="organization.code" disabled />
          </div>
          <div class="col-md-3">
            <label for class="form--normal__title">Email</label>
          </div>
          <div class="col-md-9">
            <app-input v-model="organization.email" disabled />
          </div>
          <div class="col-md-3">
            <label for class="form--normal__title">Số điện thoại</label>
          </div>
          <div class="col-md-9">
            <app-input v-model="organization.phone" disabled />
          </div>
          <div class="col-md-3">
            <label for class="form--normal__title">Địa chỉ</label>
          </div>
          <div class="col-md-9">
            <app-input v-model="organization.address" disabled />
          </div>
          <div class="col-md-3">
            <label for class="form--normal__title">Mã cán bộ</label>
          </div>
          <div class="col-md-9">
            <app-input v-model="work.code" disabled />
          </div>
          <div class="col-md-3">
            <label for class="form--normal__title">Chức vụ</label>
          </div>
          <div class="col-md-9">
            <app-input v-model="work.duty" disabled />
          </div>
          <div class="col-md-3">
            <label for class="form--normal__title">Tổ chuyên môn</label>
          </div>
          <div class="col-md-9">
            <app-input v-model="work.profession" disabled />
          </div>
          <div class="col-md-3">
            <label for class="form--normal__title">Lớp chủ nhiệm</label>
          </div>
          <div class="col-md-9">
            <app-input v-model="work.homeroom_class" disabled />
          </div>
          <div class="col-md-3">
            <label for class="form--normal__title">Các lớp giảng dạy</label>
          </div>
          <div class="col-md-9">
            <app-input v-model="work.teaching_classes" disabled />
          </div>
        </div>
      </div>
    </template>
  </sub-block-section>
</template>

<script>
import { mapState } from "vuex";
import { get, map } from "lodash";
export default {
  data() {
    return {
      accountType: get(this, "profileList.role.authority", ""),
      organization: {
        code: "",
        name: "",
        phone: "",
        email: "",
        address: ""
      },
      work: {
        class: "",
        code: "",
        profession: "",
        homeroom_class: "",
        teaching_classes: "",
        duty: ""
      }
    };
  },
  // props: {
  //   profileList: {
  //     type: Object
  //   }
  // },
  components: {},
  computed: {
    ...mapState("account", ["profileList"])
  },
  created() {
    // this.organization.code = get(this, "profileList.organization.code", "");
    // this.organization.name = get(this, "profileList.organization.name", "");
    // this.organization.phone = get(this, "profileList.organization.phone", "");
    // this.organization.email = get(this, "profileList.organization.email", "");
    // this.organization.address = get(
    //   this,
    //   "profileList.organization.address",
    //   ""
    // );
    // this.work.class = get(this, "profileList.work.classes", "");
    // this.work.code = get(this, "profileList.code", "");
    // this.work.profession = get(this, "profileList.work.profession", "");
    // this.work.homeroom_class = get(this, "profileList.work.homeroom_class", "");
    // const teachingClasses = get(this, "profileList.work.teaching_classes", "");
    // this.work.teaching_classes = map(teachingClasses).join(", ");
    // this.work.duty = get(this, "profileList.work.duty", "");
  },
  watch: {
    profileList: {
      handler: function() {
        this.organization.code = get(this, "profileList.organization.code", "");
        this.organization.name = get(this, "profileList.organization.name", "");
        this.organization.phone = get(
          this,
          "profileList.organization.phone",
          ""
        );
        this.organization.email = get(
          this,
          "profileList.organization.email",
          ""
        );
        this.organization.address = get(
          this,
          "profileList.organization.address",
          ""
        );
        this.work.class = get(this, "profileList.work.classes", "");
        this.work.code = get(this, "profileList.code", "");
        this.work.profession = get(this, "profileList.work.profession", "");
        this.work.homeroom_class = get(
          this,
          "profileList.work.homeroom_class",
          ""
        );
        const teachingClasses = get(
          this,
          "profileList.work.teaching_classes",
          ""
        );
        this.work.teaching_classes = map(teachingClasses).join(", ");
        this.work.duty = get(this, "profileList.work.duty", "");
      }
    }
  }
};
</script>

<style lang="scss">
</style>