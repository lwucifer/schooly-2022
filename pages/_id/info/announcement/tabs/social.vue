<template>
  <div>
      <div v-for="index in 6" :key="index">
          <AnnoucementItem />
          <hr>
      </div>
  </div>
</template>

<script>
import AnnoucementItem from "~/components/page/account/Info/AnnouncementItem"
export default {
    layout: 'account-info',
    
    components:{
        AnnoucementItem
    },
    data(){
       return{
           notifies:[
               {
                   id:"1",
                   type:"PUBLIC",
                   title:"Thông báo",
                   desciption:"You are running Vue in developmentdevelopment mode.Make sure to turn on production mode when deploying for production.",
                   timstamp:"8:00",
                   read:true
               },
               {
                   id:"1",
                   type:"PUBLIC",
                   title:"Thông báo",
                   desciption:"You are running Vue in developmentdevelopment mode.Make sure to turn on production mode when deploying for production.",
                   timstamp:"8:00",
                   read:true
               }
           ]
       }
    }
}
</script>

<style lang="scss">

</style>