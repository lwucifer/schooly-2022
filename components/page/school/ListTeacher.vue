<template>
    <div class="list-teacher">
        <div class="list-teacher__text">
            <div class="list">Danh sách <span>Giáo Viên</span></div>

            <div class="line"></div>

            <app-button
                class="text-white"
                color="primary"
                nuxt
                :to="'?tab=intro&type=organization'"
                size="md">Xem tất cả</app-button>
        </div>
          
        <div class="list-teacher__img">
            <img src="~assets/images/school/all.png" alt="">
        </div>    
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/school/_list-teacher.scss";
</style>