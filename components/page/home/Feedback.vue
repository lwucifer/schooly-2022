<template>
    <div class="feedback">
        <div class="container">
            <div class="feedback__title">
                Nhận xét người dùng
            </div>

            <div class="feedback__swiper" @slideChange="slideChanged" v-swiper:mySwiper="swiperOption">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item, index) in feedback" :key="index">
                        <div class="feedback-item text-center">
                            <div class="feedback-item__img">
                                <img :src="item.img" alt="">
                            </div>

                            <div class="feedback-item__name text-center">{{ item.name }}</div>
                            <div class="border-line"></div>
                            <div class="feedback-item__feedback">{{ item.feedback }}</div>
                        </div>
                    </div>
                </div>

                <div class="previous">
                    <IconChevronLeft class="fill-primary" width="12px"/>
                </div>

                <div class="next">
                    <IconChevronRight class="fill-primary" width="12px"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import IconChevronLeft from '~/assets/svg/icons/chevron-left.svg?inline';
import IconChevronRight from '~/assets/svg/icons/chevron-right.svg?inline';

export default {
    data() {
        return {
            swiperOption: {
                slidesPerView: 3,
                spaceBetween: 10,
                pagination: {
                    el: '',
                    clickable: true
                },
                navigation: {
                    prevEl: '.previous',
                    nextEl: '.next'
                },

                autoplay: {
                    delay: 5000,
                },
            },
            
            feedback: [
                {"img": "/images/home/feedback-1.png", "name": "Hà Sơn Hải", "feedback": "Các hệ thống E-Learning dành cho các trường phổ thông hiện nay đa phần đều rất khó sử dụng. Với Schoolly, mọi thứ trở nên thật dễ dàng."},
                {"img": "/images/home/feedback-2.png", "name": "Đỗ Văn Nam", "feedback": "Hệ thống các bài giảng đa dạng, phong phú. Giao diện cũng rất bắt mắt và trực quan nên mình học tập cũng thấy hứng thú hơn."},
                {"img": "/images/home/feedback-3.png", "name": "Nguyễn Tiến Linh", "feedback": "Với một giáo viên không có nhiều kiến thức về máy tính như tôi thì việc tạo nội dung học tập trực tuyến phải thật đơn giản. Và Schoolly đã đáp ứng được điều đó. Cảm ơn các bạn!"},
                // {"img": "/images/home/feedback-1.png", "name": "Arlene Warren", "feedback": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. "},
                // {"img": "/images/home/feedback-2.png", "name": "Julie Miles", "feedback": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. "},
                // {"img": "/images/home/feedback-3.png", "name": "Leslie Howard", "feedback": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. "}
            ],
        }
    },

    components: {
        IconChevronLeft,
        IconChevronRight
    },

    methods: {
        slideChanged(e) {
            this.currentSlider = this.mySwiper.activeIndex + 1;
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/home/_feedback.scss";
</style>