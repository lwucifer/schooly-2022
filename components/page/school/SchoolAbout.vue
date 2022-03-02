<template>
    <div class="school-about">
        <div class="row">
            <div class="school-about__image col-4">
                <img :src="school.avatar" alt/>
            </div>

            <div class="school-about__content col-8">
                <h2 class="school-about__content-title">{{school.name}}</h2>
                <div class="school-about__content-desc">
                    <h3>Giới thiệu</h3>
                    <div class="description" v-html="school.description"></div>
                </div>
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
            }
        }
    }
</script>

<style lang="scss">
    @import "~/assets/scss/components/school/_school-about.scss";
</style>