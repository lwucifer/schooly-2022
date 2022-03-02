<template>
  <div>
    <create-content-box
      :title="'Tạo phòng học online'"
    >
      <template v-slot:content>
        <section class="creation-form">
          <div class="group-form row">
            <div
              class="creation-form__item col-md-3"
            >
              <label
                for=""
                class="creation-form__item__label"
              >
                Trình độ
              </label>
              <app-vue-select
                class="app-vue-select creation-form__item__selection"
                v-model="info.level"
                :options="levels"
                label="text"
                placeholder="Chọn lớp"
                searchable
                clearable
              >
              </app-vue-select>
            </div>

            <div class="creation-form__item col-md-3">
              <label
                for=""
                class="creation-form__item__label"
              >
                Môn học
              </label>
              <app-vue-select
                class="app-vue-select creation-form__item__selection"
                v-model="info.subject"
                :options="subjects"
                label="text"
                placeholder="Chọn môn học"
                searchable
                clearable
              >
              </app-vue-select>
            </div>

            <div class="creation-form__item col-md-3">
              <label
                for=""
                class="creation-form__item__label"
              >
                Thuộc khóa học
              </label>
              <app-vue-select
                class="app-vue-select creation-form__item__selection"
                v-model="info.course"
                :options="courses"
                label="text"
                placeholder="Chọn khóa học"
                searchable
                clearable
              >
              </app-vue-select>
            </div>
          </div>

          <div class="form-block">
            <div class="creation-form__item">
              <app-input
                labelBold
                :label="'Tên phòng học'"
                :sub-label="'(Tối đa 60 ký tự)'"
              >
              </app-input>
            </div>
          </div>

          <div class="form-block">
            <div class="creation-form__item">
              <label
                for=""
                class="creation-form__item__label"
              >
                Mô tả tổng quát
              </label>
              <div>
                <app-editor id="description"/>
              </div>
            </div>
          </div>

          <div class="form-block">
            <div class="creation-form__item">
              <label
                for=""
                class="creation-form__item__label"
              >
                Mức độ công khai
              </label>
              <app-vue-select
                class="app-vue-select creation-form__item__selection"
                v-model="info.visibility"
                :options="visibilities"
                label="text"
                placeholder="Chọn mức độ công khai"
                searchable
                clearable
                style="max-width: 21rem;"
              >
              </app-vue-select>
            </div>
          </div>

          <div class="form-block">
            <div class="creation-form__item">
              <label
                for=""
                class="creation-form__item__label"
              >
                Cho phép bình luận tại phòng học
              </label>
              <div>
                <app-radio name="comment" value="0" class="mr-6" checked>Có</app-radio>
                <app-radio name="comment" value="1" checked>Không</app-radio>
              </div>
            </div>
          </div>

          <div class="form-block">
            <div class="creation-form__item">
              <label
                for=""
                class="creation-form__item__label"
              >
                Thời gian học
              </label>
              <div class="row">
                <div class="col-md-3">
                  <app-date-picker
                    v-model="info.date"
                    square
                    size="sm"
                    placeholder="DD/MM/YYYY"
                  >
                    <template v-slot:icon-calendar>
                      <IconCalendar/>
                    </template>
                  </app-date-picker>
                </div>
                <div class="col-md-3">
                  <app-date-picker
                    label="Từ"
                    v-model="info.from"
                    square
                    size="sm"
                    type="time"
                    value-format="h:mm A"
                    placeholder="HH:MM A"
                  >
                    <template v-slot:icon-calendar>
                      <IconCalendar/>
                    </template>
                  </app-date-picker>
                </div>
                <div class="col-md-4">
                  <app-date-picker
                    label="Đến"
                    v-model="info.to"
                    square
                    size="sm"
                    type="time"
                    value-format="h:mm A"
                    placeholder="HH:MM A"
                  >
                    <template v-slot:icon-calendar>
                      <IconCalendar/>
                    </template>
                  </app-date-picker>
                </div>
              </div>
            </div>
          </div>

          <div class="form-block">
            <div class="creation-form__item mb-0">
              <label
                for=""
                class="creation-form__item__label"
              >
                Số học sinh tham gia tối đa
              </label>
              <div class="row">
                <div class="col-md-3">
                  <app-input
                    labelBold
                    placeholder="Số học sinh"
                    class="mb-0"
                  >
                  </app-input>
                </div>
              </div>
            </div>
          </div>

        </section>
      </template>
    </create-content-box>
  </div>
</template>

<script>
  // import {Editor, EditorContent} from "tiptap"
  // import {Placeholder} from "tiptap-extensions"

  import CreateContentBox from "~/components/page/classroom/create/CreateContentBox"
  import IconCalendar from "~/assets/svg/icons/calendar2.svg?inline"

  export default {
    name: "CreateClassroom",
    components: {
      CreateContentBox,
      IconCalendar,
      // EditorContent
    },
    data() {
      return {
        // description: null,
        levels: [
          {
            value: 1,
            text: "Lớp 10"
          },
          {
            value: 2,
            text: "Lớp 11"
          },
        ],
        subjects: [
          {
            value: 1,
            text: "Toán"
          },
          {
            value: 2,
            text: "Lý"
          },
        ],
        courses: [
          {
            value: 1,
            text: "Khóa học 1"
          },
          {
            value: 2,
            text: "Khóa học 2"
          },
        ],
        visibilities: [
          {
            value: 1,
            text: "Mức độ 1"
          },
          {
            value: 2,
            text: "Mức độ 2"
          },
        ],
        info: {}
      }
    },
    mounted() {
      // this.description = new Editor({
      //   extensions: [
      //     new Placeholder({
      //       showOnlyCurrent: false,
      //       emptyNodeText: "Mô tả"
      //     })
      //   ]
      // });
    }
  }
</script>

<style lang="scss" scoped>
  @import "~/assets/scss/components/classroom/create/_create-classroom.scss";
</style>