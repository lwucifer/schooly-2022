<template>
    <div class="school-detail">
        <div class="school-detail__image">
            <n-link :to="'/school/' + school.id">
                <img :src="school.avatar" alt/>
            </n-link>
        </div>

        <div class="school-detail__content">
            <n-link :to="'/school/' + school.id" class="school-detail__content-title">
               {{school.name}}
            </n-link>
            <div class="school-detail__content-info">
                <IconPoint/>
                <span>{{school.address}} {{school.ward}} {{school.district}} {{school.province}}</span>
            </div>
            <div class="school-detail__content-info">
                <IconUser/>
                <span>{{school.students}} chỉ tiêu</span>
            </div>
        </div>
    </div>
</template>

<script>
    import IconPoint from "~/assets/svg/icons/point.svg?inline";
    import IconUser from "~/assets/svg/icons/user.svg?inline";

    export default {
        components: {
            IconPoint,
            IconUser
        },

        props: {
            school: {
                type: Object,
                required: true,
                default: () => {},
            },
        },

        data() {
            return {
                isAuthenticated: true,
            }
        }
    }
</script>

<style lang="scss">
    @import "~/assets/scss/components/school/_school-detail.scss";
</style>