import * as APIs from "../utils/endpoints";
import * as actionTypes from "../utils/action-types";

export default class Auth {
    constructor($axios) {
        this.$axios = $axios;
    }

    async [actionTypes.AUTH.LOGIN](payload) {
        const { phone, email, password, g_recaptcha_response } = payload;
        const { data } = await this.$axios.post(`${APIs.LOGIN}`, {
            phone,
            email,
            password,
            g_recaptcha_response
        });

        return data;
    }

    async [actionTypes.AUTH.REGISTER](payload) {
        const { data } = await this.$axios.post(`${APIs.REGISTER}`, payload);
        return data;
    }

    async [actionTypes.AUTH.LOGOUT](payload) {
        const { data } = await this.$axios.post(`${APIs.LOGOUT}`, payload);
        return data;
    }

    // async [actionTypes.AUTH.SENDOTP](payload) {
    //     const { data } = await this.$axios.post(
    //         `${APIs.REGISTER_VALIDATE}`,
    //         payload
    //     );

    //     return data;
    // }

    async [actionTypes.AUTH.STATUS](payload) {
        const { data } = await this.$axios.post(
            `${APIs.REGISTER_VALIDATE}`,
            payload
        );

        return data;
    }

    async [actionTypes.AUTH.RESET_PASSWORD_REQUEST](payload) {
        const { data } = await this.$axios.post(
            `${APIs.RESET_PASSWORD_REQUEST}`,
            payload
        );
        return data;
    }

    async [actionTypes.AUTH.FORGOT_PASSWORD](payload) {
        const { data } = await this.$axios.post(`${APIs.FORGOT_PASSWORD}`, payload);
        return data;
    }

    async [actionTypes.AUTH.CHANGE_PASSWORD](payload) {
        const { data } = await this.$axios.post(`${APIs.CHANGE_PASSWORD}`, payload);

        return data;
    }
    async [actionTypes.AUTH.VERIFY_EMAIL](payload) {
        const { data } = await this.$axios.post(`${APIs.VERIFY_EMAIL}`, payload);
        return data;
    }
    // async [actionTypes.AUTH.REFRESH_TOKEN](payload) {
    //     const { data } = await this.$axios.post(`${APIs.REFRESH_TOKEN}`, payload);
    //     return data;
    // }
}