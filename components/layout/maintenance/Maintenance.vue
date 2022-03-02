<template>
    <div class="container">
        <div class="maintain">
            <div class="text-center mb-5">
                <IconMaintain/>
            </div>

            <h1 class="maintain__title mb-4">Hệ thống bảo trì</h1>

            <p class="maintain__content mb-5">Hệ thống đang tạm dừng hoạt động để bảo trì. Chúng tôi xin lỗi vì sự bất tiện này.</p>

            <app-button
                class="maintain__button-back" 
                size="md" 
                color="primary"
            >
                <n-link to="/">
                <IconArrowLeft class="mr-2"/> Quay lại trang chủ
                </n-link>
            </app-button>
        </div>
    </div>
</template>

<script>
import IconArrowLeft  from "~/assets/svg/design-icons/arrow-left.svg?inline"
import IconMaintain from "~/assets/svg/logo/maintenance.svg?inline"
export default {
    components: {
        IconArrowLeft,
        IconMaintain
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/pages/_maintenance.scss";
</style>