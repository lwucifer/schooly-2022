<template>
    <app-modal
        centered
        :width="408"
        :component-class="{ 'new-folder-modal': true }"
        @close="$router.push('/')"
        v-if="visible"
    >
        <div slot="content">
            <a class="btn-close" @click="$emit('click-close')">X</a>
            <p class="title">Thư mục mới</p>
            <div class="form-group">
                <input type="text" v-model="name" class="form-control_border w-100" placeholder="Tên thư mục"/>
            </div>
            <div class="text-center">
                <app-button color="info" size="sm" square>Hủy bỏ</app-button>
                <app-button color="primary" size="sm" square>Đồng ý</app-button>
            </div>
        </div>
    </app-modal>
</template>

<script>
    import * as actionTypes from "~/utils/action-types";
    import {mapState, mapActions} from 'vuex';

    export default {
        components: {},
        props: {
            visible: Boolean,
        },
        computed: {},
        data() {
            return {
                name: ''
            }
        },
        methods: {},
    }
</script>

<style>

</style>