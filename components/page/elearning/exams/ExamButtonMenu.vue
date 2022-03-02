<template>
    <v-popover
            popover-inner-class="popover-inner"
            placement="bottom-end"
          >
            <button class="d-flex align-items-center justify-content-center">
              <IconSettings24px :height="15" :width="15" />
              <IconArrowDropDown24px />
            </button>
            <template slot="popover">
              <div class="ebm__content">
                <div v-if="tab == 'APPROVED'">
                  <ul>
                    <li @click="$emit('manageSemester')">
                      <a class="d-flex align-items-center">
                        <IconPlaylistPlay24px
                          class="mr-3 icon-playist"
                          :height="20"
                          :width="20"
                        />
                        Quản lí kỳ thi
                      </a>
                    </li>
                    <li @click="$emit('editSemester')">
                      <a class="d-flex align-items-center">
                        <IconCreate24px
                          class="mr-3 fill-info"
                          :height="20"
                          :width="20"
                        />
                        Chỉnh sửa
                      </a>
                    </li>
                    <li @click="$emit('changeEnable')" v-if="enable">
                      <a  class="d-flex align-items-center">
                        <IconPauseCircleOutline24px
                          class="mr-3 fill-pink-2"
                          :height="20"
                          :width="20"
                        />
                        Dừng kỳ thi
                      </a>
                    </li>
                    <li @click="$emit('changeEnable')" v-else>
                      <a class="d-flex align-items-center">
                        <IconLoop24px
                          class="mr-3 fill-primary"
                          :height="20"
                          :width="20"
                        />
                        Khôi phục
                      </a>
                    </li>
                  </ul>
                </div>
                <div v-else-if="tab == 'DOING'">
                  <ul>
                    <li @click="$emit('editSemester')">
                      <a class="d-flex align-items-center">
                        <IconCreate24px
                          class="mr-3 fill-info"
                          :height="20"
                          :width="20"
                        />
                        Chỉnh sửa
                      </a>
                    </li>
                    <li @click="$emit('deleteSemester')">
                      <a class="d-flex align-items-center">
                        <IconDelete24px
                          class="mr-3 fill-secondary"
                          :height="20"
                          :width="20"
                        />
                        Xóa
                      </a>
                    </li>
                  </ul>
                </div>
                <div v-else-if="tab == 'PENDING'">
                  <ul>
                    <li @click="$emit('editSemester')">
                      <a class="d-flex align-items-center">
                        <IconCreate24px
                          class="mr-3 fill-info"
                          :height="20"
                          :width="20"
                        />
                        Chỉnh sửa
                      </a>
                    </li>
                    <li @click="$emit('deleteSemester')">
                      <a class="d-flex align-items-center">
                        <IconDelete24px
                          class="mr-3 fill-secondary"
                          :height="20"
                          :width="20"
                        />
                        Xóa
                      </a>
                    </li>
                  </ul>
                </div>
                <div v-else-if="tab == 'WAITING_FOR_APPROVE'">
                  <ul>
                    <li>
                      <a href="" class="d-flex align-items-center">
                        <IconCreate24px
                          class="mr-3 fill-info"
                          :height="20"
                          :width="20"
                        />
                        Chỉnh sửa
                      </a>
                    </li>
                    <li @click="$emit('deleteSemester')">
                      <a class="d-flex align-items-center">
                        <IconDelete24px
                          class="mr-3 fill-secondary"
                          :height="20"
                          :width="20"
                        />
                        Xóa
                      </a>
                    </li>
                  </ul>
                </div>
                <div v-else-if="tab == 'DENIED'">
                  <ul>
                    <li @click="$emit('showReason')">
                      <a class="d-flex align-items-center">
                        <IconRemoveRedEye24px
                          class="mr-3 fill-primary"
                          :height="20"
                          :width="20"
                        />
                        Xem lí do bị từ chối
                      </a>
                    </li>
                    <li @click="$emit('editSemester')">
                      <a class="d-flex align-items-center">
                        <IconCreate24px
                          class="mr-3 fill-info"
                          :height="20"
                          :width="20"
                        />
                        Chỉnh sửa
                      </a>
                    </li>
                    <li @click="$emit('deleteSemester')">
                      <a class="d-flex align-items-center">
                        <IconDelete24px
                          class="mr-3 fill-pink-2"
                          :height="20"
                          :width="20"
                        />
                        Xóa
                      </a>
                    </li>
                  </ul>
                </div>
                <div v-else-if="tab == 'ENDED'">
                  <ul>
                    <li  @click="$emit('manageSemester')">
                      <a  class="d-flex align-items-center">
                        <IconMenu24px
                          class="mr-3 icon-manager-exam"
                          :height="20"
                          :width="20"
                        />
                        Quản lí đề thi
                      </a>
                    </li>
                    <li>
                      <a href="" class="d-flex align-items-center">
                        <IconSupervisedUserCircle24px
                          class="mr-3 icon-manager-student"
                          :height="20"
                          :width="20"
                        />
                        Quản lí thí sinh
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </template>
          </v-popover>
</template>

<script>
import IconSettings24px from "~/assets/svg/v2-icons/settings_24px.svg?inline";
import IconArrowDropDown24px from "~/assets/svg/v2-icons/arrow_drop_down_24px.svg?inline";
import IconPauseCircleOutline24px from "~/assets/svg/v2-icons/pause_circle_outline_24px.svg?inline";
import IconCreate24px from "~/assets/svg/v2-icons/create_24px.svg?inline";
import IconPlaylistPlay24px from "~/assets/svg/v2-icons/playlist_play_24px.svg?inline";
import IconEllipse2 from "~/assets/svg/icons/ellipse2.svg?inline";
import IconDelete24px from "~/assets/svg/v2-icons/delete_24px.svg?inline";
import IconRemoveRedEye24px from "~/assets/svg/v2-icons/remove_red_eye_24px.svg?inline";
import IconMenu24px from "~/assets/svg/v2-icons/menu_24px.svg?inline";
import IconSupervisedUserCircle24px from "~/assets/svg/v2-icons/supervised_user_circle_24px.svg?inline";
import IconLoop24px from '~/assets/svg/v2-icons/loop_24px.svg?inline';
export default {
    components:{
        IconSettings24px,
        IconArrowDropDown24px,
        IconPauseCircleOutline24px,
        IconCreate24px,
        IconPlaylistPlay24px,
        IconEllipse2,
        IconDelete24px,
        IconRemoveRedEye24px,
        IconMenu24px,
        IconSupervisedUserCircle24px,
        IconLoop24px
    },
    props:{
        tab:{
            type:String,
            default:"APPROVED"
        },
        enable:{
          type: Boolean,
          default: true
        }
    }
};
</script>

<style lang="scss">
.ebm__content{
  ul{
    li{
      list-style: none;
      padding: 0.5rem;
      min-width: 13.2rem;
      a{
        color:#656565;
      }
    }
  }
}
</style>