<template>
  <div class="manager-side--creation">
    <div class="manager-side--creation__checklist">
      <div
        class="link-gray item"
        :class="active == 'general' ? 'active' : ''"
        @click="selectMenu({name: 'general'})"
      >
        <app-checkbox
          :checked="active == 'general'"
        >
          Thông tin chung
        </app-checkbox>
      </div>

      <div
        class="link-gray item"
        :class="active == 'content' ? 'active' : ''"
        @click="selectMenu({name: 'content'})"
      >
        <app-checkbox
          :checked="active == 'content'"
        >
          Nội dung học tập
        </app-checkbox>
      </div>

      <div
        class="link-gray item"
        :class="active == 'setting' ? 'active' : ''"
        @click="selectMenu({name: 'setting'})"
      >
        <app-checkbox
          :checked="active == 'setting'"
        >
          Cài đặt
        </app-checkbox>
      </div>

      <div
        class="link-gray item"
        :class="active == 'classroom' ? 'active' : ''"
        @click="selectMenu({name: 'classroom'})"
      >
        <app-checkbox
          :checked="active == 'classroom'"
        >
          Tạo phòng học online
        </app-checkbox>
      </div>

      <div
        class="link-gray item"
        :class="active == 'exercise' ? 'active' : ''"
        @click="selectMenu({name: 'exercise'})"
      >
        <app-checkbox
          :checked="active == 'exercise'"
        >
          Bài tập
          <span class="cca-sub-text text-sub">(Tùy chọn)</span>
        </app-checkbox>
      </div>

      <div
        class="link-gray item"
        :class="active == 'exam' ? 'active' : ''"
        @click="selectMenu({name: 'exam'})"
      >
        <app-checkbox
          :checked="active == 'exam'"
        >
          Bài kiểm tra
          <span class="cca-sub-text text-sub"> (Tùy chọn)</span>
        </app-checkbox>
      </div>
    </div>

    <div class="manager-side--creation__action mt-3">
      <app-button
        square
        full-width
        normal
        size="md"
      >
        Gửi lên
      </app-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CreateSide",

    components: {},

    props: {
      active: {
        type: String,
        default: 'classroom',
        validator: value => ['classroom', 'exercise', 'exam', 'setting', 'general', 'content'].includes(value)
      }
    },
    methods: {
      selectMenu({ name }) {
        this.$emit('selectMenu', name)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~/assets/scss/components/classroom/create/_create-aside.scss";
</style>