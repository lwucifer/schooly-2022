<template>
    <div class="school-news-item">
        <div class="school-news-item__text">
            <div class="date">{{ data.updated | moment('DD/MM/YYYY') }}</div>

            <n-link :to="'?tab=news&news_id='+data.id" class="title">{{ data.title }}</n-link>
        </div>
    </div>
</template>

<script>
import { moment } from "moment"
export default {
    props: {
        data: {
            type: Object,
            default: {}
        }
    },
    data(){
        return{
            school_id: this.$route.params.id
        }
    }

}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/school/_school-news-item.scss";
</style>