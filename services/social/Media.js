import * as APIs from "../../utils/endpoints";

export default class Media {
  constructor($axios) {
    this.$axios = $axios;
    this.$api = APIs.MEDIA;
  }

  async upload({ targetId, targetType, targetSub, fileList = [] }) {
    const formData = new FormData();
    targetType && formData.append("target_type", targetType);
    targetId && formData.append("target_id", targetId);
    targetSub && formData.append("target_sub", targetSub);

    for (let i = 0; i < fileList.length; i++) {
      formData.append("media", fileList[i]);
    }

    return await this.$axios.$post(this.$api, formData);
  }
}
