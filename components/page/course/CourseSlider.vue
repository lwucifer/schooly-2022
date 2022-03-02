<template>
    <div>
        <h3 class="post-slider-title" v-if="title">{{title}}</h3>
        <div v-swiper:mySwiper="currentSwiperOptions" class="post-slider" v-on="$listeners">
            <div class="swiper-wrapper">
                <div class="swiper-slide post-slider-container" v-for="(item, index) in courses" :key="index">
                    <div class="slider-item" @click="$emit('click-item', item, index)">
                        <img :src="item.image" alt/>
                    </div>

                    <n-link class="slider-title" v-if="item.name && currentSwiperOptions.showName" to>
                        {{item.name}}
                    </n-link>

                    <div class="course-bottom">
                        <div class="tags">
                            <IconTag/>
                            {{item.tag}}
                        </div>
                        <div class="price">{{item.price}}đ</div>
                    </div>

                    <div class="course-off" v-if="item.off && item.off > 0">-{{item.off}}%</div>
                </div>
            </div>

            <div class="swiper-button-prev" v-if="currentSwiperOptions.navigation">
                <IconChevronLeft/>
            </div>
            <div class="swiper-button-next" v-if="currentSwiperOptions.navigation">
                <IconChevronRight/>
            </div>
            <div class="swiper-pagination" v-if="currentSwiperOptions.pagination"></div>
        </div>
    </div>
</template>

<script>
    import {assignIn} from "lodash";
    import IconChevronLeft from "~/assets/svg/icons/chevron-left.svg?inline";
    import IconChevronRight from "~/assets/svg/icons/chevron-right.svg?inline";
    import IconPlayCircle from "~/assets/svg/icons/play-circle.svg?inline";
    import IconTag from "~/assets/svg/icons/tag.svg?inline";

    export default {
        components: {
            IconChevronLeft,
            IconChevronRight,
            IconPlayCircle,
            IconTag
        },

        props: {
            courses: {
                type: Array,
                required: true,
                default: () => []
            },

            swiperOptions: {
                type: Object,
                default: () => {
                }
            },
            title: {type: String},
        },

        data() {
            const defaultSwiperOptions = {
                slidesPerView: "auto",
                spaceBetween: 4,
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                },
                pagination: false,
                showName: false
            };

            return {
                defaultSwiperOptions,
                currentSwiperOptions: assignIn(defaultSwiperOptions, this.swiperOptions)
            };
        }
    };
</script>

<style lang="scss">
    @import "~/assets/scss/components/post/_post-slider.scss";
    @import "~/assets/scss/components/course/_course-slider.scss";
</style>