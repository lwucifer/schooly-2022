<template>
    <div class="policy-manager-side">
        <ul class="policy-manager-side-list">
            <li class="policy-manager-side-item">
                <n-link to="/policy-security"
                :class="{'active': setActive == 1}">
                    <IconPolicy class="icon mr-2"/> Chính sách bảo mật
                </n-link>
            </li>

            <li class="policy-manager-side-item">
                <n-link to="/policy-security/term-of-use"
                :class="{'active': setActive == 2}">
                    <IconBook class="icon mr-2 fill-opacity-1"/> Điều khoản sử dụng
                </n-link>
            </li>

            <li class="policy-manager-side-item">
                <n-link to="/policy-security/refund-policy"
                :class="{'active': setActive == 3}">
                    <IconMoney class="icon mr-2"/> Chính sách hoàn tiền
                </n-link>
            </li>
        </ul>
    </div>
</template>

<script>
import IconPolicy from "~/assets/svg/v2-icons/policy-security.svg?inline"
import IconBook from '~/assets/svg/v2-icons/book_24px.svg?inline'
import IconMoney from "~/assets/svg/v2-icons/money-circle.svg?inline"

export default {
    components: {
        IconPolicy,
        IconBook,
        IconMoney
    },

    props: {
        setActive: Number,
        default: 1
    }
}
</script>

<style lang="scss">
@import "~assets/scss/components/policy-security/_policy-manager-side.scss";
</style>