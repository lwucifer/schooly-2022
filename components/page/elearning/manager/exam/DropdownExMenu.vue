<template>
  <div>
    <v-popover
      offset="10"
      placement="bottom-end"
      popover-class
      popoverBaseClass="dropdown-setting-menu dropdown-setting-menu--no-arrow"
      popover-inner-class="p-0 bg-white dropdown-frame-border"
    >
      <div class="d-flex align-items-center dropdown-frame-border-title">
        <IconSetting class="dropdown-frame-menu--stroke-icon" />
        <IconArrow class="ml-2 dropdown-frame-menu--fill-icon" />
      </div>

      <template slot="popover">
        <ul class="dropdown-menu-content">
          <li @click="$emit('publish')" v-if="item && item.status == 'COMPLETED'">
            <IconPublish class="fill-primary" />
            <span class="nowrap">Xuất bản</span>
          </li>
          <li @click="$emit('participants')" v-if="item && item.status != 'PENDING'">
            <IconUserUser class="fill-primary" />
            <span class="nowrap">Học sinh làm bài</span>
          </li>
          <li @click="$emit('edit')" v-if="item && item.status != 'PUBLISHED'">
            <IconEdit />
            <span class="nowrap">Sửa bài tập</span>
          </li>
          <li @click="$emit('delete')" v-if="item && item.status != 'PUBLISHED'">
            <IconTrashAlt class="icon-red" />
            <span class="nowrap">Xóa</span>
          </li>
        </ul>
      </template>
    </v-popover>
  </div>
</template>

<script>
import IconSetting from "~/assets/svg/v2-icons/settings.svg?inline";
import IconArrow from "~/assets/svg/v2-icons/arrow_bottom.svg?inline";
import IconEdit from "~/assets/svg/v2-icons/create3_24px.svg?inline";
import IconPublish from "~/assets/svg/v2-icons/publish_24px.svg?inline";
import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline";
import IconUserUser from '~/assets/svg/icons/user-user.svg?inline';

export default {
  components: {
    IconSetting,
    IconArrow,
    IconEdit,
    IconTrashAlt,
    IconUserUser,
    IconPublish
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
    };
  },
  methods: {
    
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/create/_setting-menu.scss";
</style>