<template>
    <n-link class="text-decoration-none" :to="'?tab=notify&announcement_id='+data.id">
        <div class="school-noti-item">
            <div class="school-noti-item__img">
                <img src="~assets/images/school/email-2.png" alt="">
            </div>

            <div class="school-noti-item__content">
                <div class="text">{{ data.title }}</div>
                <div class="date">{{ data.updated | moment('DD/MM/YYYY') }}</div>
            </div>
        </div>
    </n-link>
</template>

<script>
import { moment } from "moment"
export default {
    props: {
        data: {
            type: Object,
            default: {}
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/school/_school-noti-item.scss";
</style>