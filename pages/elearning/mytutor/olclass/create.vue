<template>
  <div class="container mytutor-olclass">
    <breadcrumb />
    <div class="row">
      <div class="col-md-3">
        <MenuSideMyTutor :active="1" />
      </div>

      <div class="col-md-9">
        <sub-block-section hasIcon title="Tạo lớp học online">
          <template v-slot:content>
            <div class="mb-5">
              <h2 class="form-title heading-5 mb-3">
                Tên lớp học online
                <span class="text-base font-weight-normal">(Tối đa 60 ký tự)</span>
              </h2>
              <app-input
                :placeholder="`Nhập tiêu đề của lớp học online`"
                :counter="60"
                class="mb-2"
              />
              <app-error :error="get(error, 'name', '')"></app-error>
            </div>

            <div class="mb-5">
              <h2 class="form-title heading-5 mb-3">Mô tả</h2>
              <app-editor class="bg-input-gray mb-3" :sticky-offset="`{ top: 70, bottom: 0 }`" />
              <app-error :error="get(error, 'description', '')"></app-error>
            </div>

            <div class="d-flex flex-wrap">
              <div class="mb-5 mr-6">
                <h2 class="form-title heading-5 mb-3">Chọn khối</h2>
                <app-vue-select placeholder="Khối" has-border style="min-width: 10.1rem" />
                <app-error :error="get(error, 'group', '')"></app-error>
              </div>

              <div class="mb-5 mr-6">
                <h2 class="form-title heading-5 mb-3">Chọn môn học</h2>
                <app-vue-select placeholder="Môn học" has-border style="min-width: 10.1rem" />
                <app-error :error="get(error, 'subject', '')"></app-error>
              </div>

              <div class="mb-5 mr-6">
                <h2 class="form-title heading-5 mb-3">Học phí (đ)</h2>
                <div class="d-flex align-items-center">
                  <app-vue-select placeholder="Môn học" has-border style="min-width: 10.1rem" />
                  <span class="text-gray-3 ml-3">/buổi</span>
                </div>
                <app-error :error="get(error, 'price', '')"></app-error>
              </div>
            </div>

            <div class="d-flex flex-wrap">
              <div class="mb-5 mr-6">
                <h2 class="form-title heading-5 mb-3">Hình thức</h2>
                <app-radio
                  class="mr-6"
                  name="private"
                  value="PUBLIC"
                  v-model="radioPrivate"
                >Công khai</app-radio>
                <app-radio
                  class="mr-6"
                  name="private"
                  value="PRIVATE"
                  v-model="radioPrivate"
                >Riêng tư</app-radio>
                <app-error :error="get(error, 'private', '')"></app-error>
              </div>

              <div class="mb-5 mr-6">
                <h2 class="form-title heading-5 mb-3">Thuộc lớp/nhóm học tập</h2>
                <app-vue-select
                  placeholder="Chọn lớp hoặc nhóm học tập"
                  has-border
                  style="min-width: 23.5rem"
                />
                <app-error :error="get(error, 'owner', '')"></app-error>
              </div>
            </div>

            <div class="text-right mb-5">
              <app-button>
                <IconDownloadDone class="icon fill-opacity-1 body-1 mr-2" />Tạo lớp học
              </app-button>
              <app-button>
                <IconSync class="icon fill-opacity-1 body-1 mr-2" />Cập nhật
              </app-button>
            </div>

            <app-divider class="mb-4" color="disabled" />

            <h2 class="form-title heading-5">
              Lịch học
              <span class="text-base font-weight-normal">(Việc tạo lịch học là bắt buộc)</span>
            </h2>
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
            <button class="btn-add" @click="modalAdd = true">
              <IconAdd class="icon fill-opacity-1 mr-2" />Thêm lịch
            </button>
          </template>
        </sub-block-section>
      </div>
    </div>

    <app-modal v-model="modalAdd" title="Thêm lịch" :footer="false" :width="828" @close="modalAdd = false">
      <FormAddSchedule slot="content" />
    </app-modal>
  </div>
</template>

<script>
import { get } from "lodash";
import { initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common";
import MenuSideMyTutor from "~/components/page/elearning/mytutor/MenuSideMyTutor";
import FormAddSchedule from "~/components/page/elearning/mytutor/olclass/create/FormAddSchedule";
import IconDownloadDone from "~/assets/svg/v2-icons/download_done_24px.svg?inline";
import IconSync from "~/assets/svg/v2-icons/sync_24px.svg?inline";
import IconBorderColor from "~/assets/svg/v2-icons/border_color_24px.svg?inline";
import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline";
import IconAdd from "~/assets/svg/v2-icons/add_24px.svg?inline";

export default {
  components: {
    MenuSideMyTutor,
    FormAddSchedule,
    IconDownloadDone,
    IconSync,
    IconBorderColor,
    IconTrashAlt,
    IconAdd,
  },

  data() {
    return {
      error: {},
      radioPrivate: "PUBLIC",
      modalAdd: false,
    };
  },

  mounted() {
    const breadcrumb = [
      {
        title: "E-learning",
        to: "/elearning",
      },
      {
        title: "Quản lý lớp học online",
        to: "/elearning/mytutor",
      },
      {
        title: "Tạo lớp học online",
        to: "/elearning/mytutor/olclass/create",
      },
    ];
    initBreadcrumb(this, breadcrumb);
    initPageTitle(
      this,
      createPageTitle("Tạo lớp học online - Quản lý lớp học online")
    );
  },

  methods: {
    get,
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/manager/_elearning-manager.scss";
@import "~/assets/scss/pages/elearning/mytutor/olclass/_create.scss";
</style>
