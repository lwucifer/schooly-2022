<template>
    <div class="course-detail">
        <div class="course-detail__image">
            <n-link :to="'/course/' + course.id">
                <img :src="course.image" alt/>
            </n-link>
            <div class="course-off" v-if="course.off && course.off > 0">-{{course.off}}%</div>
        </div>

        <div class="course-detail__content">
            <n-link :to="'/course/' + course.id" class="course-detail__content-title">
               {{course.name}}
            </n-link>
            <div class="course-bottom">
                <div class="tags">
                    <IconTag/>
                    {{course.tag}}
                </div>
                <div class="price">{{course.price}}đ</div>
            </div>
        </div>

    </div>
</template>

<script>
    import IconTag from "~/assets/svg/icons/tag.svg?inline";

    export default {
        components: {
            IconTag
        },

        props: {
            course: {
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
    @import "~/assets/scss/components/course/_course-item.scss";
</style>