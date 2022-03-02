<template>
  <app-modal
    centered
    title="Sửa thông tin ngân hàng"
    :footer="false"
    @close="$emit('close')"
  >
    <template v-slot:content>
        <div class="row">
            <div class="col-md-4"><label for="" class="form--normal__title">Chọn ngân hàng nhận</label></div>
            <div class="col-md-8">
                <app-select
                class="mb-4"
                v-model="filters.bank"
                placeholder="Chọn ngân hàng"
                />
            </div>
            <div class="col-md-4"><label for="" class="form--normal__title">Chi nhánh</label></div>
            <div class="col-md-8">
                <app-input
                placeholder="Chi nhánh"
                v-model="filters.branch"
                />
            </div>
            <div class="col-md-4"><label for="" class="form--normal__title">Tên chủ tài khoản</label></div>
            <div class="col-md-8">
                <app-input
                placeholder="Nhập tên chủ tài khoản"
                v-model="filters.owner"
                />
            </div>
            <div class="col-md-4"><label for="" class="form--normal__title">Số tài khoản</label></div>
            <div class="col-md-8">
                <app-input
                placeholder="Nhập số tài khoản"
                v-model="filters.cardId"
                />
            </div>
            <div class="ml-auto">
                <app-button color="white" size="sm" @click="$emit('close')">
                    Hủy
                </app-button>
                <app-button size="sm" class="ml-4">
                    Lưu thay đổi
                </app-button>
            </div>
        </div>
    </template>
  </app-modal>
</template>

<script>
export default {
    data(){
        return{
            filters: {
                bank: null,
                branch: null,
                owner: null,
                cardId: null,
                amount: null
            }
        }
    }
}
</script>

<style>

</style>