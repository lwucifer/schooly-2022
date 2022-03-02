<template>
  <sub-block-section :hasTitle="false">
    <template #content>
      <div class="form--normal pt-3">
        <div class="row">
          <div class="col-md-3">
            <label for class="form--normal__title">Ảnh đại diện</label>
          </div>
          <div class="col-md-9">
            <div class="app-input app-input--size-md">
              <!-- <UploadAvatar :av-src="filterAvatarSrc" /> -->
              <img
                style="width: 96px; height: 96px; background-color: #f6f6f6"
                :src="filterAvatarSrc || require('~/assets/svg/images/default-avatar.svg?data')"
                alt
              />
            </div>
          </div>

          <div class="col-md-3">
            <label for class="form--normal__title">Họ và tên</label>
          </div>
          <div class="col-md-9">
            <app-input v-model="name" disabled />
          </div>

          <div class="col-md-3">
            <label for class="form--normal__title">Số điện thoại</label>
          </div>
          <div class="col-md-9">
            <app-input v-model="phone" disabled />
          </div>

          <div class="col-md-3">
            <label for class="form--normal__title">Email</label>
          </div>
          <div class="col-md-9">
            <app-input v-model="email" disabled />
          </div>

          <div class="col-md-3">
            <label for class="form--normal__title">Giới tính</label>
          </div>
          <div class="col-md-2">
            <app-input v-model="sex" class="sex_Profile" disabled />
          </div>

          <div class="col-md-1"></div>
          <div class="col-md-2">
            <label for class="form--normal__title">Ngày sinh</label>
          </div>
          <div class="col-md-2">
            <app-input v-model="birthday" class="birthday_Profile" disabled />
          </div>

          <div class="col-md-3" v-if="isTeacherRole">
            <label for class="form--normal__title">Tiểu sử</label>
          </div>
          <div class="col-md-9" v-if="isTeacherRole">
            <div v-if="story == null || story == ''">
              <app-button
                color="transparent"
                flat
                square
                style="box-shadow: none;"
                class="p-0"
                @click="addStory"
              >
                <slot name="icon">
                  <IconPlus
                    class="icon--btn icon--btn--pre fill-opacity-1"
                    style="height: 1.6rem; width: 1.6rem;"
                  />
                </slot>
                <span class="text-primary">Thêm tiểu sử</span>
              </app-button>
            </div>

            <div v-else>
              <div>
                <div class="box-content-fixed-height mb-4" v-if="!editingStory">
                  <div
                    class="overflow-y-scroll"
                    v-html="story"
                    style="max-height: 16rem; overflow-y: auto; margin-right: -5px;"
                  ></div>
                </div>
                <div class="d-flex" v-if="!editingStory">
                  <button class="btn-transparent btn--success mr-4" @click="editStory">
                    <IconEdit class />
                    <span>Chỉnh sửa</span>
                  </button>
                  <button class="btn-transparent btn--danger" @click="handleDeleteStory">
                    <IconTrashAlt class />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </div>
            <AccountStoryForm
              v-if="editingStory"
              :story="story"
              :edit="checkEdit"
              @cancel="cancel"
              @submit="submitStory"
            ></AccountStoryForm>
          </div>

          <div class="col-md-3 mt-4">
            <label for class="form--normal__title">Tên trường</label>
          </div>
          <div class="col-md-9 mt-4">
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

          <div class="col-md-3" v-if="isTeacherRole">
            <label for class="form--normal__title">Mã cán bộ</label>
          </div>
          <div class="col-md-9" v-if="isTeacherRole">
            <app-input v-model="work.code" disabled />
          </div>

          <div class="col-md-3" v-if="isTeacherRole">
            <label for class="form--normal__title">Chức vụ</label>
          </div>
          <div class="col-md-9" v-if="isTeacherRole">
            <app-input v-model="work.duty" disabled />
          </div>

          <div class="col-md-3" v-if="isTeacherRole">
            <label for class="form--normal__title">Tổ chuyên môn</label>
          </div>
          <div class="col-md-9" v-if="isTeacherRole">
            <app-input v-model="work.profession" disabled />
          </div>

          <div class="col-md-3" v-if="isTeacherRole">
            <label for class="form--normal__title">Lớp chủ nhiệm</label>
          </div>
          <div class="col-md-9" v-if="isTeacherRole">
            <app-input v-model="work.homeroom_class" disabled />
          </div>

          <div class="col-md-3" v-if="isTeacherRole">
            <label for class="form--normal__title">Các lớp giảng dạy</label>
          </div>
          <div class="col-md-9" v-if="isTeacherRole">
            <app-input v-model="work.teaching_classes" disabled />
          </div>

          <div class="col-md-3" v-if="isStudentRole">
            <label for class="form--normal__title">Mã học sinh</label>
          </div>
          <div class="col-md-9" v-if="isStudentRole">
            <app-input v-model="work.code" disabled />
          </div>
          <div class="col-md-3" v-if="isStudentRole">
            <label for class="form--normal__title">Lớp</label>
          </div>
          <div class="col-md-9" v-if="isStudentRole">
            <app-input v-model="work.class" disabled />
          </div>
        </div>
      </div>
    </template>
  </sub-block-section>
</template>

<script>
import UploadAvatar from "~/components/page/account/Info/UploadAvatar";
import AccountStoryForm from "~/components/page/account/forms/AddAccountStory";

import IconPlus from "~/assets/svg/design-icons/plus.svg?inline";
import IconEdit from "~/assets/svg/v2-icons/border_color_24px.svg?inline";
import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline";

import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions, mapGetters } from "vuex";
import { get, map } from "lodash";
import { getDateBirthDay, getDateFormat } from "~/utils/moment";
export default {
  components: {
    UploadAvatar,
    IconPlus,
    IconEdit,
    IconTrashAlt,
    AccountStoryForm,
  },
  data() {
    return {
      name: "",
      phone: "",
      email: "",
      sex: "",
      birthday: "",
      story: null,
      editingStory: false,
      checkEdit: false,
      organization: {
        code: "",
        name: "",
        phone: "",
        email: "",
        address: "",
      },

      work: {
        class: "",
        code: "",
        profession: "",
        homeroom_class: "",
        teaching_classes: "",
        duty: "",
      },
    };
  },

  created() {
    this.name = get(this, "profileList.fullname", "");
    this.phone = get(this, "profileList.phone", "");
    this.email = get(this, "profileList.email", "");
    this.address = get(this, "profileList.address", "");
    this.sex = get(this, "profileList.sex", "")
      ? get(this, "profileList.sex", "") === "MALE"
        ? "Nam"
        : "Nữ"
      : "";
    this.birthday = getDateBirthDay(get(this, "profileList.birthday", ""));
    this.story = get(this, "profileList.intro", null);

    this.organization.code = get(this, "profileList.organization.code", "");
    this.organization.name = get(this, "profileList.organization.name", "");
    this.organization.phone = get(this, "profileList.organization.phone", "");
    this.organization.email = get(this, "profileList.organization.email", "");
    this.organization.address = get(
      this,
      "profileList.organization.address",
      ""
    );
    this.work.class = get(this, "profileList.work.classes", "");
    this.work.code = get(this, "profileList.code", "");
    this.work.profession = get(this, "profileList.work.profession", "");
    this.work.homeroom_class = get(this, "profileList.work.homeroom_class", "");
    const teachingClasses = get(this, "profileList.work.teaching_classes", "");
    this.work.teaching_classes = map(teachingClasses).join(", ");
    this.work.duty = get(this, "profileList.work.duty", "");
  },

  watch: {
    profileList: {
      handler: function () {
        this.story = get(this, "profileList.intro", null);
      },
    },
  },

  methods: {
    ...mapActions("account", [
      "accountPersonalEditAvatar",
      "accountPersonalList",
      "accountBiographyAdd",
    ]),
    addStory() {
      this.editingStory = true;
    },

    submitStory(_data) {
      const data = {
        biography: _data,
      };

      this.accountBiographyAdd(data).then((result) => {
        if (result.success) {
          this.editingStory = false;
          this.$store.dispatch(`account/${actionTypes.ACCOUNT_PROFILE.LIST}`);
        }
      });
    },

    editStory() {
      this.editingStory = true;
    },

    cancel() {
      this.editingStory = false;
    },

    handleDeleteStory() {
      const data = {
        biography: "",
      };
      this.accountBiographyAdd(data).then((result) => {
        if (result.success) {
          this.editingStory = false;
          this.$store.dispatch(`account/${actionTypes.ACCOUNT_PROFILE.LIST}`);
        }
      });
    },
  },

  computed: {
    ...mapState("account", ["personalList"]),
    ...mapState("account", ["profileList"]),
    ...mapGetters("auth", ["isTeacherRole", "isStudentRole"]),

    filterAvatarSrc() {
      return this.profileList && this.profileList.avatar
        ? this.profileList.avatar
        : "";
    },
  },
};
</script>

<style>
</style>