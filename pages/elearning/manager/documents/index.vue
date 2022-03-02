<template>
    <div class="container">
        <div class="row">
            <div class="col-md-3">
                <ElearningManagerSide :active=5 />
            </div>

            <div class="col-md-9">
                <sub-block-section title="Tài liệu học tập">
                    <template #content>
                        <DocsFilter @search="handleSearch"/>

                        <DocsTable :loading="loading" @pagechange='pagechange' @delete='deleteRows'/>

                        <app-modal-confirm
                            v-if="showModalConfirm"
                            @ok="handleDelete"
                            :width="550"
                            @cancel="showModalConfirm = false"
                            title="Xác nhận xóa tài liệu"
                            description="Bạn có chắc chắn muốn xóa tìa liệu này"
                            />
                    </template>
                </sub-block-section>
            </div>
        </div>
    </div>
</template>

<script>
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide"
import DocsFilter from "~/components/page/elearning/manager/documents/DocsFilter"
import DocsTable from "~/components/page/elearning/manager/documents/DocsTable"

import { mapActions, mapGetters, mapState } from "vuex";
import { get } from 'lodash';

export default {
    middleware: ["teacher-role"],

    data() {
        return {
            loading: false,
            payload: {},
            showModalConfirm: false,
            ids: []
        }
    },

    components: {
        ElearningManagerSide,
        DocsFilter,
        DocsTable
    },

    created() {
        this.teachingDocsList()
    },

    computed: {
        ...mapState("auth", {
            userLogin: "token"
        }),
    },

    methods: {
        ...mapActions("elearning/teaching/teaching-documents", ["teachingDocsList", "teachingDocDelete"]),

        deleteRows(payload) {
            this.ids = payload.map((item) => item.id);
            this.showModalConfirm = true;
        },

        async handleDelete() {
            if (this.loading) return

            try {
                this.loading = true;
                const result = await this.teachingDocDelete({ids: this.ids})
                if (get(result, 'success', false)) {
                    this.$toasted.success('Xóa thành công')
                    this.teachingDocsList(this.payload)
                } else {
                    this.$toasted.error('Xóa không thành công')
                }
            } catch (e) {
            } finally {
                this.loading = false;
                this.showModalConfirm = false;
            }
        },
       
        async handleSearch(payload) {
            if (this.loading) return

            try {
                this.loading = true;
                this.payload = {...payload};

                Object.keys(this.payload).map((k) => {
                    if (this.payload[k] == null || this.payload[k] == -1) {
                        delete this.payload[k];
                    }
                });
                
                await this.teachingDocsList(this.payload)
            } catch (e) {
            } finally {
                this.loading = false;
            }
        },

        async pagechange(e) {
            if (this.loading) return

            try {
                this.loading = true;
                this.payload = {...this.payload, ...e};
                await this.teachingDocsList(this.payload)
            } catch (e) {
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>

