<template>
    <div class="customer-acc">
        <h3 class="customer-acc__title text-primary">Schoolly</h3>

        <div class="customer-acc__intro">Bạn có thể liên hệ với Dịch Vụ Khách Hàng của <n-link to="">Schoolly</n-link> theo các cách thức sau:</div>

        <div class="customer-acc__contact">
            <p><a href="tel:+18006816"><IconPhone class="mr-2 fill-gray"/> Hotline: 1900 4625</a></p>
            <p><a href="mailto: trogiup@edumall.vn"><IconEmail24px class="mr-2 fill-gray"/> trogiup@edumall.vn</a></p>
            <p><a href="https:trogiup.edumall.vn"><IconLanguage24px class="mr-2 fill-gray"/> Website: www.trogiup.edumall.vn</a></p>
        </div>

        <div class="customer-acc__note">
            Thời gian làm việc từ 7h sáng đến 24h tối các ngày trong tuần, trừ ngày lễ.
        </div>
    </div>
</template>
<script>
import IconPhone from '~/assets/svg/icons/phone.svg?inline';
import IconEmail24px from '~/assets/svg/v2-icons/email_24px.svg?inline';
import IconLanguage24px from '~/assets/svg/v2-icons/language_24px.svg?inline';

export default {
    components: {
        IconPhone,
        IconEmail24px,
        IconLanguage24px
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/info/support/_acc-customer-side.scss";
</style>