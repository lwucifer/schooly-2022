<template>
  <!-- <sub-block-section
    v-sticky
    sticky-offset="{ top: 88 }"
    :sticy-z-index="9"
    title="Quản lý E-learning"
    :content-cls="{ 'py-3': true, 'px-0': true}"
  >
    <template v-slot:content>
      <div class="manager-side">
        <n-link
          class="link-gray item"
          :to="'/elearning/manager/'"
          :class="active == 1 ? 'active' : ''"
        >
          <IconDashboard width="20" height="20" />Tổng quan
        </n-link>
        <n-link
          class="link-gray item"
          :to="'/elearning/manager/courses/'"
          :class="active == 2 ? 'active' : ''"
        >
          <IconBooks width="20" height="20" />Bài giảng và khóa học
        </n-link>
        <n-link
          class="link-gray item"
          :to="'/elearning/manager/exams'"
          :class="active == 3 ? 'active' : ''"
        >
          <IconLibraryBooks width="20" height="20" />Bài tập và bài kiểm tra
        </n-link>
        <n-link
          class="link-gray item"
          :to="'/elearning/manager/warehouses'"
          :class="active == 4 ? 'active' : ''"
        >
          <IconVideoLibrary />Kho học liệu
        </n-link>
        <n-link
          class="link-gray item"
          :to="'/elearning/manager/online-class'"
          :class="active == 5 ? 'active' : ''"
        >
          <IconLaptop />Phòng học online
        </n-link>
        <n-link
          class="link-gray item"
          :to="'/elearning/manager/interacts'"
          :class="active == 6 ? 'active' : ''"
        >
          <IconUserCircle />Tương tác với học sinh
        </n-link>
        <n-link
          class="link-gray item"
          :to="'/elearning/manager/rates'"
          :class="active == 8 ? 'active' : ''"
        >
          <IconStar />Đánh giá và bình luận
        </n-link>
      </div>
    </template>
  </sub-block-section>-->
  <div>
    <ElearningManagerClassSide />
    <sub-block-section
      v-sticky
      sticky-offset="{ top: 88 }"
      :sticy-z-index="9"
      title="Quản lý E-learning"
      :content-cls="{ 'py-0': true, 'px-0': true}"
      class="manager-side-menu"
    >
      <template v-slot:content>
        <ul class="manager-side">
          <li :class="{ 'manager-side-item--active': expanding.includes(1) }">
            <n-link :to="'/elearning/manager/'" :class="{ active: active == 1 }">
              <IconDashboard width="20" height="20" />Tổng quan
            </n-link>
          </li>
          <li
            :class="{ 'manager-side-item--active': expanding.includes(2) }"
            @click="expandMenu(2)"
          >
            <n-link to>
              <IconBooks class="mns__pre-icon" width="20" height="20" />Quản lý E-Learning
              <IconExpandMore class="mns__suf-icon" />
            </n-link>
            <ul class="manager-side-sub">
              <li>
                <n-link :class="{ active: active == 2 }" to="/elearning/manager/courses">
                  <IconArrowRight />Bài giảng, khoá học
                </n-link>
              </li>
              <!-- <li>
              <n-link :class="{ active: active == 3 }" to="/elearning/manager/online-class"><IconArrowRight />Phòng học online</n-link>
            </li>
            <li>
              <n-link :class="{ active: active == 4 }" to="/elearning/manager/exams"><IconArrowRight />Bài tập, kiểm tra</n-link>
              </li>-->
              <li>
                <n-link :class="{ active: active == 5 }" to="/elearning/manager/warehouses">
                  <IconArrowRight />Kho học liệu
                </n-link>
              </li>
              <li>
                <n-link :class="{ active: active == 6 }" to="/elearning/manager/interacts">
                  <IconArrowRight />Tương tác
                </n-link>
              </li>
              <li>
                <n-link :class="{ active: active == 7 }" to="/elearning/manager/rates">
                  <IconArrowRight />Đánh giá, bình luận
                </n-link>
              </li>
            </ul>
          </li>
          <li :class="{ 'manager-side-item--active': expanding.includes(3) }">
            <n-link :to="'/elearning/manager/online-class'" :class="{ active: active == 3 }">
              <IconLaptopMac24px width="20" height="20" />Phòng học online
            </n-link>
          </li>
          <li :class="{ 'manager-side-item--active': expanding.includes(4) }">
            <n-link :to="'/elearning/manager/exams'" :class="{ active: active == 4 }">
              <IconFileCopy24px width="20" height="20" />Bài tập, bài kiểm tra
            </n-link>
          </li>
          <li :class="{ 'manager-side-item--active': expanding.includes(5) }">
            <n-link :to="'/elearning/manager/documents'" :class="{ active: active == 5 }">
              <IconCreateNewFolder24px width="20" height="20" />Tài liệu học tập
            </n-link>
          </li>
          <li
            :class=" { 'manager-side-item--active': expanding.includes(3) }"
            @click="expandMenu(3)"
          >
            <n-link to>
              <IconLibraryBooks class="mns__pre-icon" width="20" height="20" />Quản lý kỳ thi
              <IconExpandMore class="mns__suf-icon" />
            </n-link>
            <ul class="manager-side-sub">
              <li>
                <n-link :class="{ active: active == 8 }" to="/elearning/manager/semester">
                  <IconArrowRight />Kỳ thi
                </n-link>
              </li>
              <li>
                <n-link :class="{ active: active == 9 }" to="/elearning/manager">
                  <IconArrowRight />Tương tác
                </n-link>
              </li>
              <li>
                <n-link :class="{ active: active == 10 }" to="/elearning/manager">
                  <IconArrowRight />Đánh giá, bình luận
                </n-link>
              </li>
            </ul>
          </li>
          <li
            :class=" { 'manager-side-item--active': expanding.includes(4) }"
            @click="expandMenu(4)"
          >
            <n-link to>
              <IconUserCircle class="mns__pre-icon" width="20" height="20" />Quản lý học sinh
              <IconExpandMore class="mns__suf-icon" />
            </n-link>
            <ul class="manager-side-sub">
              <li>
                <n-link :class="{ active: active == 11 }" to="/elearning/students">
                  <IconArrowRight />Danh sách học sinh
                </n-link>
              </li>
              <li>
                <n-link :class="{ active: active == 12 }" to="/elearning/study-group">
                  <IconArrowRight />Nhóm học tập
                </n-link>
              </li>
            </ul>
          </li>
          <li
            :class=" { 'manager-side-item--active': expanding.includes(5) }"
            @click="expandMenu(5)"
          >
            <a>
              <IconHelpOutline24px class="mns__pre-icon" width="20" height="20" />Câu hỏi và đề thi
              <IconExpandMore class="mns__suf-icon" />
            </a>
            <ul class="manager-side-sub">
              <li>
                <n-link :class="{ active: active == 13 }" to="/elearning/manager/bank/questions">
                  <IconArrowRight />Ngân hàng câu hỏi
                </n-link>
              </li>
              <li>
                <n-link :class="{ active: active == 14 }" to="/elearning/manager/bank/exams">
                  <IconArrowRight />Ngân hàng đề thi
                </n-link>
              </li>
            </ul>
          </li>
          <li :class="{ 'manager-side-item--active': expanding.includes(15) }">
            <n-link :to="'/elearning/manager/schedule'" :class="{ active: active == 15 }">
              <IconInsertInvitation24px width="20" height="20" />Lịch giảng dạy
            </n-link>
          </li>
        </ul>
        <slot name="calendar"></slot>
      </template>
    </sub-block-section>
  </div>
</template>

<script>
import IconFolderCheck from "~/assets/svg/design-icons/folder-check.svg?inline";
import IconCalendar from "~/assets/svg/icons/calendar.svg?inline";
import IconDashboard from "~/assets/svg/v2-icons/dashboard_24px.svg?inline";
import IconDollarO from "~/assets/svg/icons/dollar-o.svg?inline";
import IconBooks from "~/assets/svg/v2-icons/collections_bookmark_24px.svg?inline";
import IconLibraryBooks from "~/assets/svg/v2-icons/library_books_24px.svg?inline";
import IconVideoLibrary from "~/assets/svg/v2-icons/video_library_24px.svg?inline";
import IconLaptop from "~/assets/svg/v2-icons/laptop_chromebook_24px.svg?inline";
import IconUserCircle from "~/assets/svg/v2-icons/supervised_user_circle_24px.svg?inline";
import IconBook from "~/assets/svg/icons/book.svg?inline";
import IconChatUser from "~/assets/svg/icons/chat-user.svg?inline";
import IconStar from "~/assets/svg/v2-icons/star_24px.svg?inline";
import IconArrowRight from "~/assets/svg/v2-icons/arrow_right_24px.svg?inline";
import IconExpandMore from "~/assets/svg/v2-icons/expand_more_24px.svg?inline";
import IconHelpOutline24px from "~/assets/svg/v2-icons/help_outline_24px.svg?inline";
import ElearningManagerClassSide from "~/components/page/elearning/manager/ElearningManagerClassSide";
import IconLaptopMac24px from "~/assets/svg/v2-icons/laptop_mac_24px.svg?inline";
import IconFileCopy24px from "~/assets/svg/v2-icons/file_copy_24px.svg?inline";
import IconCreateNewFolder24px from "~/assets/svg/v2-icons/create_new_folder_24px.svg?inline";
import IconInsertInvitation24px from "~/assets/svg/v2-icons/insert_invitation_24px.svg?inline";
export default {
  name: "E-learning",

  components: {
    IconFolderCheck,
    IconCalendar,
    IconDashboard,
    IconDollarO,
    IconBooks,
    IconBook,
    IconLibraryBooks,
    IconVideoLibrary,
    IconLaptop,
    IconChatUser,
    IconUserCircle,
    IconStar,
    IconArrowRight,
    IconExpandMore,
    IconHelpOutline24px,
    ElearningManagerClassSide,
    IconLaptopMac24px,
    IconFileCopy24px,
    IconCreateNewFolder24px,
    IconInsertInvitation24px,
  },

  data() {
    return {
      expanding: [],
    };
  },
  props: {
    active: {
      type: [String, Number],
    },
    group: {
      type: [String, Number],
    },
  },
  computed: {
    currentItem: function () {
      return this.action;
    },
  },
  methods: {
    expandMenu(item) {
      if (this.expanding.includes(item)) {
        let index = this.expanding.indexOf(item);
        this.expanding.splice(index, 1);
      } else {
        this.expanding.push(item);
      }
    },
    initExpanded() {
      this.expanding.push(this.group);
    },
  },
  created() {
    this.initExpanded();
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/manager/_manager-side.scss";
</style>