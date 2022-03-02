<template>
  <div class="school-course-item">
    <div class="school-course-item__image">
      <img :src="get(cource, 'avatar.medium', '')" alt />
      <div
        class="status-online"
        v-if="
          get(cource, 'onlineStatus', '') && get(cource, 'online', '') === 1
        "
      >
        {{ get(cource, "onlineStatus", "") }}
      </div>
      <div class="online" v-if="get(cource, 'online', '')">Trực tiếp</div>
      <div class="video" v-if="get(cource, 'video', '')">
        <IconVideo3 />
      </div>
    </div>
    <div class="bottom">
      <n-link class="title" v-if="get(cource, 'name', '')" to>{{
        get(cource, "name", "")
      }}</n-link>

      <div class="school-course-item_teacher">
        <div>
          <app-avatar :src="get(cource, 'teacher_avatar', '')" :size="20" />
          <span>
            <n-link class="name" :to="`/public/profile/teacher?user_id=${get(teacher, 'id', '')}`" target="_blank">
              {{ get(cource, "teacher_name", "") }}
            </n-link>
          </span>
        </div>
        <div>
          <div class="stars">
            <app-stars :stars="Math.floor(get(cource, 'rate', 0))" />
          </div>
          <span class="text-right">
            <strong>{{ get(cource, "rate", 0) }}</strong>
            ({{ get(cource, "original_price", 0) }})
          </span>
        </div>
        <div class="price-wrapper">
          <span v-if="get(cource, 'price', 0) > 0" class="price">
            {{ get(cource, "price", 0) | numeralFormat("0,0") }}đ
          </span>
          <span v-else class="price price--free">
            Miễn phí
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { assignIn } from "lodash";
import IconChevronLeft from "~/assets/svg/icons/chevron-left.svg?inline";
import IconChevronRight from "~/assets/svg/icons/chevron-right.svg?inline";
import IconBooks from "~/assets/svg/icons/books.svg?inline";
import IconNote from "~/assets/svg/icons/note.svg?inline";
import IconVideo3 from "~/assets/svg/icons/video3.svg?inline";
import { get } from "lodash";

export default {
  components: {
    IconChevronLeft,
    IconChevronRight,
    IconBooks,
    IconNote,
    IconVideo3,
  },

  props: {
    cource: {
      type: Object,
      required: true,
      default: () => {},
    },
  },

  methods: {
    get,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/school/_school-course-item.scss";
</style>
