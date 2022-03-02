 <template>
   <div class="department-side">
       <div>
           <div class="editavatar__Department">
               <app-avatar :src="client.avatar" :size="125" class="change-avatar"/>
               <app-upload class="btn-camera">
                   <IconCamera/>
               </app-upload>
           </div>
           <p class="department__name">{{client.name}}</p>
           <div class="department-side-link">
               <n-link class="link-gray" to :class="active == 1 ? 'active' : ''">
                    <IconUser3 width="20" height="20"/>Thông tin tài khoản
                </n-link>
                <n-link class="link-gray" to :class="active == 2 ? 'active' : ''">
                    <IconBell />Thông báo
                </n-link>
                <n-link class="link-gray" to :class="active == 3 ? 'active' : ''">
                    <IconHistory />Lịch sử giao dịch
                </n-link>
                <n-link class="link-gray" to :class="active == 4 ? 'active' : ''">
                    <IconExclamation />Trợ giúp
                </n-link>
           </div>
       </div>
   </div>
 </template>
 
 <script>
import IconExclamation from "~/assets/svg/icons/exclamation.svg?inline";
import IconUser3 from "~/assets/svg/icons/user3.svg?inline";
import IconHistory from "~/assets/svg/icons/history.svg?inline";
import IconBell from "~/assets/svg/icons/bell.svg?inline";
import IconCamera from "~/assets/svg/icons/camera.svg?inline"
 export default {
     components:{
         IconCamera,
         IconExclamation,
         IconUser3,
         IconHistory,
         IconBell
     },
     props: {
        client: {
        type: Object,
        required: true,
        default: () => {}
        },
        active: {
        type: [String, Number]
        }
    }
 }
 </script>
 
 <style lang="scss">
@import "~/assets/scss/components/department/_department-account-side.scss";
 </style>