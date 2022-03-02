<template>
  <div class="social-search-side">
     <ul class="sss__content">
         <li :class="{ 'active': tab ==1 }" @click="expandMenu(1)">
             <n-link to>
                 <IconVerticalSplit24px class="mr-4"/>
                 Tất cả
             </n-link>
         </li>
         <li :class="{ 'active':tab ==2 }" @click="expandMenu(2)">
             <n-link to>
                 <IconEdit class="mr-4"/>
                 Bài viết
             </n-link>
         </li>
         <div class="d-flex flex-column pl-4" v-if="tab==2">
            <!-- <p class="mb-3 mt-4">Bài viết của</p>
            <app-radio  name="post">Mọi người</app-radio>
            <app-radio class="mb-2" name="post">Bạn</app-radio>
            <app-radio class="mb-2" name="post">Bạn bè của bạn</app-radio> -->

            <!-- <app-radio class="mb-2" name="post">Bất kỳ ai</app-radio>
            <app-radio class="mb-2" name="post">Nhóm và trang của bạn</app-radio> -->
            <!-- <p class="mb-3 mt-4">Loại bài viết</p>
            <app-radio class="mb-2" name="view">Tất cả bài viết</app-radio>
            <app-radio class="mb-2" name="view">Bài viết bạn đã xem</app-radio> -->
        </div>
         <li :class="{ 'active': tab ==3 }" @click="expandMenu(3)">
             <n-link to>
                 <IconSupervisorAccount24px class="mr-4"/>
                 Mọi người
             </n-link>
         </li>
         <li :class="{ 'active':tab ==4 }" @click="expandMenu(4)">
             <n-link to>
                 <IconImage24px class="mr-4"/>
                 Ảnh
             </n-link>
         </li>
         <li>
             <n-link to>
                 <IconVideocam24px class="mr-4"/>
                 Video
             </n-link>
         </li>
         <li>
             <n-link to>
                 <IconAccountGroup class="mr-4"/>
                Nhóm
             </n-link>
         </li>
          <li>
             <n-link to>
                 <IconLocationOn24px class="mr-4"/>
                Địa điểm
             </n-link>
         </li>
          <li>
             <n-link to>
                 <IconEventAvailable24px class="mr-4"/>
                Sự kiện
             </n-link>
         </li>
          <li>
             <n-link to>
                 <IconInsertLink24px class="mr-4"/>
                Liên kết
             </n-link>
         </li>
     </ul>
  </div>
</template>

<script>
import IconVerticalSplit24px from '~/assets/svg/v2-icons/vertical_split_24px.svg?inline';
import IconEdit from '~/assets/svg/icons/edit.svg?inline';
import IconSupervisorAccount24px from '~/assets/svg/v2-icons/supervisor_account_24px.svg?inline';
import IconImage24px from '~/assets/svg/v2-icons/image_24px.svg?inline';
import IconVideocam24px from '~/assets/svg/v2-icons/videocam_24px.svg?inline';
import IconAccountGroup from '~/assets/svg/icons/account-group.svg?inline';
import IconLocationOn24px from '~/assets/svg/v2-icons/location_on_24px.svg?inline';
import IconEventAvailable24px from '~/assets/svg/v2-icons/event_available_24px.svg?inline';
import IconInsertLink24px from '~/assets/svg/v2-icons/insert_link_24px.svg?inline';

export default {
    components:{
        IconVerticalSplit24px,
        IconEdit,
        IconSupervisorAccount24px,
        IconImage24px,
        IconVideocam24px,
        IconAccountGroup,
        IconLocationOn24px,
        IconEventAvailable24px,
        IconInsertLink24px
    },
    data(){
        return{
            tab: 1
        }
    },
    methods:{
        expandMenu(item) {
            this.tab = item;
        }
    }
}
</script>

<style lang="scss">
@import "~/assets/scss/components/social/_social-search-side.scss";
</style>