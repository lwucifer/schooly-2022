<template>
  <div>
    <div class="page-social__aside-tabs">
      <a href :class="{ active: coursesTab === 0 }" @click.prevent="coursesTab = 0">Miễn phí</a>
      <a href :class="{ active: coursesTab === 1 }" @click.prevent="coursesTab = 1">Trả phí</a>
    </div>

    <div class="time-aside-tabs-content">
      <div class="page-social__aside-tab-pane">
        <app-content-box
          v-for="item in courses || []"
          :key="item.elearning_id"
          class="mb-4"
          size="sm"
          :image="get(item, 'avatar.low', null)"
        >
          <n-link slot="image" :to="`/elearning/${item.elearning_id}`">
            <img :src="item.image" :alt="item.name" />
          </n-link>

          <n-link slot="title" :to="`/elearning/${item.elearning_id}`">{{ item.name }}</n-link>
        </app-content-box>
      </div>

      <div class="text-center mt-4">
        <n-link class="text-decoration-none" to="/elearning">Xem thêm</n-link>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from "lodash";
import { BASE as ACTION_BASE } from "~/utils/action-types";
import SearchService from "~/services/elearning/public/Search";

export default {
  data() {
    return {
      coursesTab: 0,
      courses: [],
    };
  },

  async fetch() {
    try {
      const getCourses =
        this.coursesTab === 0
          ? await this.getFreeCourse()
          : await this.getPrivateCourse();
      
      if (getCourses.success) {
        this.courses = getCourses.data.content;
      } else {
        throw new Error("Error");
      }

    } catch (error) {
      throw new Error(error.message);
    }
  },
  
  fetchOnServer: false,

  watch: {
    coursesTab(newValue) {
      this.$fetch();
    }
  },

  methods: {
    get,

    async getFreeCourse() {
      return await new SearchService(this.$axios)[ACTION_BASE.ADD]({
        free: true,
        limit: 5,
      });
    },

    async getPrivateCourse() {
      return await new SearchService(this.$axios)[ACTION_BASE.ADD]({
        free: false,
        limit: 5,
      });
    },
  },
};
</script>
