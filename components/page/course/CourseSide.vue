<template>
    <div class="course-folder__side">
        <div class="course-teacher">
            <app-avatar :src="teacher.avatar" :size="125"/>
            <p class="course-teacher__name">{{teacher.name}}</p>
            <p>Giảng viên</p>
            <n-link square class="mt-3 btn btn--color-primary btn--square color-white" to="/course/create">Tạo khóa học</n-link>
        </div>
        <div class="course-folder__side-links">
            <n-link class="link-gray" to>Khóa học</n-link>
            <n-link class="link-gray" to>Kho nhập liệu</n-link>
        </div>
    </div>
</template>

<script>
    export default {
        components: {
        },

        data() {
            return {
                isAuthenticated: true,
                teacher: {
                    id: '1',
                    name: 'Savannah Mckinney',
                    avatar: 'https://picsum.photos/125/125',
                },
            }
        }
    }
</script>

<style lang="scss">
    @import "~/assets/scss/components/course/_course.scss";
</style>