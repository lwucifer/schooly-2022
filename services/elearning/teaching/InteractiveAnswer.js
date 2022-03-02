import * as APIs from "~/utils/endpoints";
import BaseService from "../../BaseService";

export default class InteractiveAddAnswer extends BaseService {
    constructor($axios) {
        super($axios, APIs.TEACHING_INTERACTIVE_ANSWER);
    }
    async addAnswerOfAnswer(params, image = "") {
        let formData = new FormData();
        formData.append("image", image);
    
        let options = {
          url: APIs.TEACHING_INTERACTIVE_ANSWER,
          method: "POST",
          params,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
    
        if (image) options.data = formData;
    
        const { data } = await this.$axios.request(options);
    
        return data;
      }
}
export class InteractiveLikeAnswer extends BaseService {
    constructor($axios) {
        super($axios, APIs.TEACHING_INTERACTIVE_LIKEANSWER);
    }
}
export class InteractiveAnswerList extends BaseService {
    constructor($axios) {
        super($axios, APIs.TEACHING_INTERACTIVE_LISTANSWER);
    }
}