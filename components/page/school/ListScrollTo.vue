<template>
  <div class="list-scroll">
    <span @click.prevent="changeTab('index')">
        <n-link 
            :class="tab=='index' ?  'active' : ''"
            to
         >
            Trang chủ
         </n-link>
    </span>
    <span  @click.prevent="changeTab('intro')">
        <n-link 
            to 
            :class="tab=='intro' ?  'active' : ''" 
        >
            Giới thiệu <IconCaretDownThin class="ml-2"/>
        </n-link>
    </span> 
    <span  @click.prevent="changeTab('courses')">
        <n-link 
            to=""
            :class="tab=='courses' ?  'active' : ''" 
        >
            Bài giảng - Khóa học
        </n-link>
    </span>
    <span @click.prevent="changeTab('notify')">
        <n-link 
            to=""
            :class="tab=='notify' ?  'active' : ''" 
        >
            Thông báo <IconCaretDownThin class="ml-2"/>
        </n-link>
    </span>
    <span   @click.prevent="changeTab('news')">
        <n-link 
            to=""
            :class="tab=='news' ?  'active' : ''" 
        >
            Tin tức - Sự kiện <IconCaretDownThin class="ml-2"/>
        </n-link>
    </span>
    <span @click.prevent="changeTab('schedule')">
        <n-link 
            to=""
            :class="tab=='schedule' ?  'active' : ''" 
        >
            Thời khóa biểu
        </n-link>
    </span>
  </div>
</template>

<script>
import IconCaretDownThin from '~/assets/svg/icons/caret-down-thin.svg?inline';

export default {
    components: {
        IconCaretDownThin
    },
    props:{
        tab:{
            type: String,
            default:''
        }
    },
    methods:{
        changeTab(tab){
            this.$emit('changeTab',tab)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/school/_list-scrollto.scss";
</style>