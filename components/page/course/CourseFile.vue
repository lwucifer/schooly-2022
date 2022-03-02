<template>
    <div class="course-file">
        <n-link to>
            <img :src="file.thumb" alt/>
            <div class="name">
                <IconVideo v-if="file.type === 1"/>
                <IconImage v-else-if="file.type === 2"/>
                <IconMusic v-else-if="file.type === 3"/>
                <IconZip v-else/>
                <span>{{file.name}}</span>
            </div>
        </n-link>
    </div>
</template>

<script>
    import IconVideo from "~/assets/svg/icons/video.svg?inline";
    import IconImage from "~/assets/svg/icons/image.svg?inline";
    import IconMusic from "~/assets/svg/icons/music.svg?inline";
    import IconZip from "~/assets/svg/icons/zip.svg?inline";

    export default {
        components: {
            IconZip,
            IconMusic,
            IconImage,
            IconVideo,
        },

        props: {
            file: {
                type: Object,
                required: true,
                default: () => {},
            },
        },
    }
</script>

<style lang="scss">
    @import "~/assets/scss/components/course/_course-file.scss";
</style>